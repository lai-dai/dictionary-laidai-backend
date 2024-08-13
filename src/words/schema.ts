import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const dataSchema = z.object({
  id: z.number(),
  word: z.string().transform((e) => e?.toLowerCase()),
  description: z.number().optional(),
})

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      word: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
