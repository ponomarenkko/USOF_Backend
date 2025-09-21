import { body } from "express-validator"

export default [
    body(`title`, `Title is obligatory field`)
        .exists()
        .bail()
        .trim()
        .isLength({ min: 10, max: 150})
        .withMessage(`Title length should be more than 10 and less than 150`)
        .escape()
]