export interface DataAttr {
  id?: number
  name: string
  email: string
  image?: string
  role?: string
  password?: string
  passwordChangedAt?: number
  passwordResetToken?: string
  passwordResetExpires?: number
  active?: boolean
  provider?: 'github' | 'google' | 'credentials'
}
