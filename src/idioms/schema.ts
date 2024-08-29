import { z } from 'zod'
import {
  getAllCommonDataSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    idiom: z.string().transform((e) => e?.toLowerCase()),
    definition: z.string().optional(),
    translate: z.string().optional(),
    description: z.string().nullable().optional(),
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
      idiom: true,
      wordId: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
