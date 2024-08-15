import { Op, Order, IncludeOptions } from 'sequelize'
import { AttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, name, order } = req.query as any

  const options: factory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
  }

  switch (true) {
    case typeof name === 'string' && name !== '':
      options.where = {
        name: { [Op.like]: `%${name}%` },
      }
      break

    case order === 'DESC':
    case order === 'ASC':
      options.order = [['order', order]] as Order
      break
  }

  req.options = options
  next()
}

export const getAllData = factory.getAll(models.PartOfSpeech)
export const createData = factory.createOne(models.PartOfSpeech)
export const getData = factory.getOne(models.PartOfSpeech)
export const updateData = factory.updateOne(models.PartOfSpeech)
export const deleteData = factory.deleteOneAndMany(models.PartOfSpeech)
