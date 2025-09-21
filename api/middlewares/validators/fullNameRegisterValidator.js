import {body} from "express-validator"

export default [
    body(`fullName`)
        .trim()
        .isLength( { max: 255 })
        .withMessage(`Full name length should be less than 255`)
        .escape()
        .default(undefined),
]