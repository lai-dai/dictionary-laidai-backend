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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.getOne = exports.createOne = exports.getAll = void 0;
const catch_async_1 = require("../_lib/utils/catch-async");
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = require("../_lib/utils/app-error");
const status_name_1 = require("../_lib/constants/status-name");
const getAll = (Model) => (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.options || {}, { page, pageSize } = _a, opts = __rest(_a, ["page", "pageSize"]);
    const { count, rows } = yield Model.findAndCountAll(Object.assign({ limit: pageSize, offset: (page - 1) * pageSize }, opts));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_name_1.STATUS_NAME.SUCCESS,
        message: 'Get all data successfully',
        data: {
            list: rows,
            pagination: {
                page,
                pageSize,
                pageCount: count > pageSize ? Math.floor(count / pageSize) : 1,
                total: count,
            },
        },
    });
}));
exports.getAll = getAll;
const createOne = (Model) => (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.create(Object.assign({}, req.body));
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: status_name_1.STATUS_NAME.SUCCESS,
        message: 'Created data successfully',
        data: doc,
    });
}));
exports.createOne = createOne;
const getOne = (Model) => (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doc = yield Model.findByPk(id, req.options);
    if (!doc) {
        return next(new app_error_1.AppError('No document found with that ID', http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_name_1.STATUS_NAME.SUCCESS,
        message: 'Get data successfully',
        data: doc,
    });
}));
exports.getOne = getOne;
const updateOne = (Model) => (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield Model.update(Object.assign({}, req.body), { where: { id: id } });
    const doc = yield Model.findByPk(id);
    if (!doc) {
        return next(new app_error_1.AppError('No document found with that ID', http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_name_1.STATUS_NAME.SUCCESS,
        message: 'Update data successfully',
        data: doc,
    });
}));
exports.updateOne = updateOne;
const deleteOne = (Model) => (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doc = yield Model.findByPk(id);
    yield Model.destroy({ where: { id: id } });
    if (!doc) {
        return next(new app_error_1.AppError('No document found with that ID', http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_name_1.STATUS_NAME.SUCCESS,
        message: 'Delete data successfully',
        data: doc,
    });
}));
exports.deleteOne = deleteOne;
