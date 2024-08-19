import { Op } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasIncludeGetAllData: RequestHandler = (req, res, next) => {
  const options = req.options || {}

  options.include = [
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
        },
      ],
    },
  ] as servicesFactory.GetAllOptionsType<AttrType>['include']

  req.options = options
  next()
}

export const aliasIncludeGetData: RequestHandler = (req, res, next) => {
  const options = req.options || {}

  options.include = [
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
    {
      model: models.Idiom,
      as: 'idioms',
      include: [
        {
          model: models.Example,
          as: 'examples',
          attributes: ['id', 'sentence', 'translate'],
        },
      ],
    },
    {
      model: models.Phonetic,
      as: 'phonetics',
    },
  ] as
    | servicesFactory.GetAllOptionsType<AttrType>['include']
    | servicesFactory.GetOneOptionsType<AttrType>['include']

  req.options = options
  next()
}

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, key, word } = req.query as any
  const options = req.options || {}

  options.page = page
  options.pageSize = pageSize

  switch (true) {
    case typeof key === 'string' && key !== '':
      options.where = {
        word: { [Op.like]: `%${key}%` },
      }
      break

    case typeof word === 'string' && word !== '':
      options.where = {
        word: { [Op.like]: `%${word}%` },
      }
      break
  }

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.Word)
export const createData = handlersFactory.createData(models.Word)
export const getData = handlersFactory.getData(models.Word)
export const updateData = handlersFactory.updateData(models.Word)
export const deleteData = handlersFactory.deleteData(models.Word)
