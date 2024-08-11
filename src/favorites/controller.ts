import { AttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize } = req.query as any

  const options: factory.GetAllOptionsType<AttrType> = {
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

export const getAllData = factory.getAll(models.Favorite)
export const createData = factory.createOne(models.Favorite)
export const getData = factory.getOne(models.Favorite)
export const updateData = factory.updateOne(models.Favorite)
export const deleteData = factory.deleteOne(models.Favorite)
