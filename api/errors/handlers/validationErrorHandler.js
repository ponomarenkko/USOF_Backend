import { validationResult } from "express-validator"
import ServerError from "../ServerError.js";

export default (req, res, next) => {
    const result = validationResult(req)

    if (!result.isEmpty()) {
        const error = new ServerError('Validation error', 400)

        error.errors = result.errors
        next(error)
    }
    next()
}