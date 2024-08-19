import { z } from 'zod'
import {
  getAllCommonDataSchema,
  orderSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    name: z
      .string()
      .min(1, 'require')
      .transform((e) => e?.toLowerCase()),
    order: z.number().min(1, 'greater than 1'),
    abbreviation: z.string().optional(),
    translate: z.string().optional(),
    description: z.string().optional(),
  })
)

export const getAllDataSchema = getAllCommonDataSchema.merge(
  z
    .object({
      name: z.string(),
      order: orderSchema,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
