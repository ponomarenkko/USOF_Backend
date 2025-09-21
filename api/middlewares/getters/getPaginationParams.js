import ServerError from "../../errors/ServerError.js";
export default function (req, res, next) {
    try {
        req.page = {
            offset: parseInt((req.query.page - 1) * req.query.size, 10),
            limit: parseInt(req.query.size, 10)
        }
        next()
    } catch (err) {
        // Если что-то пошло не так при расчёте — отдаём 500
        next(new ServerError(`Pagination calculation error`, 500))
    }
}

