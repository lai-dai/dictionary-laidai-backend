import express from 'express'

import * as controller from './controller'
import { validatorBody, validatorQuery } from '../_middlewares/validator'
import { createDataSchema, getAllPartOfSpeechSchema } from './schema'
import * as authController from '../auth/controller'

export const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(
    validatorQuery(getAllPartOfSpeechSchema),
    controller.aliasGetAllData,
    controller.getAllData
  )

router.use(authController.restrictTo('admin'))

router
  .route('/')
  .post(
    validatorBody(createDataSchema),
    controller.aliasCreateData,
    controller.createData
  )

router
  .route('/:id')
  .get(controller.getData)
  .patch(controller.updateData)
  .delete(controller.deleteData)
