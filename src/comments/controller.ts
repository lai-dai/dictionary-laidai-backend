import { Op } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, content } = req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
    attributes: {
      exclude: ['commentId', 'wordId'],
    },
    include: [
      {
        model: models.Comment,
        as: 'children',
        include: servicesFactory.updateInclude() as any,
        attributes: servicesFactory.updatedAttributes({
          exclude: ['commentId', 'wordId'],
        }),
      },
    ],
    where: { commentId: null },
  }

  switch (true) {
    case typeof content === 'string' && content !== '':
      options.where = {
        content: { [Op.like]: `%${content}%` },
      }
      break
  }

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.Comment)
export const createData = handlersFactory.createData(models.Comment)
export const getData = handlersFactory.getData(models.Comment)
export const updateData = handlersFactory.updateData(models.Comment)
export const deleteData = handlersFactory.deleteData(models.Comment)
