import { body } from "express-validator"

const equalPasswords = async (psw, { req }) => {
    if (psw !== req.body.password)
        throw new Error(`Passwords don't match`)
}

export default [
    body(`password`,`Password is obligatory field`)
        .exists()
        .bail()
        .isLength({ min: 5, max: 255 })
        .withMessage(`Login length should be mre than 5 and less than 255`)
        .escape(),
    body(`repeatPassword`, `Confirmed password is obligatory field`)
        .exists()
        .bail()
        .withMessage(`Password confirmation should be provided`)
        .custom(equalPasswords)
        .escape(),
];