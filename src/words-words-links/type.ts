import { z } from 'zod'
import { createDataSchema, dataSchema, getAllDataSchema } from './schema'

export type AttrType = z.infer<typeof dataSchema>
export type CreateAttrType = z.infer<typeof createDataSchema>
export type GetAllAttrType = z.infer<typeof getAllDataSchema>
