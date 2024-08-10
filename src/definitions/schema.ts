import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const getAllDataSchema = getAllCommonDataSchema.merge(
  z.object({
    definition: z.string().optional(),
    examplesIds: z.number().optional(),
  })
)

export const createDataSchema = z.object({
  definition: z.string(),
  meaningId: z.number().optional(),
})
