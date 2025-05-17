const AppError = require('./AppError');

const handleSequelizeError = (err) => {
    if (err.name === 'SequelizeValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join('. ');
        return new AppError(message, 400);
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = Object.values(err.errors).map(val => val.message).join('. ');
        return new AppError(message, 400);
    }
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return new AppError('Invalid reference data', 400);
    }
    return err;
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    } 
    // Programming or other unknown error: don't leak error details
    else {
        // Log error
        console.error('ERROR 💥', err);
        
        // Send generic message
        res.status(500).json({
            success: false,
            message: 'Something went wrong!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };
    error.message = err.message;

    // Handle specific errors
    if (err.name?.startsWith('Sequelize')) error = handleSequelizeError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else {
        sendErrorProd(error, res);
    }
}; 