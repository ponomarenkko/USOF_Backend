import upload from "../../middlewares/imageUploader.js";

export default (err, req, res, next) => {
    upload.deleteFile(req.filePath)

    res.status(err.code || 500)
    res.json({
        message: err.message,
        errors: err.errors,
        method: req.method,
        url: req.url,
        // body: req.body
    })
}