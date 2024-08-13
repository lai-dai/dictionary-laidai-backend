import { z } from 'zod'
import { getAllCommonDataSchema, orderSchema } from '../_lib/schemas/common'

export const getAllDataSchema = getAllCommonDataSchema.merge(
  z.object({
    name: z.string().optional(),
    order: orderSchema.optional(),
  })
)

export const dataSchema = z.object({
  id: z.number(),
  name: z.string().transform((e) => e?.toLowerCase()),
  order: z.number().min(1, 'greater than 1'),
  abbreviation: z.string().optional(),
  translate: z.string().optional(),
  description: z.string().optional(),
})

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
