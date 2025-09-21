import ServerError from "../ServerError.js";

export default (err, req, res, next) => {
    if (err?.original?.sqlState === '40001') {    // log this
        console.log(`Deadlock. Retrying...`)
        return err.retry(req, res, next)
    }

    if (next)
        return next(new ServerError(err.message, 500))
}