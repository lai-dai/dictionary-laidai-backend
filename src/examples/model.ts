import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { DataAttrType } from './type'

export const ExamplesModel = (sequelize: Sequelize) =>
  sequelize.define<Model<DataAttrType>, DataAttrType>(MODELS_NAME.EXAMPLES, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sentence: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    translate: {
      type: DataTypes.STRING,
    },
  })
