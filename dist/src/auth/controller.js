"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleAccount = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.isLoggedIn = exports.protect = exports.logout = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const crypto_1 = __importDefault(require("crypto"));
const _db_1 = require("../_db");
const token_1 = require("../_lib/utils/token");
const catch_async_1 = require("../_lib/utils/catch-async");
const password_1 = require("../_lib/utils/password");
const status_name_1 = require("../_lib/constants/status-name");
const app_error_1 = require("../_lib/utils/app-error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const delve_1 = require("../_lib/utils/delve");
const email_1 = require("../_lib/utils/email");
const sequelize_1 = require("sequelize");
const google_auth_library_1 = require("google-auth-library");
const createSendToken = (user, statusCode, req, res, message) => {
    const token = (0, token_1.signToken)(user.id);
    res.cookie('jwt', token, {
        expires: new Date(Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    // Remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: status_name_1.STATUS_NAME.SUCCESS,
        message,
        data: {
            token,
            user,
        },
    });
};
exports.register = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password: _password } = req.body;
    const user = yield _db_1.models.User.findOne({
        where: { email },
        attributes: {
            exclude: [
                'passwordChangedAt',
                'passwordResetToken',
                'passwordResetExpires',
            ],
        },
    });
    if (user) {
        return next(new app_error_1.AppError('Email already exists', http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    const password = yield (0, password_1.encryptPassword)(_password);
    const newUser = yield _db_1.models.User.create({
        name,
        email,
        password,
    });
    createSendToken(newUser.dataValues, http_status_codes_1.StatusCodes.CREATED, req, res, 'Register is successfully');
}));
exports.login = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new app_error_1.AppError('Please provide email and password!', http_status_codes_1.StatusCodes.BAD_REQUEST));
    }
    // 2) Check if user exists && password is correct
    const user = yield _db_1.models.User.findOne({
        where: { email },
        attributes: {
            exclude: [
                'passwordChangedAt',
                'passwordResetToken',
                'passwordResetExpires',
            ],
        },
    });
    if (!user || !(yield (0, password_1.matchPassword)(password, user.dataValues.password))) {
        return next(new app_error_1.AppError('Incorrect email or password', http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    // // 3) If everything ok, send token to client
    createSendToken(user.dataValues, http_status_codes_1.StatusCodes.OK, req, res, 'Login is successfully');
}));
const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ status: status_name_1.STATUS_NAME.SUCCESS, message: 'Logout is successfully' });
};
exports.logout = logout;
exports.protect = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new app_error_1.AppError('You are not logged in! Please log in to get access.', http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    // 2) Verification token
    const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser = yield _db_1.models.User.findByPk((0, delve_1.delve)(decoded, 'id'));
    if (!currentUser) {
        return next(new app_error_1.AppError('The user belonging to this token does no longer exist.', 401));
    }
    // 4) Check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   return next(
    //     new AppError('User recently changed password! Please log in again.', 401)
    //   )
    // }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser.dataValues;
    res.locals.user = currentUser.dataValues;
    next();
}));
// Only for rendered pages, no errors!
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = yield jsonwebtoken_1.default.verify(req.cookies.jwt, process.env.JWT_SECRET);
            // 2) Check if user still exists
            const currentUser = yield _db_1.models.User.findByPk((0, delve_1.delve)(decoded, 'id'));
            if (!currentUser) {
                return next();
            }
            // // 3) Check if user changed password after the token was issued
            // if (currentUser.changedPasswordAfter(decoded.iat)) {
            //   return next()
            // }
            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
});
exports.isLoggedIn = isLoggedIn;
const restrictTo = (...roles) => {
    return ((req, res, next) => {
        var _a;
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            return next(new app_error_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    });
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on POSTed email
    const user = yield _db_1.models.User.findOne({ where: { email: req.body.email } });
    if (!user) {
        return next(new app_error_1.AppError('There is no user with email address.', 404));
    }
    // 2) Generate the random reset token
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const passwordResetToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    user.setDataValue('passwordResetToken', passwordResetToken);
    user.setDataValue('passwordResetExpires', Date.now() + 10 * 60 * 1000);
    yield user.save();
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} .\nIf you didn't forget your password, please ignore this email!`;
    try {
        yield (0, email_1.sendEmail)({
            email: user.dataValues.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    }
    catch (err) {
        user.setDataValue('passwordResetToken', undefined);
        user.setDataValue('passwordResetExpires', undefined);
        yield user.save();
        next(new app_error_1.AppError('There was an error sending the email. Try again later!', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
}));
exports.resetPassword = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on the token
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield _db_1.models.User.findOne({
        where: {
            passwordResetToken: hashedToken,
            passwordResetExpires: { [sequelize_1.Op.gt]: new Date() },
        },
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new app_error_1.AppError('Token is invalid or has expired', http_status_codes_1.StatusCodes.BAD_REQUEST));
    }
    const password = yield (0, password_1.encryptPassword)(req.body.password);
    user.setDataValue('password', password);
    user.setDataValue('passwordResetToken', undefined);
    user.setDataValue('passwordResetExpires', undefined);
    yield user.save();
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user.dataValues, http_status_codes_1.StatusCodes.OK, req, res);
}));
exports.updatePassword = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { passwordCurrent, password: _password } = req.body;
    // 1) Get user from collection
    const user = yield _db_1.models.User.findByPk((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, {
        attributes: {
            exclude: [
                'passwordChangedAt',
                'passwordResetToken',
                'passwordResetExpires',
            ],
        },
    });
    // 2) Check if POSTed current password is correct
    if (!user ||
        !(yield (0, password_1.matchPassword)(passwordCurrent, user === null || user === void 0 ? void 0 : user.dataValues.password))) {
        return next(new app_error_1.AppError('Your current password is wrong.', 401));
    }
    // 3) If so, update password
    const password = yield (0, password_1.encryptPassword)(_password);
    user.setDataValue('password', password);
    user.setDataValue('passwordChangedAt', Date.now() - 1000);
    yield user.save();
    // User.findByIdAndUpdate will NOT work as intended!
    // 4) Log user in, send JWT
    createSendToken(user.dataValues, http_status_codes_1.StatusCodes.OK, req, res, 'Update password is successfully');
}));
const client = new google_auth_library_1.OAuth2Client();
exports.verifyGoogleAccount = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    if (typeof idToken !== 'string') {
        throw new Error('idToken invalid');
    }
    const ticket = yield client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error('not match');
    }
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    if (payload.exp < currentTimestamp) {
        throw new Error('not match');
    }
    if (payload.aud !== process.env.GOOGLE_ID) {
        throw new Error('not match');
    }
    // createSendToken(
    //   payload,
    //   StatusCodes.OK,
    //   req,
    //   res,
    //   'Update password is successfully'
    // )
}));
