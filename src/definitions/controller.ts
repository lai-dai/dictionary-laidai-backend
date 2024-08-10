import { Op, WhereOptions, IncludeOptions } from 'sequelize'
import { DataAttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, definition, examplesIds } = req.query

  const options: Record<string, any> = {
    page,
    pageSize,
    include: [
      {
        model: models.Example,
        as: 'examples',
        attributes: ['sentence', 'translate'],
      },
    ] as IncludeOptions,
  }
  if (definition) {
    options.where = {
      definition: { [Op.like]: `%${definition}%` },
    } as WhereOptions<DataAttrType>
  }

  // include: [{model: Tag, as: 'tags'}],
  //   where: {'tags.id': {in: [1,2,3,4]}},

  req.options = options
  next()
}

export const getAllData = factory.getAll(models.Definition)
export const createData = factory.createOne(models.Definition)
export const getData = factory.getOne(models.Definition)
export const updateData = factory.updateOne(models.Definition)
export const deleteData = factory.deleteOne(models.Definition)
