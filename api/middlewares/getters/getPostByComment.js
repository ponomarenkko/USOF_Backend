import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const models = sequelize.models;
export default function getPostByComment(req, res, next) {
    sequelize.inTransaction(async transaction => {
        // Получаем пост через связь у Comment
        return await req.comment.getPost({
            include: [
                { model: models.Token, as: `lock` },
                { model: models.Category, as: `categories` },
                { model: models.User, as: `author` }
            ],
            transaction
        });
    })
        .then(post => {
            if (!post)
                return next(new ServerError(`Post not found`, 404));

            // Пробрасываем пост и id владельца дальше по пайплайну
            req.post = post;
            req.body.ownerId = post.userId;
            next();
        })
        .catch(err => {
            // Централизованная обработка ошибок БД/транзакций с возможной повторной попыткой
            return transactionErrorHandler(
                retryError(getPostByComment, err),
                req, res, next
            );
        });
}

