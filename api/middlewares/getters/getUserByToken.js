import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const models = sequelize.models;
export default function getUserByToken(req, res, next) {
    sequelize
        .inTransaction(async (transaction) => {
            // Ищем токен по его ID
            const token = await models.Token.findByPk(req.token.tokenId, { transaction });
            // Если токен найден — получаем его владельца
            const user = await token?.getOwner({ transaction });
            return { user, token };
        })
        .then(({ user, token }) => {
            if (!token || !user)
                return next(new ServerError(`Invalid or expired token`, 401));

            // Добавляем токен в объект пользователя
            user.token = token;
            req.user = user;

            next();
        })
        .catch((err) => {
            // Централизованная обработка ошибок с возможной повторной попыткой
            return transactionErrorHandler(
                retryError(getUserByToken, err),
                req,
                res,
                next,
            );
        });
}

