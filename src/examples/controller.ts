import { Op } from 'sequelize'
import { AttrType, GetAllAttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const {
    page,
    pageSize,
    key,
    sentence,
    definitionId,
    idiomId,
    wordId,
  }: GetAllAttrType = req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
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

  switch (true) {
    case typeof sentence === 'string' && sentence !== '':
      options.where = {
        sentence: { [Op.like]: `%${sentence}%` },
      }
      break
    case typeof key === 'string' && key !== '':
      options.where = {
        sentence: { [Op.like]: `%${key}%` },
      }
      break
  }

  if (typeof definitionId === 'number' && definitionId !== 0) {
    options.where = {
      ...options.where,
      definitionId: { [Op.eq]: definitionId },
    }
  }
  if (typeof idiomId === 'number' && idiomId !== 0) {
    options.where = {
      ...options.where,
      idiomId: { [Op.eq]: idiomId },
    }
  }
  if (typeof wordId === 'number' && wordId !== 0) {
    options.where = {
      ...options.where,
      wordId: { [Op.eq]: wordId },
    }
  }

  req.options = options
  next()
}

export const aliasIncludesData: RequestHandler = (req, res, next) => {
  const options = req.options || {}

  options.include = [
    {
      model: models.Word,
      as: 'word',
      attributes: ['id', 'word'],
    },
  ] as servicesFactory.GetAllOptionsType<AttrType>['include']

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.Example)
export const createData = handlersFactory.createData(models.Example)
export const getData = handlersFactory.getData(models.Example)
export const updateData = handlersFactory.updateData(models.Example)
export const deleteData = handlersFactory.deleteData(models.Example)
