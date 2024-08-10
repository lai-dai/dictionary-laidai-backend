"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const status_name_1 = require("../constants/status-name");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? status_name_1.STATUS_NAME.FAIL : status_name_1.STATUS_NAME.ERROR;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
