export default (fn, error) => {
    error.retry = fn

    return error
}