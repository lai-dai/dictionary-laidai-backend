import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const dataSchema = z.object({
  id: z.number(),
  idiom: z.string().transform((e) => e?.toLowerCase()),
  definition: z.string().optional(),
  description: z.string().optional(),
})

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      idiom: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true }).merge(
  z.object({
    wordId: z.number(),
  })
)

export const updateDataSchema = createDataSchema.partial()
