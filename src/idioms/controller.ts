import { Op } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, idiom } = req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
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

export const getAllData = handlersFactory.getAllData(models.Idiom)
export const createData = handlersFactory.createData(models.Idiom)
export const getData = handlersFactory.getData(models.Idiom)
export const updateData = handlersFactory.updateData(models.Idiom)
export const deleteData = handlersFactory.deleteData(models.Idiom)
