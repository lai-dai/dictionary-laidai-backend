import { Sequelize } from 'sequelize'
import { options } from './config'
import { ExamplesModel } from '../examples/model'
import { DefinitionsModel } from '../definitions/model'
import { MeaningsModel } from '../meanings/model'
import { PartOfSpeechesModel } from '../part-of-speech/model'
import { WordsModel } from '../words/model'
import { UserModel } from '../users/model'
import { FavoritesModel } from '../favorites/model'
import { IdiomsModel } from '../idioms/model'
import { CommentsModel } from '../comments/model'
import { PhoneticsModel } from '../phonetics/model'

export const sequelize = new Sequelize(options)

export const models = {
  User: UserModel(sequelize),
  PartOfSpeech: PartOfSpeechesModel(sequelize),
  Example: ExamplesModel(sequelize),
  Definition: DefinitionsModel(sequelize),
  Meaning: MeaningsModel(sequelize),
  Word: WordsModel(sequelize),
  Favorite: FavoritesModel(sequelize),
  Idiom: IdiomsModel(sequelize),
  Comment: CommentsModel(sequelize),
  Phonetic: PhoneticsModel(sequelize),
}

models.PartOfSpeech.belongsTo(models.User, { as: 'createdBy' })
models.Word.belongsTo(models.User, { as: 'createdBy' })
models.Phonetic.belongsTo(models.User, { as: 'createdBy' })
models.Idiom.belongsTo(models.User, { as: 'createdBy' })
models.Meaning.belongsTo(models.User, { as: 'createdBy' })
models.Definition.belongsTo(models.User, { as: 'createdBy' })
models.Example.belongsTo(models.User, { as: 'createdBy' })
models.Comment.belongsTo(models.User, { as: 'createdBy' })

models.Phonetic.belongsTo(models.Word, { as: 'word' })
models.Idiom.belongsTo(models.Word, { as: 'word' })
models.Meaning.belongsTo(models.Word, { as: 'word' })
models.Definition.belongsTo(models.Word, { as: 'word' })
models.Example.belongsTo(models.Word, { as: 'word' })
models.Comment.belongsTo(models.Word, { as: 'word' })

models.Comment.hasMany(models.Comment, { as: 'children' })

models.Idiom.hasMany(models.Example, { as: 'examples' })

models.Definition.hasMany(models.Example, { as: 'examples' })

models.Meaning.belongsTo(models.PartOfSpeech, { as: 'partOfSpeech' })
models.Meaning.hasMany(models.Definition, { as: 'definitions' })

models.Word.hasMany(models.Phonetic, { as: 'phonetics' })
models.Word.hasMany(models.Meaning, { as: 'meanings' })
models.Word.hasMany(models.Idiom, { as: 'idioms' })

models.Favorite.belongsTo(models.User)
models.Favorite.belongsTo(models.Word)

sequelize
  .sync({
    force: false,
    // force: true,
    // alter: true,
  })
  .then(() => {
    models.User.findByPk(1).then((res) => {
      if (!res) {
        models.User.create({
          id: 1,
          name: 'Lại Đài',
          email: 'laidai9966@gmail.com',
          image: 'default',
          role: 'admin',
          active: true,
          provider: 'credentials',
          password: process.env.ADMIN_PASSWORD,
        })
      }
    })
  })
