import ServerError from "../../errors/ServerError.js";

export default (req, res, next) => {
    if (req.user.verified)
        return next(new ServerError(`E-mail is already verified`, 403))
    next()
}