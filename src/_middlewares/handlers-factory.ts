import * as servicesFactory from './services-factory'
import * as sendsFactory from './sends-factory'
import { catchAsync } from '../_lib/utils/catch-async'
import { AppError } from '../_lib/utils/app-error'
import { StatusCodes } from 'http-status-codes'
import QueryString from 'qs'
import { ModelStatic, Model as ModelType } from 'sequelize'

export const getAllData = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    req.data = await servicesFactory.getAll(Model)(req.options)

    sendsFactory.getAllSend(req, res, next)
  })

export const createData = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    switch (true) {
      case Array.isArray(req.body):
        const records = req.body.map((record) => {
          record.createdById = req.user?.id
          return record
        })

        const docs = await servicesFactory.createMany(Model)(records)

        req.data = docs
        sendsFactory.createSend(req, res, next)
        break

      case req.body instanceof Object:
        req.body.createdById = req.user?.id

        const doc = await servicesFactory.createOne(Model)(req.body)

        req.data = doc
        sendsFactory.createSend(req, res, next)
        break

      default:
        next(new AppError('Not created', StatusCodes.BAD_REQUEST))
        break
    }
  })

export const getData = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const doc = await servicesFactory.getOne(Model)(req.params.id, req.options)

    if (!doc) {
      return next(
        new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
      )
    }

    req.data = doc
    sendsFactory.getSend(req, res, next)
  })

export const updateData = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    req.body.createdById = req.user?.id

    const doc = await servicesFactory.updateOne(Model)(req.params.id, req.body)

    if (!doc) {
      return next(
        new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
      )
    }

    req.data = doc
    sendsFactory.updateSend(req, res, next)
  })

export const deleteData = <DataAttr extends Record<string, any>>(
  Model: ModelStatic<ModelType<DataAttr, DataAttr>>
) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params

    if (Number.isNaN(+id)) {
      const idsObj = QueryString.parse(id)

      if (
        'ids' in idsObj &&
        Array.isArray(idsObj.ids) &&
        idsObj.ids.length > 0
      ) {
        const data = await servicesFactory.deleteMany(Model)(idsObj.ids)

        req.data = data
        sendsFactory.deleteSend(req, res, next)
      } else {
        next(new AppError('ids in valid', StatusCodes.NOT_FOUND))
      }
    } else {
      const doc = await servicesFactory.deleteOne(Model)(id)

      req.data = doc
      sendsFactory.deleteSend(req, res, next)
    }
  })
