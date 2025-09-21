import ServerError from "../../errors/ServerError.js";

// Middleware для проверки, что у пользователя ещё не стоит "dislike"
export default function checkNotDisliked(req, res, next) {
    // Если в объекте mark уже есть дизлайк → запрещаем повторное действие
    if (req.mark?.type === `dislike`)
        return next(
            // Возвращаем ошибку 403 (Forbidden), так как дизлайк уже установлен
            new ServerError(`Dislike is already set`, 403)
        )

    // Если дизлайк ещё не установлен → передаём выполнение дальше
    next()
}

