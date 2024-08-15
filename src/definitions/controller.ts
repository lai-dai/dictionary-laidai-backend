import { Op } from 'sequelize'
import { AttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, definition } = req.query as any

  const options: factory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
    include: [
      {
        model: models.Example,
        as: 'examples',
        attributes: ['id', 'sentence', 'translate'],
      },
    ],
  }

  switch (true) {
    case typeof definition === 'string' && definition !== '':
      options.where = {
        definition: { [Op.like]: `%${definition}%` },
      }
      break
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
export const deleteData = factory.deleteOneAndMany(models.Definition)
