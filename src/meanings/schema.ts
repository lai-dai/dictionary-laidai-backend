import { z } from 'zod'
import { getAllCommonDataSchema, orderSchema } from '../_lib/schemas/common'

export const dataSchema = z.object({
  id: z.number(),
  description: z.string().optional(),
})

export const getAllDataSchema = getAllCommonDataSchema

export const createDataSchema = z.object({
  wordId: z.number(),
  partOfSpeechId: z.number(),
  description: z.string().optional(),
})

export const updateDataSchema = createDataSchema.partial()
