import ServerError from "../../errors/ServerError.js";

// Middleware для проверки, что пост находится в состоянии "locked"
export default (req, res, next) => {
    // Если у поста нет lockId → значит, он не заблокирован
    if (!req.post.lockId)
        return next(
            // Возвращаем ошибку 403 
            new ServerError(`Post needs to be locked`, 403)
        )

    // Если пост заблокирован — передаём управление дальше
    next()
}

