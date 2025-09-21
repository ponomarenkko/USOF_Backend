import ServerError from "../../errors/ServerError.js";

export default function checkOwner(req, res, next) {
    // Проверяем: либо пользователь совпадает с ownerId из тела запроса,
    // либо он имеет роль администратора
    if (req.user.id !== req.body.ownerId && req.user.role !== `admin`)
        return next(new ServerError(`You are not the owner`, 403))
    // Если проверка пройдена → передаём выполнение дальше
    return next()
}
