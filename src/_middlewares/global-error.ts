import { ErrorRequestHandler } from 'express'
import { AppError } from '../_lib/utils/app-error'
import { StatusCodes } from 'http-status-codes'

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  console.log(value)

  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401)

const sendErrorDev = (err: any, res: any) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err: any, res: any) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err)

    // 2) Send generic message
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went very wrong!',
    })
  }
}

export const globalError: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  err.status = err?.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }

    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}
