export default class ServerError extends Error {
    constructor(message, code) {
        super(message);
        if (typeof code === `number`)
            this.code = code
        else
            this.code = 500
    }
}