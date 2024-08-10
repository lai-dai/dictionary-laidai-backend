import { DataTypes, Model, Sequelize } from 'sequelize'
import { MODELS_NAME } from '../_lib/constants/models-name'
import { PartOfSpeechAttr } from './type'

export const PartOfSpeechesModel = (sequelize: Sequelize) =>
  sequelize.define<Model<PartOfSpeechAttr>, PartOfSpeechAttr>(
    MODELS_NAME.PART_OF_SPEECH,
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    }
  )
