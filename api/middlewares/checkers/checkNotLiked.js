import ServerError from "../../errors/ServerError.js";

/**
 * Middleware для проверки, что у пользователя ещё не установлен "like".
 * Используется, например, перед добавлением нового лайка,
 * чтобы предотвратить дублирование.
 */
export default function checkNotLiked(req, res, next) {
    // Если у объекта mark уже есть лайк → запрещаем повторное добавление
    if (req.mark?.type === `like`)
        return next(
            // Возвращаем ошибку 403 
            new ServerError(`Like is already set`, 403)
        )

    // Если лайка ещё нет → передаём выполнение дальше
    next()
}

