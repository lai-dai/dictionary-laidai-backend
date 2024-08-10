import { z } from 'zod'
import { getAllCommonDataSchema, orderSchema } from '../_lib/schemas/common'

export const getAllPartOfSpeechSchema = getAllCommonDataSchema.merge(
  z.object({
    name: z.string().optional(),
    order: orderSchema.optional(),
  })
)

export const createDataSchema = z.object({
  name: z.string().transform((e) => e?.toLowerCase()),
  description: z.string().optional(),
  order: z.number().optional(),
})
