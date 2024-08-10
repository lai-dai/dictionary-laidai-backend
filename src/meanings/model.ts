import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { AttrType } from './type'

export const MeaningsModel = (sequelize: Sequelize) =>
  sequelize.define<Model<AttrType>, AttrType>(MODELS_NAME.MEANINGS, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  })
