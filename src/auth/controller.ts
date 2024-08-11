import { Request, RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import crypto from 'crypto'

import { models } from '../_db'
import { AttrType } from '../users/type'
import { signToken } from '../_lib/utils/token'
import { catchAsync } from '../_lib/utils/catch-async'
import { encryptPassword, matchPassword } from '../_lib/utils/password'
import { STATUS_NAME } from '../_lib/constants/status-name'
import { AppError } from '../_lib/utils/app-error'
import jwt from 'jsonwebtoken'
import { delve } from '../_lib/utils/delve'
import { sendEmail } from '../_lib/utils/email'
import { Op } from 'sequelize'
import { OAuth2Client } from 'google-auth-library'
import { RoleType } from '../_lib/types/common'

const createSendToken = (
  user: AttrType,
  statusCode: number,
  req: Request,
  res: Response,
  message?: string
) => {
  const token = signToken(user.id as number)

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  })

  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: STATUS_NAME.SUCCESS,
    message,
    data: {
      token,
      user,
    },
  })
}

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password: _password } = req.body

  const user = await models.User.findOne({
    where: { email },
    attributes: {
      exclude: [
        'passwordChangedAt',
        'passwordResetToken',
        'passwordResetExpires',
      ],
    },
  })

  if (user) {
    return next(new AppError('Email already exists', StatusCodes.UNAUTHORIZED))
  }

  const password = await encryptPassword(_password)

  const newUser = await models.User.create({
    name,
    email,
    password,
  } as any)

  createSendToken(
    newUser.dataValues,
    StatusCodes.CREATED,
    req,
    res,
    'Register is successfully'
  )
})

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new AppError(
        'Please provide email and password!',
        StatusCodes.BAD_REQUEST
      )
    )
  }

  // 2) Check if user exists && password is correct
  const user = await models.User.findOne({
    where: { email },
    attributes: {
      exclude: [
        'passwordChangedAt',
        'passwordResetToken',
        'passwordResetExpires',
      ],
    },
  })

  if (!user || !(await matchPassword(password, user.dataValues.password!))) {
    return next(
      new AppError('Incorrect email or password', StatusCodes.UNAUTHORIZED)
    )
  }

  // // 3) If everything ok, send token to client
  createSendToken(
    user.dataValues,
    StatusCodes.OK,
    req,
    res,
    'Login is successfully'
  )
})

export const logout: RequestHandler = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res
    .status(StatusCodes.OK)
    .json({ status: STATUS_NAME.SUCCESS, message: 'Logout is successfully' })
}

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        StatusCodes.UNAUTHORIZED
      )
    )
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET!)

  // 3) Check if user still exists
  const currentUser = await models.User.findByPk(delve(decoded as object, 'id'))
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    )
  }

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again.', 401)
  //   )
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser.dataValues
  res.locals.user = currentUser.dataValues
  next()
})

// Only for rendered pages, no errors!
export const isLoggedIn: RequestHandler = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!)

      // 2) Check if user still exists
      const currentUser = await models.User.findByPk(
        delve(decoded as object, 'id')
      )
      if (!currentUser) {
        return next()
      }

      // // 3) Check if user changed password after the token was issued
      // if (currentUser.changedPasswordAfter(decoded.iat)) {
      //   return next()
      // }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser
      return next()
    } catch (err) {
      return next()
    }
  }
  next()
}

export const restrictTo = (...roles: RoleType[]) => {
  return ((req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user?.role!)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      )
    }

    next()
  }) as RequestHandler
}

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await models.User.findOne({ where: { email: req.body.email } })
  if (!user) {
    return next(new AppError('There is no user with email address.', 404))
  }

  // 2) Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  user.setDataValue('passwordResetToken', passwordResetToken)
  user.setDataValue('passwordResetExpires', Date.now() + 10 * 60 * 1000)

  await user.save()

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} .\nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.dataValues.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    })

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    })
  } catch (err) {
    user.setDataValue('passwordResetToken', undefined)
    user.setDataValue('passwordResetExpires', undefined)
    await user.save()

    next(
      new AppError(
        'There was an error sending the email. Try again later!',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    )
  }
})

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await models.User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: new Date() },
    },
  })

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(
      new AppError('Token is invalid or has expired', StatusCodes.BAD_REQUEST)
    )
  }

  const password = await encryptPassword(req.body.password)

  user.setDataValue('password', password)
  user.setDataValue('passwordResetToken', undefined)
  user.setDataValue('passwordResetExpires', undefined)

  await user.save()

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user.dataValues, StatusCodes.OK, req, res)
})

export const updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password: _password } = req.body

  // 1) Get user from collection
  const user = await models.User.findByPk(req.user?.id, {
    attributes: {
      exclude: [
        'passwordChangedAt',
        'passwordResetToken',
        'passwordResetExpires',
      ],
    },
  })

  // 2) Check if POSTed current password is correct
  if (
    !user ||
    !(await matchPassword(passwordCurrent, user?.dataValues.password!))
  ) {
    return next(new AppError('Your current password is wrong.', 401))
  }

  // 3) If so, update password
  const password = await encryptPassword(_password)

  user.setDataValue('password', password)
  user.setDataValue('passwordChangedAt', Date.now() - 1000)

  await user.save()
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(
    user.dataValues,
    StatusCodes.OK,
    req,
    res,
    'Update password is successfully'
  )
})

const client = new OAuth2Client()

export const verifyGoogleAccount = catchAsync(async (req, res, next) => {
  const { idToken } = req.body
  if (typeof idToken !== 'string') {
    throw new Error('idToken invalid')
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_ID,
  })
  const payload = ticket.getPayload()

  if (!payload) {
    throw new Error('not match')
  }

  const currentTimestamp = Math.floor(new Date().getTime() / 1000)
  if (payload.exp < currentTimestamp) {
    throw new Error('not match')
  }

  if (payload.aud !== process.env.GOOGLE_ID) {
    throw new Error('not match')
  }

  // createSendToken(
  //   payload,
  //   StatusCodes.OK,
  //   req,
  //   res,
  //   'Update password is successfully'
  // )
})
