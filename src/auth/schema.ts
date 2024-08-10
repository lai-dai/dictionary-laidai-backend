import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'at least 1 character')
      .max(50, 'no more than 50 characters')
      .trim(),
    email: z.string().email(),
    password: z.string().min(6, 'must be at least 6 characters long'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'not match password',
    path: ['passwordConfirm'],
  })

export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6, 'must be at least 6 characters long'),
})

export const verifyGoogleAccSchema = z.object({
  idToken: z.string(),
})
