import express from 'express'

import * as controller from './controller'
import { validatorQuery } from '../_middlewares/validator'
import { getAllAttrSchema } from './schema'

export const router = express.Router()

router
  .route('/')
  .get(
    validatorQuery(getAllAttrSchema),
    controller.aliasGetAllData,
    controller.aliasIncludeGetAllData,
    controller.getAllData
  )

router.route('/:id').get(controller.aliasIncludeGetData, controller.getData)
