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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.getOneBySlug = exports.getOne = exports.createOne = exports.getAll = void 0;
exports.updateInclude = updateInclude;
exports.updatedAttributes = updatedAttributes;
const catch_async_1 = require("../_lib/utils/catch-async");
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = require("../_lib/utils/app-error");
const status_name_1 = require("../_lib/constants/status-name");
const _db_1 = require("../_db");
const qs_1 = __importDefault(require("qs"));
const getAll = (Model) => (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.options || {}, { pageSize, page, include = [], attributes } = _a, opts = __rest(_a, ["pageSize", "page", "include", "attributes"]);
    const { count, rows } = yield Model.findAndCountAll(Object.assign({ limit: pageSize, offset: (page - 1) * pageSize, include: updateInclude(include), attributes: updatedAttributes(attributes) }, opts));
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
    var _a;
    req.body.createdById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
    const _a = req.options || {}, { include = [], attributes } = _a, opts = __rest(_a, ["include", "attributes"]);
    const doc = yield Model.findByPk(id, Object.assign({ include: updateInclude(include), attributes: updatedAttributes(attributes) }, opts));
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
const getOneBySlug = (Model) => (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const _a = req.options || {}, { where, include = [], attributes } = _a, opts = __rest(_a, ["where", "include", "attributes"]);
    const doc = yield Model.findOne(Object.assign({ where: Object.assign({ slug: slug }, where), include: updateInclude(include), attributes: updatedAttributes(attributes) }, opts));
    if (!doc) {
        return next(new app_error_1.AppError('No document found with that slug', http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: status_name_1.STATUS_NAME.SUCCESS,
        message: 'Get data successfully',
        data: doc,
    });
}));
exports.getOneBySlug = getOneBySlug;
const updateOne = (Model) => (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    req.body.createdById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
    if (Number.isNaN(+id)) {
        const idsObj = qs_1.default.parse(id);
        if ('ids' in idsObj &&
            Array.isArray(idsObj.ids) &&
            idsObj.ids.length > 0) {
            const { count, rows } = yield Model.findAndCountAll({
                where: { id: idsObj.ids },
            });
            const resultIds = rows.map((e) => e.dataValues.id);
            yield Model.destroy({ where: { id: resultIds } });
            res.status(http_status_codes_1.StatusCodes.OK).json({
                status: status_name_1.STATUS_NAME.SUCCESS,
                message: 'Delete many data successfully',
                data: {
                    list: resultIds,
                    total: count,
                },
            });
        }
        else {
            next();
        }
    }
    else {
        const doc = yield Model.findByPk(id);
        if (!doc) {
            return next(new app_error_1.AppError('No document found with that ID', http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        yield Model.destroy({ where: { id: id } });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: status_name_1.STATUS_NAME.SUCCESS,
            message: 'Delete data successfully',
            data: doc,
        });
    }
}));
exports.deleteOne = deleteOne;
function updateInclude(include) {
    let result = [
        {
            model: _db_1.models.User,
            as: 'createdBy',
            attributes: ['id', 'name', 'email', 'image', 'role'],
        },
    ];
    switch (true) {
        case Array.isArray(include):
            result = result.concat(include);
            break;
        case typeof include === 'object':
            result = [...result, include];
            break;
    }
    return result;
}
function updatedAttributes(attributes, initExclude) {
    const result = {
        exclude: ['createdById'],
    };
    switch (true) {
        case Array.isArray(initExclude):
            result.exclude = result.exclude.concat(initExclude);
            break;
        case Array.isArray(attributes):
            result.include = attributes;
            break;
        case typeof attributes === 'object':
            switch (true) {
                case !!attributes.exclude:
                    result.exclude = result.exclude.concat(attributes.exclude);
                    break;
                case !!attributes.include:
                    result.include = attributes.include;
                    break;
                case !!attributes.exclude && !!attributes.include:
                    result.exclude = result.exclude.concat(attributes.exclude);
                    result.include = attributes.include;
                    break;
            }
            break;
    }
    return result;
}
