"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordsModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const WordsModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.WORDS, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    word: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phonetic: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
});
exports.WordsModel = WordsModel;
