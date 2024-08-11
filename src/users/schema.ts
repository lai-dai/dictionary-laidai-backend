import { z } from 'zod'
import { getAllCommonDataSchema, roleSchema } from '../_lib/schemas/common'

export const dataSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  image: z.string().optional(),
  role: roleSchema.default('user').optional(),
  password: z.string().optional(),
  passwordChangedAt: z.date().or(z.number()).optional(),
  passwordResetToken: z.string().optional(),
  passwordResetExpires: z.date().or(z.number()).optional(),
  active: z.boolean().default(true).optional(),
  provider: z
    .enum(['github', 'google', 'credentials'])
    .default('credentials')
    .optional(),
})

export const getAllDataSchema = getAllCommonDataSchema.merge(
  dataSchema
    .pick({
      name: true,
      email: true,
      role: true,
      active: true,
      provider: true,
    })
    .partial()
)

export const createDataSchema = dataSchema.omit({ id: true })

export const updateDataSchema = createDataSchema.partial()

export const updateMyPasswordSchema = z
  .object({
    passwordCurrent: z.string(),
    password: z.string().min(8, 'must be at least 8 characters long'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'not match password',
    path: ['passwordConfirm'],
  })
