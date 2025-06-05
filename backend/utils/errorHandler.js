class ErrorHandler extends Error {
    constructor(message, statusCode) {
        // super is the constructor of the parent class which is Error
        super(message)
        this.statusCode = statusCode;

        // Create stack property
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ErrorHandler