import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { AttrType } from './type'

export const WordsModel = (sequelize: Sequelize) =>
  sequelize.define<Model<AttrType>, AttrType>(MODELS_NAME.WORDS, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    word: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT('long'),
    },
    totalView: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  })
