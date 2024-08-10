import { Op, WhereOptions } from 'sequelize'
import { DataAttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, sentence, translate } = req.query

  const options: Record<string, any> = {
    page,
    pageSize,
    // include: [
    //   {
    //     model: models.Definitions,
    //     as: 'definition',
    //     attributes: ['definition'],
    //   },
    // ] as IncludeOptions,
  }
  if (sentence) {
    options.where = {
      sentence: { [Op.like]: `%${sentence}%` },
    } as WhereOptions<DataAttrType>
  }
  if (translate) {
    if (options.where) {
      options.where.translate = { [Op.like]: `%${translate}%` }
    } else {
      options.where = {
        translate: { [Op.like]: `%${translate}%` },
      } as WhereOptions<DataAttrType>
    }
  }

  req.options = options
  next()
}

export const getAllData = factory.getAll(models.Example)
export const createData = factory.createOne(models.Example)
export const getData = factory.getOne(models.Example)
export const updateData = factory.updateOne(models.Example)
export const deleteData = factory.deleteOne(models.Example)
