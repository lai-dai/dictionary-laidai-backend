import { Model as ModelType, ModelStatic } from 'sequelize'

import { catchAsync } from '../_lib/utils/catch-async'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../_lib/utils/app-error'
import { STATUS_NAME } from '../_lib/constants/status-name'

export const getAll = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const { page, pageSize, ...opts } = req.options || {}

    const { count, rows } = await Model.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
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
    const doc = await Model.create({ ...req.body })

    return res.status(StatusCodes.CREATED).json({
      status: STATUS_NAME.SUCCESS,
      message: 'Created data successfully',
      data: doc,
    })
  })

export const getOne = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params

    const doc = await Model.findByPk(id, req.options)

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

export const updateOne = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params

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

    await Model.destroy({ where: { id: id as any } })

    if (!doc) {
      return next(
        new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
      )
    }

    res.status(StatusCodes.OK).json({
      status: STATUS_NAME.SUCCESS,
      message: 'Delete data successfully',
      data: doc,
    })
  })
