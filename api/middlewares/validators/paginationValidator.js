import { query } from "express-validator"

// const toBody = async (query, { req }) => {
//     req.body.page = {
//         page: query.page,
//         size: query.size
//     }
// }

export default [
    query('page')
        .default(1)
        .isInt({min: 1})
        .escape(),
    query(`size`)
        .default(10)
        .isInt({min: 1, max: 50})
        .escape(),
    // query()
    //     .custom(toBody)
]