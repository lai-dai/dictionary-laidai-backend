import { Op } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, key, idiom, wordId } = req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
  }

  switch (true) {
    case typeof key === 'string' && key !== '':
      options.where = {
        ...options.where,
        idiom: { [Op.like]: `%${key}%` },
      }
      break

    case typeof idiom === 'string' && idiom !== '':
      options.where = {
        idiom: { [Op.like]: `%${idiom}%` },
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

export const aliasIncludesData: RequestHandler = (req, res, next) => {
  const options = req.options || {}

  options.include = [
    {
      model: models.Word,
      as: 'word',
      attributes: ['id', 'word'],
    },
  ] as servicesFactory.GetAllOptionsType<AttrType>['include']

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.Idiom)
export const createData = handlersFactory.createData(models.Idiom)
export const getData = handlersFactory.getData(models.Idiom)
export const updateData = handlersFactory.updateData(models.Idiom)
export const deleteData = handlersFactory.deleteData(models.Idiom)
