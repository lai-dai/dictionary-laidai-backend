import {
  Model as ModelType,
  ModelStatic,
  FindAndCountOptions,
  Attributes,
  FindOptions,
  Includeable,
} from 'sequelize'

import { catchAsync } from '../_lib/utils/catch-async'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../_lib/utils/app-error'
import { STATUS_NAME } from '../_lib/constants/status-name'
import { models } from '../_db'
import { FindAttributeOptions } from 'sequelize'

export type GetAllOptionsType<TAttr extends Record<string, any>> = Omit<
  FindAndCountOptions<Attributes<ModelType<TAttr, TAttr>>>,
  'group' | 'limit' | 'offset'
> & {
  pageSize?: number
  page?: number
}

export const getAll = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const {
      pageSize,
      page,
      include = [],
      attributes,
      ...opts
    } = req.options || {}

    const { count, rows } = await Model.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      include: updateInclude(include),
      attributes: updatedAttributes(attributes),
      ...opts,
    })

    res.status(StatusCodes.OK).json({
      status: STATUS_NAME.SUCCESS,
      message: 'Get all data successfully',
      data: {
        list: rows,
        pagination: {
          page,
          pageSize,
          pageCount: count > pageSize ? Math.floor(count / pageSize) : 1,
          total: count,
        },
      },
    })
  })

export const createOne = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    req.body.createdById = req.user?.id

    const doc = await Model.create({ ...req.body })

    return res.status(StatusCodes.CREATED).json({
      status: STATUS_NAME.SUCCESS,
      message: 'Created data successfully',
      data: doc,
    })
  })

export type GetOneOptionsType<TAttr extends Record<string, any>> = Omit<
  FindOptions<Attributes<ModelType<TAttr, TAttr>>>,
  'where'
>

export const getOne = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { include = [], attributes, ...opts } = req.options || {}

    const doc = await Model.findByPk(id, {
      include: updateInclude(include),
      attributes: updatedAttributes(attributes),
      ...opts,
    })

    if (!doc) {
      return next(
        new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
      )
    }

    res.status(StatusCodes.OK).json({
      status: STATUS_NAME.SUCCESS,
      message: 'Get data successfully',
      data: doc,
    })
  })

export type GetOneBySlugOptionsType<TAttr extends Record<string, any>> =
  FindOptions<Attributes<ModelType<TAttr, TAttr>>>

export const getOneBySlug = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const { slug } = req.params
    const { where, include = [], attributes, ...opts } = req.options || {}

    const doc = await Model.findOne({
      where: { slug: slug, ...where },
      include: updateInclude(include),
      attributes: updatedAttributes(attributes),
      ...opts,
    })

    if (!doc) {
      return next(
        new AppError('No document found with that slug', StatusCodes.NOT_FOUND)
      )
    }

    res.status(StatusCodes.OK).json({
      status: STATUS_NAME.SUCCESS,
      message: 'Get data successfully',
      data: doc,
    })
  })

export const updateOne = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params

    req.body.createdById = req.user?.id

    await Model.update({ ...req.body }, { where: { id: id as any } })

    const doc = await Model.findByPk(id)

    if (!doc) {
      return next(
        new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
      )
    }

    res.status(StatusCodes.OK).json({
      status: STATUS_NAME.SUCCESS,
      message: 'Update data successfully',
      data: doc,
    })
  })

export const deleteOne = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params

    const doc = await Model.findByPk(id)

    if (!doc) {
      return next(
        new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
      )
    }

    await Model.destroy({ where: { id: id as any } })

    res.status(StatusCodes.OK).json({
      status: STATUS_NAME.SUCCESS,
      message: 'Delete data successfully',
      data: doc,
    })
  })

export function updateInclude(include?: Includeable | Includeable[]) {
  let result: Includeable[] = [
    {
      model: models.User,
      as: 'createdBy',
      attributes: ['id', 'name', 'email', 'image', 'role'],
    },
  ]

  switch (true) {
    case Array.isArray(include):
      result = result.concat(include)
      break

    case typeof include === 'object':
      result = [...result, include]
      break
  }

  return result
}

export function updatedAttributes(
  attributes?: FindAttributeOptions,
  initExclude?: string[]
) {
  const result: FindAttributeOptions = {
    exclude: ['createdById'],
  }

  switch (true) {
    case Array.isArray(initExclude):
      result.exclude = result.exclude.concat(initExclude)
      break

    case Array.isArray(attributes):
      result.include = attributes
      break

    case typeof attributes === 'object':
      switch (true) {
        case !!attributes.exclude:
          result.exclude = result.exclude.concat(attributes.exclude)
          break

        case !!attributes.include:
          result.include = attributes.include
          break

        case !!attributes.exclude && !!attributes.include:
          result.exclude = result.exclude.concat(attributes.exclude)
          result.include = attributes.include
          break
      }
      break
  }

  return result
}
