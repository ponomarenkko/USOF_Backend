import ServerError from "../../errors/ServerError.js";

export default (req, res, next) => {
    // Если e-mail не подтверждён → запрещаем доступ к ресурсу
    if (!req.user.verified)
        return next(new ServerError(`E-mail doesn't verified`, 403))
        // Если e-mail подтверждён → передаём выполнение дальше
    next()
}
