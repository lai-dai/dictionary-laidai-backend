import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const dataSchema = z.object({
  id: z.number(),
  content: z.string(),
  totalLike: z.number().optional(),
  commentId: z.number().nullable().optional(),
})

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      content: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true }).merge(
  z.object({
    commentId: z.number().optional(),
  })
)

export const updateDataSchema = createDataSchema.partial()
