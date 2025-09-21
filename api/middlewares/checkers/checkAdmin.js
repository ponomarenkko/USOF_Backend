import ServerError from "../../errors/ServerError.js";

// Middleware для проверки прав администратора
export default (req, res, next) => {
    if (req.user.role === `user`)
        return next(
            // Передаём ошибку в обработчик ошибок
            new ServerError(`You need to be an admin`, 403) // 403 — запрет (Forbidden)
        )

    // Если роль не "user" (например, admin или superadmin),передаём управление дальше.
    next()
}

