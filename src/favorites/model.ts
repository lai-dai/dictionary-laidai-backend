import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { DataAttrType } from './type'

export const FavoritesModel = (sequelize: Sequelize) =>
  sequelize.define<Model<DataAttrType>, DataAttrType>(MODELS_NAME.FAVORITES, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  })
