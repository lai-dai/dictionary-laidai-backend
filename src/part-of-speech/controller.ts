import { Op, Order } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, name, order } = req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
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

export const getAllData = handlersFactory.getAllData(models.PartOfSpeech)
export const createData = handlersFactory.createData(models.PartOfSpeech)
export const getData = handlersFactory.getData(models.PartOfSpeech)
export const updateData = handlersFactory.updateData(models.PartOfSpeech)
export const deleteData = handlersFactory.deleteData(models.PartOfSpeech)
