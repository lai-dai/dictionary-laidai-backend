"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinitionsModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const DefinitionsModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.DEFINITIONS, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    definition: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.DefinitionsModel = DefinitionsModel;
