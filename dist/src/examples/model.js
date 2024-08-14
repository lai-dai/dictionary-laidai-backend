"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamplesModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const ExamplesModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.EXAMPLES, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    sentence: {
        type: sequelize_1.DataTypes.TEXT('long'),
        allowNull: false,
    },
    translate: {
        type: sequelize_1.DataTypes.TEXT('long'),
    },
});
exports.ExamplesModel = ExamplesModel;
