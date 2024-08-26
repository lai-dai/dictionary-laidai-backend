import { Op } from 'sequelize'
import { AttrType, GetAllAttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, key, relationshipId, wordId }: GetAllAttrType =
    req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
  }

  req.options = options
  next()
}

export const aliasIncludeGetAllData: RequestHandler = (req, res, next) => {
  const options = req.options || {}

  options.include = [
    {
      model: models.Word,
      as: 'relationship',
      // attributes: ['id'],
    },
  ] as servicesFactory.GetAllOptionsType<AttrType>['include']

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.WordsWordsLinks)
export const createData = handlersFactory.createData(models.WordsWordsLinks)
export const getData = handlersFactory.getData(models.WordsWordsLinks)
export const updateData = handlersFactory.updateData(models.WordsWordsLinks)
export const deleteData = handlersFactory.deleteData(models.WordsWordsLinks)
