import { z } from 'zod'
import {
  getAllCommonDataSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    content: z.string(),
    totalLike: z.number().optional(),
    commentId: z.number().optional().nullable(),
  })
)

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      content: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
