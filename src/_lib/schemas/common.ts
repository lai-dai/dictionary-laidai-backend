import { z } from 'zod'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/common'

export const getAllCommonDataSchema = z.object({
  page: z
    .number()
    .or(z.string().regex(/^\d+$/, 'number').transform(Number))
    .default(DEFAULT_PAGE)
    .refine((n) => n > 0, 'greater than 0'),
  pageSize: z
    .number()
    .or(z.string().regex(/^\d+$/, 'number').transform(Number))
    .default(DEFAULT_PAGE_SIZE)
    .refine((n) => n > 0, 'greater than 0'),
})

export const orderSchema = z.enum(['DESC', 'ASC'])

export const roleSchema = z.enum(['user', 'admin'])
