import { Op, Order } from 'sequelize'
import { AttrType } from './type'
import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import * as sendsFactory from '../_middlewares/sends-factory'
import { RequestHandler } from 'express'
import { models } from '../_db'
import { catchAsync } from '../_lib/utils/catch-async'
import { AppError } from '../_lib/utils/app-error'
import { StatusCodes } from 'http-status-codes'
import { delve } from '../_lib/utils/delve'
import jwt from 'jsonwebtoken'

export const aliasIncludeAdminOnlyWordData: RequestHandler = (
  req,
  res,
  next
) => {
  const options = req.options || {}

  options.attributes = {
    include: ['id', 'word'],
  } as servicesFactory.GetAllOptionsType<AttrType>['attributes']

  options.order = [['word', 'ASC']] as Order

  req.options = options
  next()
}

export const aliasIncludeAdminGetData: RequestHandler = (req, res, next) => {
  const options = req.options || {}

  options.include = [
    {
      model: models.Word,
      as: 'relationship',
      attributes: ['id', 'word'],
      through: {
        attributes: ['id'],
      },
    },
  ] as servicesFactory.GetAllOptionsType<AttrType>['include']

  req.options = options
  next()
}

export const aliasIncludeGetAllData: RequestHandler = (req, res, next) => {
  const options = req.options || {}

  options.include = [
    {
      model: models.Word,
      as: 'relationship',
      attributes: ['id', 'word'],
      through: {
        attributes: [],
      },
    },
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
          attributes: ['id', 'definition', 'translate'],
          limit: 1,
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
      model: models.Word,
      as: 'relationship',
      attributes: ['id', 'word'],
      through: {
        attributes: [],
      },
    },
    {
      model: models.Meaning,
      as: 'meanings',
      attributes: ['id', 'description'],
      include: [
        {
          model: models.PartOfSpeech,
          as: 'partOfSpeech',
          attributes: ['id', 'name', 'abbreviation', 'translate'],
        },
        {
          model: models.Definition,
          as: 'definitions',
          attributes: ['id', 'definition', 'translate', 'description', 'image'],
          include: [
            {
              model: models.Example,
              as: 'examples',
              attributes: ['id', 'sentence', 'translate', 'description'],
            },
          ],
        },
      ],
    },
    {
      model: models.Idiom,
      as: 'idioms',
      attributes: ['id', 'definition', 'description', 'idiom'],
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
      attributes: ['id', 'audio', 'phonetic', 'description'],
    },
  ] as servicesFactory.GetAllOptionsType<AttrType>['include']

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

export const getCData = catchAsync(async (req, res, next) => {
  const { where, include = [], attributes, ...opts } = req.options || {}

  const doc = await models.Word.findOne({
    where: { word: { [Op.eq]: req.params.id }, ...where },
    include: servicesFactory.updateInclude(include),
    attributes: servicesFactory.updatedAttributes(attributes),
    ...opts,
  })

  if (!doc) {
    return next(
      new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
    )
  }

  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt
  }

  let favorite
  if (token) {
    // 2) Verification token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET!)

    // 3) Check if user still exists
    const currentUser = await models.User.findByPk(
      delve(decoded as object, 'id')
    )

    if (currentUser) {
      const doc2 = await models.Favorite.findOne({
        where: {
          wordId: doc.dataValues.id,
          createdById: currentUser?.dataValues?.id || 0,
        },
        attributes: ['id'],
      })

      if (doc2) {
        favorite = doc2
      }
    }
  }

  req.data = { ...doc.dataValues, favorite }
  sendsFactory.getSend(req, res, next)
})

export const getAllOnlyWordData = catchAsync(async (req, res, next) => {
  const {
    pageSize,
    page,
    include = [],
    attributes,
    ...opts
  } = req.options || {}

  const { count, rows } = await models.Word.findAndCountAll({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    include,
    attributes,
    ...opts,
  })

  req.data = {
    list: rows,
    pagination: {
      page,
      pageSize,
      pageCount: count > pageSize ? Math.ceil(count / pageSize) : 1,
      total: count,
    },
  }

  sendsFactory.getAllSend(req, res, next)
})
export const getAllData = handlersFactory.getAllData(models.Word)
export const createData = handlersFactory.createData(models.Word)
export const getData = handlersFactory.getData(models.Word)
export const updateData = handlersFactory.updateData(models.Word)
export const deleteData = handlersFactory.deleteData(models.Word)
