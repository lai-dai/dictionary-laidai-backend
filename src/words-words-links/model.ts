import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { AttrType } from './type'

export const WordsWordsLinksModel = (sequelize: Sequelize) =>
  sequelize.define<Model<AttrType>, AttrType>(
    MODELS_NAME.WORDS_WORDS_LINKS,
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  )
