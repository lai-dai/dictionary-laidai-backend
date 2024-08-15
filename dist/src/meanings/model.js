"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeaningsModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const MeaningsModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.MEANINGS, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT('long'),
    },
});
exports.MeaningsModel = MeaningsModel;
