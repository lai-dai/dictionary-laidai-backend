import { z } from 'zod'
import {
  getAllCommonDataSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    id: z.number(),
    definition: z.string(),
    image: z.string().optional(),
    wordId: z.number().min(1, 'greater than 0').optional(),
    meaningId: z.number().min(1, 'greater than 0').optional(),
  })
)

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      definition: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
