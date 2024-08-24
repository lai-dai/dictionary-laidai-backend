import { z } from 'zod'
import {
  getAllCommonDataSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    id: z.number(),
    definition: z.string(),
    translate: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    wordId: z
      .string()
      .or(z.number().min(1, 'greater than 0'))
      .transform(Number)
      .optional(),
    meaningId: z
      .string()
      .or(z.number().min(1, 'greater than 0'))
      .transform(Number)
      .optional(),
  })
)

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      definition: true,
      translate: true,
      wordId: true,
      meaningId: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
