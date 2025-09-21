import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const models = sequelize.models;

// Middleware: получает категорию по id
export default function getCategoryById(req, res, next) {
    sequelize.inTransaction(async transaction => {
        return await models.Category.findByPk(req.body.id, { transaction })
    })
        .then(category => {
            if (!category)
                return next(new ServerError(`Category not found`, 404))

            req.category = category // сохраняем категорию в запрос
            next()
        })
        .catch(err => {
            return transactionErrorHandler(
                retryError(getCategoryById, err),
                req, res, next
            )
        })
}

