import multer from "multer"
import { v4 as uuid } from "uuid"
import fs from "fs";
import path from "path";
import ServerError from "../errors/ServerError.js";

import imagemin from "imagemin"
import imageminWebp from 'imagemin-webp';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const id = req.fileUuid = uuid()
        const uploadPath  = req.uploadPath = path.join('./uploads/uncompressed/', id.charAt(0), id.charAt(1))

        if (!fs.existsSync(uploadPath))
            fs.mkdirSync(uploadPath, { recursive: true })

        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const id = req.fileUuid
        const newFilename = id + `.webp`

        req.filePath = path.join(req.uploadPath, newFilename)

        cb(null, newFilename)
    }
})

const fileFilter = (req, file, cb) => {
    switch (file.mimetype) {
        case 'image/jpeg':
        case `image/png`:
        case `image/webp`:
            cb(null, true)
            break
        default:
            cb(new ServerError(`Unsupported file type. Only jpeg/jpg/png/webp`), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

upload.singleWithHandler = (field) => {
    return (req, res, next) => {
        upload.single(field)(req, res, async (err) => {
            if (err)
                return next(new ServerError(err.message, 400))

            return next()
        })
    }
}

upload.compressImage = async (oldPath, newPath) => {
    const file = imagemin([oldPath], {
        destination: newPath,
        plugins: [
            imageminWebp()
        ]
    })
        .then(() => {
            upload.deleteFile(oldPath)
        })

}

upload.deleteFile = (filePath) => {
    if (fs.existsSync(filePath))
        fs.unlinkSync(filePath)
}

const compressImage = (req, res, next) => {
    try {
        if (req.filePath) {
            const newUploadPath = req.uploadPath.replace(`uncompressed`, 'compressed')
            const newFilePath = req.filePath.replace(`uncompressed`, 'compressed')

            upload.compressImage(req.filePath, newUploadPath)
                .then(() => {
                    req.uploadPath = newUploadPath
                    req.filePath = newFilePath
                })
        }
    } catch (err) {
        console.log('Compress failed') // TODO: log this
    }
    next()
}

export { upload as default, compressImage }