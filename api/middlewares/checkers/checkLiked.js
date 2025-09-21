import ServerError from "../../errors/ServerError.js";
export default function checkNotLiked(req, res, next) {
    // Проверяем, что объект mark существует и его тип равен "like"
    if (req.mark?.type !== `like`)
        return next(
            // Если лайк не установлен → возвращаем ошибку 403 (Forbidden)
            new ServerError(`Like isn't set`, 403)
        )

    // Если условие прошло — передаём выполнение дальше
    next()
}

