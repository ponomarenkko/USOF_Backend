import { body } from "express-validator"

export default [
    body(`login`, `Login is obligatory field`)
        .exists()
        .bail()
        .trim()
        .isAlphanumeric()
        .withMessage(`Login must contains only alphabetic and digit symbols`)
        .bail()
        .isLength({ min: 5, max: 40 })
        .withMessage(`Login length should be more than 5 and less than 40`)
        .bail()
        .escape(),
];