import { z } from 'zod'
import {
  getAllCommonDataSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    id: z.number(),
    userId: z.number().optional(),
    wordId: z.number().optional(),
  })
)

export const getAllDataSchema = getAllCommonDataSchema

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
