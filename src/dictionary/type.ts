import { z } from 'zod'
import { attrSchema, createAttrSchema } from './schema'

export type AttrType = z.infer<typeof attrSchema>
export type CreateAttrType = z.infer<typeof createAttrSchema>
