import express from 'express'

import * as controller from './controller'
import { validatorBody, validatorQuery } from '../_middlewares/validator'
import { createDataSchema, getAllDataSchema } from './schema'

export const router = express.Router()

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
  .patch(validatorBody(createDataSchema), controller.updateData)
  .delete(controller.deleteData)
