import ServerError from "../../errors/ServerError.js";

// Middleware для проверки, что у объекта установлен именно "dislike" от пользователя
export default function checkNotDisliked(req, res, next) {
    if (req.mark?.type !== `dislike`)
        return next(
            // Если dislike отсутствует, 403 
            new ServerError(`Dislike isn't set`, 403)
        )

    // передаём управление дальше
    next()
}

