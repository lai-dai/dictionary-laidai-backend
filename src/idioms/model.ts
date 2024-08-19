import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { AttrType } from './type'

export const IdiomsModel = (sequelize: Sequelize) =>
  sequelize.define<Model<AttrType>, AttrType>(MODELS_NAME.IDIOMS, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    idiom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    definition: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT('long'),
    },
  })
