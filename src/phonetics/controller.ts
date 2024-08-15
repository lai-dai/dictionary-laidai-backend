import { Op } from 'sequelize'
import { AttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, key, phonetic } = req.query as any

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

  switch (true) {
    case typeof key === 'string' && key !== '':
      options.where = {
        phonetic: { [Op.like]: `%${key}%` },
      }
      break

    case typeof phonetic === 'string' && phonetic !== '':
      options.where = {
        phonetic: { [Op.like]: `%${phonetic}%` },
      }
      break
  }

  req.options = options
  next()
}

export const getAllData = factory.getAll(models.Example)
export const createData = factory.createOne(models.Example)
export const getData = factory.getOne(models.Example)
export const updateData = factory.updateOne(models.Example)
export const deleteData = factory.deleteOneAndMany(models.Example)
