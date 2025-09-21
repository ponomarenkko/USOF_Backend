import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const models = sequelize.models;

// Middleware: получает категории по переданным id
export default function getCategoriesByIds(req, res, next) {
    sequelize.inTransaction(async transaction => {
        return await models.Category.findAll({
            where: { id: req.body.categories },
            transaction
        })
    })
        .then(categories => {
            if (!categories || categories.length === 0)
                return next(new ServerError(`Categories not found`, 404))

            req.categories = categories // сохраняем найденные категории в запрос
            next()
        })
        .catch(err => {
            return transactionErrorHandler(
                retryError(getCategoriesByIds, err),
                req, res, next
            )
        })
}

