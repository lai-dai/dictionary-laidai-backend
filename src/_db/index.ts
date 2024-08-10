import { Sequelize } from 'sequelize'
import { options } from './config'
import { ExamplesModel } from '../examples/model'
import { DefinitionsModel } from '../definitions/model'
import { MeaningsModel } from '../meanings/model'
import { PartOfSpeechesModel } from '../part-of-speech/model'
import { WordsModel } from '../words/model'
import { UserModel } from '../users/model'
import { FavoritesModel } from '../favorites/model'

export const sequelize = new Sequelize(options)

export const models = {
  User: UserModel(sequelize),
  PartOfSpeech: PartOfSpeechesModel(sequelize),
  Example: ExamplesModel(sequelize),
  Definition: DefinitionsModel(sequelize),
  Meaning: MeaningsModel(sequelize),
  Word: WordsModel(sequelize),
  Favorite: FavoritesModel(sequelize),
}

models.PartOfSpeech.belongsTo(models.User, { as: 'createdBy' })
models.Example.belongsTo(models.User, { as: 'createdBy' })
models.Definition.belongsTo(models.User, { as: 'createdBy' })
models.Meaning.belongsTo(models.User, { as: 'createdBy' })
models.Word.belongsTo(models.User, { as: 'createdBy' })

models.Definition.hasMany(models.Example, { as: 'examples' })
models.Meaning.belongsTo(models.PartOfSpeech, { as: 'partOfSpeech' })
models.Meaning.hasMany(models.Definition, { as: 'definitions' })
models.Word.hasMany(models.Meaning, { as: 'meanings' })

models.Favorite.belongsTo(models.User)
models.Favorite.belongsTo(models.Word)

sequelize
  .sync({
    // force: true,
    force: false,
    alter: true,
  })
  .then(() => {
    console.log('🚀 Database sync done')
  })
