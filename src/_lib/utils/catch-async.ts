import { RequestHandler } from 'express'

export function catchAsync(fn: RequestHandler): RequestHandler {
  return (req, res, next) => (fn(req, res, next) as any).catch(next)
}
