import { STATUS_NAME } from '../constants/status-name'

export class AppError extends Error {
  private statusCode: number
  private status: string
  private isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? STATUS_NAME.FAIL : STATUS_NAME.ERROR
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}
