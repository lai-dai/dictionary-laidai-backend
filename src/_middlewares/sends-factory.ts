import { StatusCodes } from 'http-status-codes'
import { STATUS_NAME } from '../_lib/constants/status-name'
import { RequestHandler } from 'express'

export const getAllSend: RequestHandler = (req, res, next) => {
  res.status(StatusCodes.OK).json({
    status: STATUS_NAME.SUCCESS,
    message: 'Get all data successfully',
    data: req.data,
  })
}

export const createSend: RequestHandler = (req, res, next) => {
  res.status(StatusCodes.CREATED).json({
    status: STATUS_NAME.SUCCESS,
    message: 'Created data successfully',
    data: req.data,
  })
}

export const getSend: RequestHandler = (req, res, next) => {
  res.status(StatusCodes.OK).json({
    status: STATUS_NAME.SUCCESS,
    message: 'Get data successfully',
    data: req.data,
  })
}

export const updateSend: RequestHandler = (req, res, next) => {
  res.status(StatusCodes.OK).json({
    status: STATUS_NAME.SUCCESS,
    message: 'Update data successfully',
    data: req.data,
  })
}

export const deleteSend: RequestHandler = (req, res, next) => {
  res.status(StatusCodes.OK).json({
    status: STATUS_NAME.SUCCESS,
    message: 'Delete data successfully',
    data: req.data,
  })
}
