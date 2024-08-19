import { z } from 'zod'
import {
  getAllCommonDataSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const dataSchema = commonDataSchema.merge(
  z.object({
    description: z.string().optional(),
    wordId: z.number().optional(),
    partOfSpeechId: z.number().optional(),
  })
)

export const getAllDataSchema = getAllCommonDataSchema

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
