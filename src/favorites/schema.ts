import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const dataSchema = z.object({
  id: z.number(),
})

export const getAllDataSchema = getAllCommonDataSchema

export const createDataSchema = z.object({
  userId: z.number(),
  wordId: z.number(),
})

export const updateDataSchema = createDataSchema.partial()
