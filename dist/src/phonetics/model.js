"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneticsModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const PhoneticsModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.PHONETICS, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    phonetic: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    audio: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT('long'),
    },
});
exports.PhoneticsModel = PhoneticsModel;
