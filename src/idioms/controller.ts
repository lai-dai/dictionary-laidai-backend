import { Op } from 'sequelize'
import { AttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, idiom } = req.query as any

  const options: factory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
  }

  switch (true) {
    case typeof idiom === 'string' && idiom !== '':
      options.where = {
        idiom: { [Op.like]: `%${idiom}%` },
      }
      break
  }

  req.options = options
  next()
}

export const getAllData = factory.getAll(models.Idiom)
export const createData = factory.createOne(models.Idiom)
export const getData = factory.getOne(models.Idiom)
export const updateData = factory.updateOne(models.Idiom)
export const deleteData = factory.deleteOneAndMany(models.Idiom)
