"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const CommentsModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.COMMENTS, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT('long'),
    },
    totalLike: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
});
exports.CommentsModel = CommentsModel;
