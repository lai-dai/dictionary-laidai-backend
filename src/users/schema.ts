import { z } from 'zod'

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
