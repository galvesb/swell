import { api } from './client'
import type { User } from '@/types/user'

export interface LoginPayload {
  username: string // FastAPI OAuth2 uses "username" field
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<{ access_token: string }> => {
    const form = new URLSearchParams(payload)
    const { data } = await api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return data
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  me: async (): Promise<User> => {
    const { data } = await api.get('/auth/me')
    return data
  },
}
