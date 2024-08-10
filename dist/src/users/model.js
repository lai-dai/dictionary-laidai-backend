"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
const models_name_1 = require("../_lib/constants/models-name");
const UserModel = (sequelize) => sequelize.define(models_name_1.MODELS_NAME.USERS, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'default.jpg',
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    passwordChangedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    passwordResetToken: {
        type: sequelize_1.DataTypes.STRING,
    },
    passwordResetExpires: {
        type: sequelize_1.DataTypes.DATE,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    provider: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'credentials',
    },
}
// {
//   hooks: {
//     beforeFind: (options) => {
//       options.where = { active: { [Op.ne]: false } }
//     },
//   },
// }
);
exports.UserModel = UserModel;
