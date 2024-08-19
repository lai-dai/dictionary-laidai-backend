import { z } from 'zod'
import {
  getAllCommonDataSchema,
  commonDataSchema,
} from '../_lib/schemas/common'

export const attrSchema = commonDataSchema.merge(
  z.object({
    word: z.string().transform((e) => e?.toLowerCase()),
    description: z.string().optional(),
  })
)

export const getAllAttrSchema = getAllCommonDataSchema.merge(
  attrSchema
    .pick({
      word: true,
    })
    .partial()
)

export const createAttrSchema = attrSchema.omit({ id: true })

export const updateAttrSchema = createAttrSchema.partial()
