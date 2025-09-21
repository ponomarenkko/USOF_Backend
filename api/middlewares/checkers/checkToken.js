import jwt from "jsonwebtoken"
import ServerError from "../../errors/ServerError.js";

export default (req, res, next) => {
    try {
        jwt.verify(req.body.token, process.env.JWT_KEY, {
            jwtid: req.user.token.uuid
        })
    } catch (err) {
        return next(new ServerError(`Invalid or expired token`, 401))
    }
    next()
}