import ErrorHandler from "../utils/errorHandler.js"

export default (err, req, res, next) => {
    // Error that contains statusCode
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error",
    };

      // Handle Invalid Mongoose Duplicate Key Error

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`
        error = new ErrorHandler(message, 400)
    }
    
    
    // Handle Invalid Mongoose ID Error 

    if (error.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err?.path}`
        error = new ErrorHandler(message, 404)
    }

    // Handle validation Error
    if (error.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message)
        error = new ErrorHandler(message, 400)
    }

    // Handle Invalid Mongoose Duplicate Key Error

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`
        error = new ErrorHandler(message, 400)
    }

    // Handle wrong JWT Error 

    if (error.name === 'JsonWebTokenError') {
        const message = `JSON Web Token is invalid. Try Again!!!`;
        error = new ErrorHandler(message, 400)
    }
    // Handle expired JWT Error 

    if (error.name === 'TokenExpiredError') {
        const message = `JSON Web Token is expired. Try Again!!!`;
        error = new ErrorHandler(message, 400)
    }
   
   
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