import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const models = sequelize.models;
export default function getPostById(req, res, next) {
    // Базовые include: блокировка, категории и автор
    let include = [
        {
            model: models.Token,
            as: `lock`,
            include: {
                model: models.User,
                as: `owner`,
            },
        },
        { model: models.Category, as: `categories` },
        { model: models.User, as: `author` },
    ];

    // Если пользователь авторизован — добавляем его отметку
    let includeMarks = {
        model: models.Mark,
        limit: 1,
        where: {
            userId: req.user?.id,
            markableType: `post`,
        },
    };
    if (req.user) include.push(includeMarks);

    sequelize
        .inTransaction(async (transaction) => {
            return await models.Post.findByPk(req.body.id, {
                include,
                transaction,
            });
        })
        .then((post) => {
            if (!post)
                return next(new ServerError(`Post not found`, 404));

            // Сохраняем отметку (если есть) и сам пост
            req.mark = null;
            if (post.Marks) req.mark = post.Marks[0];

            req.post = post;
            req.body.ownerId = post.userId;
            next();
        })
        .catch((err) => {
            return transactionErrorHandler(
                retryError(getPostById, err),
                req,
                res,
                next,
            );
        });
}

