"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartOfSpeechesModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const PartOfSpeechesModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.PART_OF_SPEECH, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
});
exports.PartOfSpeechesModel = PartOfSpeechesModel;
