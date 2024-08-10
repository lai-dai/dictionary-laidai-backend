import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const getAllPartOfSpeechSchema = getAllCommonDataSchema.merge(
  z.object({
    word: z.string().optional(),
  })
)

export const createDataSchema = z.object({
  word: z.string().transform((e) => e?.toLowerCase()),
  phonetic: z.string().optional(),
  description: z.number().optional(),
})
