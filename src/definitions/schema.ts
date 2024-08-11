import { z } from 'zod'
import { getAllCommonDataSchema } from '../_lib/schemas/common'

export const dataSchema = z.object({
  id: z.number(),
  definition: z.string(),
})

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      definition: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()
