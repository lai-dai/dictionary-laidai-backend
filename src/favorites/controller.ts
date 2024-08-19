import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize } = req.query as any

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

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.Favorite)
export const createData = handlersFactory.createData(models.Favorite)
export const getData = handlersFactory.getData(models.Favorite)
export const updateData = handlersFactory.updateData(models.Favorite)
export const deleteData = handlersFactory.deleteData(models.Favorite)
