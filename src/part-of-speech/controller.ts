import { Op, WhereOptions, Order, IncludeOptions } from 'sequelize'
import { PartOfSpeechAttr } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { name, page, pageSize, order } = req.query

  const options: Record<string, any> = {
    page,
    pageSize,
    include: [
      {
        model: models.User,
        as: 'createdBy',
        attributes: ['id', 'name', 'email', 'image', 'role'],
      },
    ] as IncludeOptions,
  }

  switch (true) {
    case typeof name === 'string' && name !== '':
      options.where = {
        name: { [Op.like]: `%${name}%` },
      } as WhereOptions<PartOfSpeechAttr>
      break

    case order === 'DESC' || order === 'ASC':
      options.order = [['order', order]] as Order
      break

    default:
      break
  }

  req.options = options
  next()
}

export const aliasCreateData: RequestHandler = (req, res, next) => {
  req.body.createdById = req.user?.id
  next()
}

export const getAllData = factory.getAll(models.PartOfSpeech)
export const createData = factory.createOne(models.PartOfSpeech)
export const getData = factory.getOne(models.PartOfSpeech)
export const updateData = factory.updateOne(models.PartOfSpeech)
export const deleteData = factory.deleteOne(models.PartOfSpeech)
