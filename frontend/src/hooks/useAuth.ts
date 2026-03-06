import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { authApi } from '@/api/auth'
import { cartApi } from '@/api/cart'

export function useAuth() {
  const { setToken, setUser, logout: clearAuth } = useAuthStore()
  const { items: guestItems, clearCart } = useCartStore()

  const login = async (email: string, password: string) => {
    const { access_token } = await authApi.login({ username: email, password })
    setToken(access_token)

    const user = await authApi.me()
    setUser(user)

    // Merge guest cart
    if (guestItems.length > 0) {
      try {
        await cartApi.mergeCart(guestItems)
        clearCart()
      } catch {
        // non-critical: keep guest cart if merge fails
      }
    }

    return user
  }

  const register = async (email: string, password: string, fullName: string) => {
    await authApi.register({ email, password, full_name: fullName })
    return login(email, password)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuth()
    }
  }

  return { login, register, logout }
}
