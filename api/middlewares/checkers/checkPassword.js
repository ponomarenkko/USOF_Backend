import bcrypt from "bcrypt"
import ServerError from "../../errors/ServerError.js";

export default (req, res, next) => {
    if (!bcrypt.compareSync(req.body.password, req.user.password))
        return next(new ServerError(`Invalid login or password`, 401))
    next()
}