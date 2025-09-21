import { body } from "express-validator"

const loginOrEmail = async (body, { req }) => {
    if (!body.email && !body.login)
        throw new Error(`Login or Email are required`)
}

export default [
    body()
        .custom(loginOrEmail),
    body([`login`, `email`])
        .trim()
        .escape()
]