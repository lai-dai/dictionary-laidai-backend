import express from 'express'
import * as controller from './controller'
import { validatorBody } from '../_middlewares/validator'
import { registerSchema, loginSchema, verifyGoogleAccSchema } from './schema'

export const router = express.Router()

router.post('/register', validatorBody(registerSchema), controller.register)
router.post('/login', validatorBody(loginSchema), controller.login)
router.post(
  '/verifyGoogleAccount',
  validatorBody(verifyGoogleAccSchema),
  controller.verifyGoogleAccount
)
router.get('/logout', controller.logout)

router.post('/forgotPassword', controller.forgotPassword)
router.patch('/resetPassword/:token', controller.resetPassword)
