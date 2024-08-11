import { Op } from 'sequelize'
import { AttrType } from './type'
import * as factory from '../_middlewares/service-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, word } = req.query as any

  const options: factory.GetAllOptionsType<AttrType> = {
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
    ],
  }

  switch (true) {
    case typeof word === 'string' && word !== '':
      options.where = {
        word: { [Op.like]: `%${word}%` },
      }
      break
  }

  req.options = options
  next()
}

export const getAllData = factory.getAll(models.Word)
export const createData = factory.createOne(models.Word)
export const getData = factory.getOne(models.Word)
export const updateData = factory.updateOne(models.Word)
export const deleteData = factory.deleteOne(models.Word)
