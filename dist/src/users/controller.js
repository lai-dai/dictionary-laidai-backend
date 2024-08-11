"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteData = exports.updateData = exports.getData = exports.createData = exports.getAllData = exports.aliasGetAllData = exports.deleteMe = exports.updateMe = exports.getMe = exports.resizeUserImage = exports.uploadUserImage = void 0;
const sequelize_1 = require("sequelize");
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const factory = __importStar(require("../_middlewares/service-factory"));
const http_status_codes_1 = require("http-status-codes");
const _db_1 = require("../_db");
const catch_async_1 = require("../_lib/utils/catch-async");
const app_error_1 = require("../_lib/utils/app-error");
const status_name_1 = require("../_lib/constants/status-name");
const multerStorage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        }
        else {
            cb(new app_error_1.AppError('Not an image! Please upload only images.', 400), false);
        }
    },
});
exports.uploadUserImage = upload.single('image');
exports.resizeUserImage = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.file)
        return next();
    req.file.filename = `user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}-${Date.now()}.jpeg`;
    yield (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/users/${req.file.filename}`);
    next();
}));
const getMe = (req, res, next) => {
    var _a;
    req.params.id = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    req.options = {
        attributes: {
            exclude: [
                'password',
                'passwordChangedAt',
                'passwordResetToken',
                'passwordResetExpires',
            ],
        },
    };
    next();
};
exports.getMe = getMe;
exports.updateMe = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new app_error_1.AppError('This route is not for password updates. Please use /updateMyPassword.', http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const { name, email } = req.body;
    let image;
    if (req.file)
        image = req.file.filename;
    // 3) Update user document
    yield _db_1.models.User.update({ name, email, image }, {
        where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
    });
    const doc = yield _db_1.models.User.findByPk((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, {
        attributes: {
            exclude: [
                'password',
                'passwordChangedAt',
                'passwordResetToken',
                'passwordResetExpires',
            ],
        },
    });
    if (!doc) {
        return next(new app_error_1.AppError('You are not logged in! Please log in to get access.', http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_name_1.STATUS_NAME.SUCCESS,
        message: 'Update me is successfully',
        data: {
            user: doc,
        },
    });
}));
exports.deleteMe = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const doc = yield _db_1.models.User.findByPk((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    if (!doc) {
        return next(new app_error_1.AppError('You are not logged in! Please log in to get access.', http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    doc.setDataValue('active', false);
    yield doc.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: 'success',
        message: 'Delete is successfully',
        data: null,
    });
}));
const aliasGetAllData = (req, res, next) => {
    const { page, pageSize, name, email, role, active, provider } = req.query;
    const options = {
        page,
        pageSize,
    };
    switch (true) {
        case typeof name === 'string' && name !== '':
            options.where = {
                name: { [sequelize_1.Op.like]: `%${name}%` },
            };
            break;
        case typeof email === 'string' && email !== '':
            options.where = Object.assign({ email: { [sequelize_1.Op.like]: `%${email}%` } }, options.where);
            break;
        case typeof role === 'string' && role !== '':
            options.where = Object.assign({ role: { [sequelize_1.Op.eq]: role } }, options.where);
            break;
        case typeof active === 'boolean':
            options.where = Object.assign({ active: { [sequelize_1.Op.eq]: active } }, options.where);
            break;
        case typeof provider === 'string' && provider !== '':
            options.where = Object.assign({ provider: { [sequelize_1.Op.eq]: provider } }, options.where);
            break;
    }
    req.options = options;
    next();
};
exports.aliasGetAllData = aliasGetAllData;
exports.getAllData = factory.getAll(_db_1.models.User);
const createData = (req, res) => {
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'This route is not defined! Please use /register instead',
    });
};
exports.createData = createData;
exports.getData = factory.getOne(_db_1.models.User);
// Do NOT update passwords with this!
exports.updateData = factory.updateOne(_db_1.models.User);
exports.deleteData = factory.deleteOne(_db_1.models.User);
