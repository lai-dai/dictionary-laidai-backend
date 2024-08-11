import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { AttrType } from './type'

export const FavoritesModel = (sequelize: Sequelize) =>
  sequelize.define<Model<AttrType>, AttrType>(MODELS_NAME.FAVORITES, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  })
