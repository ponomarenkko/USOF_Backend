import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const Op = sequelize.Sequelize.Op;
const models = sequelize.models;

// Middleware для проверки уникальности email и логина при регистрации/обновлении пользователя
export default function checkEmailOrLoginExists(req, res, next) {
    // Используем транзакцию для поиска пользователя с таким же email или логином
    sequelize.inTransaction(async transaction => {
        return await models.User.findOne({
            where: {
                [Op.or]: [
                    { login: req.body.login },
                    { email: req.body.email }
                ]
            },
            transaction
        });
    })
        .then(user => {
            // Если найден пользователь с тем же email 409
            if (user?.email === req.body.email)
                return next(new ServerError(`E-mail already in use`, 409));

            // Если найден пользователь с тем же логином 409 
            if (user?.login === req.body.login)
                return next(new ServerError(`Login already in use`, 409));

            // Если совпадений нет → продолжаем обработку запроса
            next();
        })
        .catch(err => {
            // Если произошла ошибка в транзакции или соединении, обрабатываем её централизованным обработчиком ошибок
            return transactionErrorHandler(
                retryError(checkEmailOrLoginExists, err),
                req,
                res,
                next
            );
        });
}

