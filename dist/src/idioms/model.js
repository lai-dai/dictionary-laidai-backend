"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdiomsModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const IdiomsModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.IDIOMS, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    idiom: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    definition: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT('long'),
    },
});
exports.IdiomsModel = IdiomsModel;
