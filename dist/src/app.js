"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const path_1 = __importDefault(require("path"));
const http_status_codes_1 = require("http-status-codes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const app_error_1 = require("./_lib/utils/app-error");
const global_error_1 = require("./_middlewares/global-error");
const route_1 = require("./auth/route");
const route_2 = require("./users/route");
const route_3 = require("./part-of-speech/route");
const route_4 = require("./examples/route");
const route_5 = require("./definitions/route");
const route_6 = require("./meanings/route");
const route_7 = require("./words/route");
const route_8 = require("./favorites/route");
const route_9 = require("./idioms/route");
const route_10 = require("./comments/route");
exports.app = (0, express_1.default)();
// app.enable('trust proxy')
// 1) GLOBAL MIDDLEWARES
// Implement CORS
exports.app.use((0, cors_1.default)());
exports.app.options('*', (0, cors_1.default)());
// Serving static files
exports.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Set security HTTP headers
exports.app.use((0, helmet_1.default)());
// Development logging
if (process.env.NODE_ENV === 'development') {
    exports.app.use((0, morgan_1.default)('dev'));
}
// Limit requests from same API
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
exports.app.use('/api', limiter);
// parse requests of content-type - application/json
exports.app.use(express_1.default.json({ limit: '10kb' }));
// parse requests of content-type - application/x-www-form-urlencoded
exports.app.use(express_1.default.urlencoded({ extended: false, limit: '10kb' }));
exports.app.use((0, cookie_parser_1.default)());
// Data sanitization against NoSQL query injection
exports.app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
// app.use(xss())
// Prevent parameter pollution
exports.app.use((0, hpp_1.default)());
exports.app.use((0, compression_1.default)());
// ROUTES
exports.app.use('/api/v1/auth', route_1.router);
exports.app.use('/api/v1/users', route_2.router);
exports.app.use('/api/v1/partOfSpeeches', route_3.router);
exports.app.use('/api/v1/examples', route_4.router);
exports.app.use('/api/v1/definitions', route_5.router);
exports.app.use('/api/v1/meanings', route_6.router);
exports.app.use('/api/v1/words', route_7.router);
exports.app.use('/api/v1/favorites', route_8.router);
exports.app.use('/api/v1/idioms', route_9.router);
exports.app.use('/api/v1/comments', route_10.router);
exports.app.all('*', (req, res, next) => {
    next(new app_error_1.AppError(`Can't find ${req.originalUrl} on this server!`, http_status_codes_1.StatusCodes.NOT_FOUND));
});
// global error handler
exports.app.use(global_error_1.globalError);
