import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'
import { IncludeOptions, Op } from 'sequelize'
import { AttrType } from './type'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, key, wordId, partOfSpeechId } = req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
    include: [
      {
        model: models.PartOfSpeech,
        as: 'partOfSpeech',
        attributes: ['name'],
      },
      {
        model: models.Definition,
        as: 'definitions',
      },
    ] as IncludeOptions,
  }

  if (typeof wordId === 'number' && wordId !== 0) {
    options.where = {
      ...options.where,
      wordId: { [Op.eq]: wordId },
    }
  }

  if (typeof partOfSpeechId === 'number' && partOfSpeechId !== 0) {
    options.where = {
      ...options.where,
      partOfSpeechId: { [Op.eq]: partOfSpeechId },
    }
  }

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.Meaning)
export const createData = handlersFactory.createData(models.Meaning)
export const getData = handlersFactory.getData(models.Meaning)
export const updateData = handlersFactory.updateData(models.Meaning)
export const deleteData = handlersFactory.deleteData(models.Meaning)
