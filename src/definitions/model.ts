import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { DataAttrType } from './type'

export const DefinitionsModel = (sequelize: Sequelize) =>
  sequelize.define<Model<DataAttrType>, DataAttrType>(MODELS_NAME.DEFINITIONS, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    definition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })
