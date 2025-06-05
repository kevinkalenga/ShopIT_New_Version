import ErrorHandler from "../utils/errorHandler.js"

export default (err, req, res, next) => {
    // Error that contains statusCode
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error",
    };

    
    res.status(error.statusCode).json({
        message: error.message,
    })
  


};