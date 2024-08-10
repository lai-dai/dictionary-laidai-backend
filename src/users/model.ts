import { DataTypes, Model, Sequelize } from 'sequelize'

import { MODELS_NAME } from '../_lib/constants/models-name'
import { DataAttr } from './type'

export const UserModel = (sequelize: Sequelize) =>
  sequelize.define<Model<DataAttr>, DataAttr>(
    MODELS_NAME.USERS,
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: 'default.jpg',
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      password: {
        type: DataTypes.STRING,
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      provider: {
        type: DataTypes.STRING,
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
  )
