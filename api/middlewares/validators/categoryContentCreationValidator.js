import { body } from "express-validator"

export default [
    body(`content`, `Content is obligatory field`)
        .exists()
        .bail()
        .trim()
        .isLength({ min: 10, max: 1000})
        .withMessage(`Content length should be more than 10 and less than 1000`)
        .escape()
]