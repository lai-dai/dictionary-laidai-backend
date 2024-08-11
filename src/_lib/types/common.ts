import { z } from 'zod'
import { orderSchema, roleSchema } from '../schemas/common'

export type PaginationType = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export type ResBody<TList = any> = {
  message: string
  data: {
    list: TList
    pagination: PaginationType
  }
}

export type OrderType = z.infer<typeof orderSchema>
export type RoleType = z.infer<typeof roleSchema>
