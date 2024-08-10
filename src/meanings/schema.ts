import { z } from 'zod'
import { getAllCommonDataSchema, orderSchema } from '../_lib/schemas/common'

export const getAllPartOfSpeechSchema = getAllCommonDataSchema

export const createDataSchema = z.object({
  wordId: z.number().optional(),
  partOfSpeechId: z.number().optional(),
})
