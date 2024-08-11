import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { AttrType } from './type'

export const ExamplesModel = (sequelize: Sequelize) =>
  sequelize.define<Model<AttrType>, AttrType>(MODELS_NAME.EXAMPLES, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sentence: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    translate: {
      type: DataTypes.TEXT('long'),
    },
  })
