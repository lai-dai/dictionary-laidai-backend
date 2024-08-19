import { z } from 'zod'
import {
  getAllCommonDataSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    content: z.string(),
    totalLike: z.number().optional(),
    commentId: z
      .string()
      .or(z.number().min(1, 'greater than 0'))
      .transform(Number)
      .nullable()
      .optional(),
    wordId: z
      .string()
      .or(z.number().min(1, 'greater than 0'))
      .transform(Number)
      .optional(),
  })
)

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      content: true,
      wordId: true,
      commentId: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
