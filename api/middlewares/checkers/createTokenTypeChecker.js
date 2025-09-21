import ServerError from "../../errors/ServerError.js";

export default (type) => {
    return (req, res, next) => {
    // Проверяем, совпадает ли тип токена пользователя с ожидаемым
        if (req.user.token.type !== type)
            return next(new ServerError(`Invalid or expired token`, 401))
            // Если тип токена совпадает → передаём выполнение дальше
        next()
    }
}
