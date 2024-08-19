import { RequestHandler } from 'express'
import { FindAttributeOptions, Op } from 'sequelize'
import multer from 'multer'
import sharp from 'sharp'

import * as handlersFactory from '../_middlewares/handlers-factory'
import * as servicesFactory from '../_middlewares/services-factory'
import { StatusCodes } from 'http-status-codes'
import { models } from '../_db'
import { catchAsync } from '../_lib/utils/catch-async'
import { AppError } from '../_lib/utils/app-error'
import { STATUS_NAME } from '../_lib/constants/status-name'
import { AttrType } from './type'

const multerStorage = multer.memoryStorage()

const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true)
    } else {
      cb(
        new AppError('Not an image! Please upload only images.', 400) as any,
        false
      )
    }
  },
})

export const uploadUserImage = upload.single('image')

export const resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next()

  req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.file.filename}`)

  next()
})

export const getMe: RequestHandler = (req, res, next) => {
  req.params.id = String(req.user?.id)
  req.options = {
    attributes: {
      exclude: [
        'password',
        'passwordChangedAt',
        'passwordResetToken',
        'passwordResetExpires',
      ],
    } as FindAttributeOptions,
  }
  next()
}

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        StatusCodes.UNAUTHORIZED
      )
    )
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const { name, email } = req.body

  let image
  if (req.file) image = req.file.filename

  // 3) Update user document
  await models.User.update(
    { name, email, image },
    {
      where: { id: req.user?.id },
    }
  )

  const doc = await models.User.findByPk(req.user?.id, {
    attributes: {
      exclude: [
        'password',
        'passwordChangedAt',
        'passwordResetToken',
        'passwordResetExpires',
      ],
    },
  })

  if (!doc) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        StatusCodes.UNAUTHORIZED
      )
    )
  }

  res.status(StatusCodes.OK).json({
    status: STATUS_NAME.SUCCESS,
    message: 'Update me is successfully',
    data: {
      user: doc,
    },
  })
})

export const deleteMe = catchAsync(async (req, res, next) => {
  const doc = await models.User.findByPk(req.user?.id)

  if (!doc) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        StatusCodes.UNAUTHORIZED
      )
    )
  }

  doc.setDataValue('active', false)

  await doc.save()

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Delete is successfully',
    data: null,
  })
})

export const aliasGetAllData: RequestHandler = (req, res, next) => {
  const { page, pageSize, name, email, role, active, provider } =
    req.query as any

  const options: servicesFactory.GetAllOptionsType<AttrType> = {
    page,
    pageSize,
  }

  switch (true) {
    case typeof name === 'string' && name !== '':
      options.where = {
        name: { [Op.like]: `%${name}%` },
      }
      break

    case typeof email === 'string' && email !== '':
      options.where = {
        email: { [Op.like]: `%${email}%` },
        ...options.where,
      }
      break

    case typeof role === 'string' && role !== '':
      options.where = {
        role: { [Op.eq]: role },
        ...options.where,
      }
      break

    case typeof active === 'boolean':
      options.where = {
        active: { [Op.eq]: active },
        ...options.where,
      }
      break

    case typeof provider === 'string' && provider !== '':
      options.where = {
        provider: { [Op.eq]: provider },
        ...options.where,
      }
      break
  }

  req.options = options
  next()
}

export const getAllData = handlersFactory.getAllData(models.User)
export const createData: RequestHandler = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined! Please use /register instead',
  })
}
// export const createData = handlersFactory.createData(models.User)
export const getData = handlersFactory.getData(models.User)
// Do NOT update passwords with this!
export const updateData = handlersFactory.updateData(models.User)
export const deleteData = handlersFactory.deleteData(models.User)
