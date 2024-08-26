import express from 'express'

import * as controller from './controller'
import { validatorBody, validatorQuery } from '../_middlewares/validator'
import { createDataSchema, getAllDataSchema } from './schema'
import * as authController from '../auth/controller'

export const router = express.Router()

router.use(authController.protect)
router.use(authController.restrictTo('admin'))

router
  .route('/')
  .get(
    validatorQuery(getAllDataSchema),
    controller.aliasGetAllData,
    // controller.aliasIncludeGetAllData,
    controller.getAllData
  )
  .post(validatorBody(createDataSchema), controller.createData)

router
  .route('/:id')
  .get(controller.getData)
  .patch(validatorBody(createDataSchema), controller.updateData)
  .delete(controller.deleteData)
