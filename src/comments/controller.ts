import { Op } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import * as sendsFactory from '../_middlewares/sends-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'
import { catchAsync } from '../_lib/utils/catch-async'
import { AppError } from '../_lib/utils/app-error'
import { StatusCodes } from 'http-status-codes'

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const {
    page,
    pageSize,
    key,
    content,
    wordId,
    commentId = null,
  } = req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
    attributes: {
      exclude: ['commentId', 'wordId'],
    },
    include: [
      {
        model: models.Comment,
        as: 'children',
        include: servicesFactory.updateInclude() as any,
        attributes: {
          exclude: ['commentId'],
        },
        separate: true, // <--- Run separate query
        limit: 1,
      },
    ],
    where: { commentId },
    order: [['createdAt', 'DESC']],
  }

  switch (true) {
    case typeof key === 'string' && key !== '':
      options.where = {
        ...options.where,
        content: { [Op.like]: `%${key}%` },
      }
      break
    case typeof content === 'string' && content !== '':
      options.where = {
        ...options.where,
        content: { [Op.like]: `%${content}%` },
      }
      break
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

export const getAllData = handlersFactory.getAllData(models.Comment)
export const createData = handlersFactory.createData(models.Comment)
export const getData = handlersFactory.getData(models.Comment)
export const updateData = handlersFactory.updateData(models.Comment)
export const deleteData = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const comments = await models.Comment.findAll({
    where: {
      commentId: { [Op.eq]: Number(id) },
    },
  })

  const doc = await servicesFactory.deleteOne(models.Comment)(id)

  if (comments.length) {
    const ids = comments.map((e) => e.dataValues.id)

    await models.Comment.destroy({ where: { id: ids as any } })
  }

  req.data = doc
  sendsFactory.deleteSend(req, res, next)
})
