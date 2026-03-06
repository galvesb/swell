import { create } from 'zustand'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  accessToken: string | null // RAM only — never localStorage
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  setToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, accessToken: null }),
  isAuthenticated: () => get().user !== null,
  isAdmin: () => get().user?.role === 'admin',
}))
