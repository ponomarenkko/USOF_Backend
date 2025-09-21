import ServerError from "../ServerError.js";

export default (req, res, next) => {
    next(new ServerError("Route not found", 404))
}