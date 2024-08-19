import { Op } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, key, definition, meaningId, wordId } =
    req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
    include: [
      {
        model: models.Example,
        as: 'examples',
        attributes: ['id', 'sentence', 'translate'],
      },
    ],
  }

  switch (true) {
    case typeof key === 'string' && key !== '':
      options.where = {
        ...options.where,
        definition: { [Op.like]: `%${key}%` },
      }
      break
    case typeof definition === 'string' && definition !== '':
      options.where = {
        ...options.where,
        definition: { [Op.like]: `%${definition}%` },
      }
      break
  }

  if (typeof meaningId === 'number' && meaningId !== 0) {
    options.where = {
      ...options.where,
      meaningId: { [Op.eq]: meaningId },
    }
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

export const getAllData = handlersFactory.getAllData(models.Definition)
export const createData = handlersFactory.createData(models.Definition)
export const getData = handlersFactory.getData(models.Definition)
export const updateData = handlersFactory.updateData(models.Definition)
export const deleteData = handlersFactory.deleteData(models.Definition)
