import { Op } from 'sequelize'
import { AttrType, GetAllAttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import * as sendsFactory from '../_middlewares/sends-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'
import { catchAsync } from '../_lib/utils/catch-async'
import { AppError } from '../_lib/utils/app-error'
import { StatusCodes } from 'http-status-codes'

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
// export const createData = handlersFactory.createData(models.WordsWordsLinks)
export const createData = catchAsync(async (req, res, next) => {
  req.body.createdById = req.user?.id

  const records = [
    {
      wordId: req.body.wordId,
      relationshipId: req.body.relationshipId,
      createdById: req.user?.id,
    },
    {
      wordId: req.body.relationshipId,
      relationshipId: req.body.wordId,
      createdById: req.user?.id,
    },
  ]

  const docs = await servicesFactory.createMany(models.WordsWordsLinks)(
    records,
    req.options
  )

  req.data = docs[0]
  sendsFactory.createSend(req, res, next)
})
export const getData = handlersFactory.getData(models.WordsWordsLinks)
export const updateData = handlersFactory.updateData(models.WordsWordsLinks)
export const deleteData = handlersFactory.deleteData(models.WordsWordsLinks)
