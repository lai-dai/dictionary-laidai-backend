import { Op, WhereOptions, Order, IncludeOptions } from 'sequelize'
import { AttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { name, page, pageSize, order } = req.query

  const options: Record<string, any> = {
    page,
    pageSize,
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: models.Meaning,
        as: 'meanings',
        attributes: ['id'],
        include: [
          {
            model: models.PartOfSpeech,
            as: 'partOfSpeech',
            attributes: ['id', 'name'],
          },
          {
            model: models.Definition,
            as: 'definitions',
            attributes: ['id', 'definition'],
            include: [
              {
                model: models.Example,
                as: 'examples',
                attributes: ['id', 'sentence', 'translate'],
              },
            ],
          },
        ],
      },
    ] as IncludeOptions,
  }
  if (name) {
    options.where = {
      name: { [Op.like]: `%${name}%` },
    } as WhereOptions<AttrType>
  }

  if (order) {
    options.order = [['order', order]] as Order
  }

  req.options = options
  next()
}

export const getAllData = factory.getAll(models.Word)
export const createData = factory.createOne(models.Word)
export const getData = factory.getOne(models.Word)
export const updateData = factory.updateOne(models.Word)
export const deleteData = factory.deleteOne(models.Word)
