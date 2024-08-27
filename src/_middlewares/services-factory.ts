import {
  Model as ModelType,
  ModelStatic,
  FindAndCountOptions,
  Attributes,
  FindOptions,
  Includeable,
  CreateOptions,
  BulkCreateOptions,
  UpdateOptions,
} from 'sequelize'

import { StatusCodes } from 'http-status-codes'
import { AppError } from '../_lib/utils/app-error'
import { models } from '../_db'
import { FindAttributeOptions } from 'sequelize'
import { MakeNullishOptional } from 'sequelize/lib/utils'

export type GetAllOptionsType<TAttr extends Record<string, any>> = Omit<
  FindAndCountOptions<Attributes<ModelType<TAttr, TAttr>>>,
  'group' | 'limit' | 'offset'
> & {
  pageSize?: number
  page?: number
}

export const getAll =
  <DataAttr extends Record<string, any>>(
    Model: ModelStatic<ModelType<DataAttr, DataAttr>>
  ) =>
  async (options?: Record<string, any>) => {
    const {
      pageSize,
      page,
      include = [],
      attributes,
      order,
      ...opts
    } = options || {}

    const { count, rows } = await Model.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      include: Model.name === 'users' ? include : updateInclude(include),
      attributes:
        Model.name === 'users' ? attributes : updatedAttributes(attributes),
      order: order || [['createdAt', 'DESC']],
      ...opts,
    })

    return {
      list: rows,
      pagination: {
        page,
        pageSize,
        pageCount: count > pageSize ? Math.ceil(count / pageSize) : 1,
        total: count,
      },
    }
  }

export const createOne =
  <DataAttr extends Record<string, any>>(
    Model: ModelStatic<ModelType<DataAttr, DataAttr>>
  ) =>
  async (
    record: MakeNullishOptional<DataAttr>,
    options?: CreateOptions<Attributes<ModelType>>
  ) => {
    return await Model.create(record, options)
  }

export const createMany =
  <DataAttr extends Record<string, any>>(
    Model: ModelStatic<ModelType<DataAttr, DataAttr>>
  ) =>
  async (
    records: MakeNullishOptional<DataAttr>[],
    options?: BulkCreateOptions<Attributes<ModelType>>
  ) => {
    return await Model.bulkCreate(records, options)
  }

export type GetOneOptionsType<TAttr extends Record<string, any>> = Omit<
  FindOptions<Attributes<ModelType<TAttr, TAttr>>>,
  'where'
>

export const getOne =
  <DataAttr extends Record<string, any>>(
    Model: ModelStatic<ModelType<DataAttr, DataAttr>>
  ) =>
  async (id: any, options: any) => {
    const { include = [], attributes, ...opts } = options || {}

    return await Model.findByPk(id, {
      include: Model.name === 'users' ? include : updateInclude(include),
      attributes:
        Model.name === 'users' ? attributes : updatedAttributes(attributes),
      ...opts,
    })
  }

export type GetOneBySlugOptionsType<TAttr extends Record<string, any>> =
  FindOptions<Attributes<ModelType<TAttr, TAttr>>>

export const getOneBySlug =
  <DataAttr extends Record<string, any>>(
    Model: ModelStatic<ModelType<DataAttr, DataAttr>>
  ) =>
  async (slug: any, options: any) => {
    const { where, include = [], attributes, ...opts } = options || {}

    return await Model.findOne({
      where: { slug: slug, ...where },
      include: Model.name === 'users' ? include : updateInclude(include),
      attributes:
        Model.name === 'users' ? attributes : updatedAttributes(attributes),
      ...opts,
    })
  }

export const updateOne =
  <DataAttr extends Record<string, any>>(
    Model: ModelStatic<ModelType<DataAttr, DataAttr>>
  ) =>
  async (
    id: any,
    update: any,
    options?: UpdateOptions<Attributes<ModelType>>
  ) => {
    if (options) options.where = { ...options.where, id } as any

    await Model.update(update, options || { where: { id: id as any } })

    return await Model.findByPk(id)
  }

export const deleteOne =
  <DataAttr extends Record<string, any>>(
    Model: ModelStatic<ModelType<DataAttr, DataAttr>>
  ) =>
  async (id: any) => {
    const doc = await Model.findByPk(id)

    if (!doc) {
      throw new AppError(
        'No document found with that ID',
        StatusCodes.NOT_FOUND
      )
    }

    await Model.destroy({ where: { id: id as any } })

    return doc
  }

export const deleteMany =
  <DataAttr extends Record<string, any>>(
    Model: ModelStatic<ModelType<DataAttr, DataAttr>>
  ) =>
  async (ids: any[]) => {
    const { count, rows } = await Model.findAndCountAll({
      where: { id: ids } as any,
    })

    const resultIds = rows.map((row) => row.dataValues.id)

    await Model.destroy({ where: { id: resultIds } as any })

    return {
      list: resultIds,
      total: count,
    }
  }

export function updateInclude(include?: Includeable | Includeable[]) {
  let result: Includeable[] = [
    {
      model: models.User,
      as: 'createdBy',
      attributes: ['id', 'name', 'email', 'image', 'role'],
    },
  ]

  switch (true) {
    case include && Array.isArray(include):
      result = result.concat(include)
      break

    case include && typeof include === 'object':
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
