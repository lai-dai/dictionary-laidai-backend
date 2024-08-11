import { Op } from 'sequelize'
import { AttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, content } = req.query as any

  const options: factory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
    attributes: {
      exclude: ['commentId', 'wordId'],
    },
    include: [
      {
        model: models.Comment,
        as: 'children',
        include: factory.updateInclude(),
        attributes: factory.updatedAttributes({
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

export const getAllData = factory.getAll(models.Comment)
export const createData = factory.createOne(models.Comment)
export const getData = factory.getOne(models.Comment)
export const updateData = factory.updateOne(models.Comment)
export const deleteData = factory.deleteOne(models.Comment)
