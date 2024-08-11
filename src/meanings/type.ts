import { z } from 'zod'
import { dataSchema } from './schema'

export type AttrType = z.infer<typeof dataSchema>
