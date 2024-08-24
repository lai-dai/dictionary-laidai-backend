import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { AttrType } from './type'

export const DefinitionsModel = (sequelize: Sequelize) =>
  sequelize.define<Model<AttrType>, AttrType>(MODELS_NAME.DEFINITIONS, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    definition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    translate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    description: {
      type: DataTypes.TEXT('long'),
      defaultValue: '',
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  })
