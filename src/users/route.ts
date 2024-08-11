import express from 'express'
import * as controller from './controller'
import * as authController from '../auth/controller'
import { validatorBody, validatorQuery } from '../_middlewares/validator'
import {
  createDataSchema,
  getAllDataSchema,
  updateDataSchema,
  updateMyPasswordSchema,
} from './schema'

export const router = express.Router()

// Protect all routes after this middleware
router.use(authController.protect)

router.patch(
  '/updateMyPassword',
  validatorBody(updateMyPasswordSchema),
  authController.updatePassword
)
router.get('/me', controller.getMe, controller.getData)
router.patch(
  '/updateMe',
  controller.uploadUserImage,
  controller.resizeUserImage,
  controller.updateMe
)
router.delete('/deleteMe', controller.deleteMe)

router.use(authController.restrictTo('admin'))

router
  .route('/')
  .get(
    validatorQuery(getAllDataSchema),
    controller.aliasGetAllData,
    controller.getAllData
  )
  .post(validatorBody(createDataSchema), controller.createData)

router
  .route('/:id')
  .get(controller.getData)
  .patch(validatorBody(updateDataSchema), controller.updateData)
  .delete(controller.deleteData)
