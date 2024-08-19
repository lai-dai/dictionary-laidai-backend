import { z } from 'zod'
import {
  commonDataSchema,
  getAllCommonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    phonetic: z.string().transform((e) => e?.toLowerCase()),
    audio: z.string().optional(),
    description: z.string().optional(),
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
      phonetic: true,
      wordId: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
