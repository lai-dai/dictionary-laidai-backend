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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteData = exports.updateData = exports.getData = exports.createData = exports.getAllData = exports.aliasGetAllData = void 0;
const sequelize_1 = require("sequelize");
const factory = __importStar(require("../_middlewares/service-factory"));
const _db_1 = require("../_db");
const aliasGetAllData = (req, res, next) => {
    const { page, pageSize, name, order } = req.query;
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
        case order === 'DESC':
        case order === 'ASC':
            options.order = [['order', order]];
            break;
    }
    req.options = options;
    next();
};
exports.aliasGetAllData = aliasGetAllData;
exports.getAllData = factory.getAll(_db_1.models.PartOfSpeech);
exports.createData = factory.createOne(_db_1.models.PartOfSpeech);
exports.getData = factory.getOne(_db_1.models.PartOfSpeech);
exports.updateData = factory.updateOne(_db_1.models.PartOfSpeech);
exports.deleteData = factory.deleteOneAndMany(_db_1.models.PartOfSpeech);
