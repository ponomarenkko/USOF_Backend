import { body } from "express-validator";

const roles = [`user`, `admin`]

export default [
    body(`role`, `Invalid role`)
        .default('user')
        .trim()
        .isIn(roles)
]