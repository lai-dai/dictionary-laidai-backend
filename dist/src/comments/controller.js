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
    const { page, pageSize, content } = req.query;
    const options = {
        page,
        pageSize,
        attributes: {
            exclude: ['commentId', 'wordId'],
        },
        include: [
            {
                model: _db_1.models.Comment,
                as: 'children',
                include: factory.updateInclude(),
                attributes: factory.updatedAttributes({
                    exclude: ['commentId', 'wordId'],
                }),
            },
        ],
        where: { commentId: null },
    };
    switch (true) {
        case typeof content === 'string' && content !== '':
            options.where = {
                content: { [sequelize_1.Op.like]: `%${content}%` },
            };
            break;
    }
    req.options = options;
    next();
};
exports.aliasGetAllData = aliasGetAllData;
exports.getAllData = factory.getAll(_db_1.models.Comment);
exports.createData = factory.createOne(_db_1.models.Comment);
exports.getData = factory.getOne(_db_1.models.Comment);
exports.updateData = factory.updateOne(_db_1.models.Comment);
exports.deleteData = factory.deleteOneAndMany(_db_1.models.Comment);
