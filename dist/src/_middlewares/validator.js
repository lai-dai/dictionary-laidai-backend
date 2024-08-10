"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorBody = exports.validatorQuery = void 0;
const app_error_1 = require("../_lib/utils/app-error");
const http_status_codes_1 = require("http-status-codes");
const validatorQuery = (schema) => (req, res, next) => {
    try {
        const query = schema.parse(req.query);
        req.query = query;
        next();
    }
    catch (err) {
        next(new app_error_1.AppError(err.errors
            .map((e) => `${e.path.join('.')} is ${e.message}`)
            .join(', '), http_status_codes_1.StatusCodes.BAD_REQUEST));
    }
};
exports.validatorQuery = validatorQuery;
const validatorBody = (schema) => (req, res, next) => {
    try {
        const body = schema.parse(req.body);
        req.body = body;
        next();
    }
    catch (err) {
        next(new app_error_1.AppError(err.errors
            .map((e) => `${e.path.join('.')} is ${e.message}`)
            .join(', '), http_status_codes_1.StatusCodes.BAD_REQUEST));
    }
};
exports.validatorBody = validatorBody;
