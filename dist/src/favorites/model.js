"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const FavoritesModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.FAVORITES, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
});
exports.FavoritesModel = FavoritesModel;
