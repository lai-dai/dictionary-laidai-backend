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
import { PART_OF_SPEECHES } from '../_lib/data/init-data'
import { WordsWordsLinksModel } from '../words-words-links/model'

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
  WordsWordsLinks: WordsWordsLinksModel(sequelize),
}

export function initDB() {
  sequelize.authenticate()

  models.PartOfSpeech.belongsTo(models.User, { as: 'createdBy' })
  models.Word.belongsTo(models.User, { as: 'createdBy' })
  models.Phonetic.belongsTo(models.User, { as: 'createdBy' })
  models.Idiom.belongsTo(models.User, { as: 'createdBy' })
  models.Meaning.belongsTo(models.User, { as: 'createdBy' })
  models.Definition.belongsTo(models.User, { as: 'createdBy' })
  models.Example.belongsTo(models.User, { as: 'createdBy' })
  models.Comment.belongsTo(models.User, { as: 'createdBy' })
  models.Favorite.belongsTo(models.User, { as: 'createdBy' })
  models.WordsWordsLinks.belongsTo(models.User, { as: 'createdBy' })

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

  models.Word.belongsToMany(models.Word, {
    through: models.WordsWordsLinks,
    as: 'relationship',
  })

  models.Favorite.belongsTo(models.Word, { as: 'word' })

  sequelize
    .sync({
      force: false,
      // force: true,
      // alter: true,
    })
    .then(() => {
      console.log('Connection has been established successfully.')

      models.User.findByPk(1).then(async (res) => {
        if (!res) {
          await models.User.create({
            id: 1,
            name: 'Lại Đài',
            email: 'laidai9966@gmail.com',
            image: 'default',
            role: 'admin',
            active: true,
            provider: 'credentials',
            password:
              '$2a$10$hOcJBqQOWPJxhGpDjeIdjuhiYB1gPTn/GVNINwtWT2/y7jhDvn36m',
          })

          await models.PartOfSpeech.bulkCreate(PART_OF_SPEECHES)
        }
      })
    })
}
