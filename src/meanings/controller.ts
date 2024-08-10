import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'
import { IncludeOptions } from 'sequelize'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize } = req.query

  const options: Record<string, any> = {
    page,
    pageSize,
    include: [
      {
        model: models.PartOfSpeech,
        as: 'partOfSpeech',
        attributes: ['name'],
      },
      {
        model: models.Definition,
        as: 'definitions',
      },
    ] as IncludeOptions,
  }

  req.options = options
  next()
}

export const getAllData = factory.getAll(models.Meaning)
export const createData = factory.createOne(models.Meaning)
export const getData = factory.getOne(models.Meaning)
export const updateData = factory.updateOne(models.Meaning)
export const deleteData = factory.deleteOne(models.Meaning)
