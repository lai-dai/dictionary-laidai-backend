import { Op } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, key, phonetic, wordId } = req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
    include: [
      {
        model: models.Word,
        as: 'word',
        attributes: ['id', 'word'],
      },
    ],
  }

  switch (true) {
    case typeof key === 'string' && key !== '':
      options.where = {
        ...options.where,
        phonetic: { [Op.like]: `%${key}%` },
      }
      break

    case typeof phonetic === 'string' && phonetic !== '':
      options.where = {
        ...options.where,
        phonetic: { [Op.like]: `%${phonetic}%` },
      }
      break
  }

  if (typeof wordId === 'number' && wordId !== 0) {
    options.where = {
      ...options.where,
      wordId: { [Op.eq]: wordId },
    }
  }

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.Phonetic)
export const createData = handlersFactory.createData(models.Phonetic)
export const getData = handlersFactory.getData(models.Phonetic)
export const updateData = handlersFactory.updateData(models.Phonetic)
export const deleteData = handlersFactory.deleteData(models.Phonetic)
