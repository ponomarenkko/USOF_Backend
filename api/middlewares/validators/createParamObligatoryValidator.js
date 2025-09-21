import { param } from "express-validator"

export default (field, fieldName) => {
    if (!fieldName)
        fieldName = field.slice(0, 1).toUpperCase() + field.slice(1).toLowerCase()

    return param(field, `${fieldName} is obligatory parameter`)
        .exists()
        .bail()
        .trim()
        .custom((param, { req }) => {
            req.body[field] = param
            return true
        })
        .escape()
}