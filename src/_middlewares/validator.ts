import { RequestHandler } from 'express'
import { ZodEffects, ZodError, ZodObject } from 'zod'
import { AppError } from '../_lib/utils/app-error'
import { StatusCodes } from 'http-status-codes'

export const validatorQuery =
  <TAttr extends Record<string, any>>(
    schema: ZodObject<TAttr>
  ): RequestHandler =>
  (req, res, next) => {
    try {
      const query = schema.parse(req.query)
      req.query = query
      next()
    } catch (err) {
      next(
        new AppError(
          (err as ZodError).errors
            .map((e) => `${e.path.join('.')} is ${e.message}`)
            .join(', '),
          StatusCodes.BAD_REQUEST
        )
      )
    }
  }

export const validatorBody =
  <TAttr extends Record<string, any>>(
    schema: ZodObject<TAttr> | ZodEffects<ZodObject<TAttr>>
  ): RequestHandler =>
  (req, res, next) => {
    try {
      const body = schema.parse(req.body)
      req.body = body
      next()
    } catch (err) {
      next(
        new AppError(
          (err as ZodError).errors
            .map((e) => `${e.path.join('.')} is ${e.message}`)
            .join(', '),
          StatusCodes.BAD_REQUEST
        )
      )
    }
  }
