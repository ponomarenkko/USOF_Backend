import { body } from "express-validator"

export default [
    body(`title`, `Title is obligatory field`)
        .exists()
        .bail()
        .trim()
        .isLength({ min: 1, max: 40})
        .withMessage(`Title length should be more than 1 and less than 40`)
        .escape()
]