export default function optional(fn) {
    return (req, res, next) => {
        try {
            fn(req, res, (err) => {
                next()
            })
        } catch (err) {
            next()
        }
    }
}

// function f(err) {
//     console.log(`in next`)
//     next()
//     // throw err
// }