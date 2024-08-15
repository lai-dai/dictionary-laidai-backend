"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
const app_error_1 = require("../_lib/utils/app-error");
const http_status_codes_1 = require("http-status-codes");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new app_error_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new app_error_1.AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new app_error_1.AppError(message, 400);
};
const handleJWTError = () => new app_error_1.AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new app_error_1.AppError('Your token has expired! Please log in again.', 401);
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming or other unknown error: don't leak error details
    }
    else {
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};
const globalError = (err, req, res, next) => {
    err.statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    err.status = (err === null || err === void 0 ? void 0 : err.status) || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err);
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
exports.globalError = globalError;
