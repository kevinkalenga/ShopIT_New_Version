import ErrorHandler from "../utils/errorHandler.js"

export default (err, req, res, next) => {
    // Error that contains statusCode
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error",
    };

    
   // we show the stack in the development when there is an error
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack,
        });
    }
    if (process.env.NODE_ENV === 'PRODUCTION') {
        res.status(error.statusCode).json({
            message: error.message,
        });
    }


};