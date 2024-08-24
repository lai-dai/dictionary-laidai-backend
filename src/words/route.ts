import express from 'express'

import * as controller from './controller'
import { validatorBody, validatorQuery } from '../_middlewares/validator'
import { createAttrSchema, getAllAttrSchema, updateAttrSchema } from './schema'
import * as authController from '../auth/controller'

export const router = express.Router()

router
  .route('/search')
  .get(
    validatorQuery(getAllAttrSchema),
    controller.aliasGetAllData,
    controller.aliasIncludeGetAllData,
    controller.getAllData
  )

router
  .route('/search/:id')
  .get(controller.aliasIncludeGetData, controller.getData)

router.use(authController.protect)
router.use(authController.restrictTo('admin'))

router
  .route('/')
  .get(
    validatorQuery(getAllAttrSchema),
    controller.aliasGetAllData,
    controller.getAllData
  )
  .post(validatorBody(createAttrSchema), controller.createData)

router
  .route('/:id')
  .get(controller.getData)
  .patch(validatorBody(updateAttrSchema), controller.updateData)
  .delete(controller.deleteData)
