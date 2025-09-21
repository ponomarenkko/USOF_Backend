import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const models = sequelize.models;

// Middleware: получает комментарий по id вместе с автором и отметкой (like/dislike) от текущего пользователя
export default function getCommentById(req, res, next) {
    // Включаем автора комментария
    let include = [{
        model: models.User,
        as: `author`
    }]

    // Подгружаем отметку (like/dislike) только для текущего пользователя
    let includeMarks = {
        model: models.Mark,
        limit: 1,
        where: {
            userId: req.user?.id,
            markableType: `comment`,
        }
    }

    // Добавляем marks в include, если пользователь авторизован
    if (req.user)
        include.push(includeMarks)

    sequelize.inTransaction(async transaction => {
        return await models.Comment.findByPk(req.body.id, {
            include,
            transaction
        })
    })
        .then(comment => {
            // Если комментарий не найден → ошибка 404
            if (!comment)
                return next(new ServerError(`Comment not found`, 404))
            // Если отметка есть, сохраняем её в req.mark
            req.mark = null
            if (comment.Marks)
                req.mark = comment.Marks[0]

            // Сохраняем комментарий и владельца для дальнейших проверок
            req.comment = comment
            req.body.ownerId = comment.userId
            next()
        })
        .catch(err => {
            // Централизованная обработка ошибок транзакции
            return transactionErrorHandler(
                retryError(getCommentById, err),
                req, res, next
            )
        })
}

