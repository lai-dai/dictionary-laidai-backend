import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const getAllDataSchema = getAllCommonDataSchema

export const dataSchema = z.object({
  id: z.number(),
  description: z.string().optional(),
})

export const createDataSchema = dataSchema
  .pick({
    description: true,
  })
  .merge(
    z.object({
      wordId: z.number(),
      partOfSpeechId: z.number(),
    })
  )

export const updateDataSchema = createDataSchema.partial()
