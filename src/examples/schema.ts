import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const dataSchema = z.object({
  id: z.number(),
  sentence: z.string().transform((e) => e?.toLowerCase()),
  translate: z.string().optional(),
})

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      sentence: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true }).merge(
  z.object({
    wordId: z.number(),
    idiomId: z.number().optional(),
    definitionId: z.number().optional(),
  })
)

export const updateDataSchema = createDataSchema.partial()
