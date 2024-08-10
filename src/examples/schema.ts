import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const getAllDataSchema = getAllCommonDataSchema.merge(
  z.object({
    sentence: z.string().optional(),
    translate: z.string().optional(),
  })
)

export const createDataSchema = z.object({
  sentence: z.string(),
  translate: z.string().optional(),
  definitionId: z.number().optional(),
})
