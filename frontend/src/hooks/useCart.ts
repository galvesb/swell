import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { cartApi } from '@/api/cart'
import type { GuestCartItem } from '@/types/cart'

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const { addItem, removeItem, updateQuantity } = useCartStore()

  const add = async (item: GuestCartItem) => {
    if (isAuthenticated) {
      await cartApi.addItem({
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })
    }
    // Always add to local store too (for immediate UI feedback)
    addItem(item)
  }

  const remove = async (productId: string, size: string, color: string, itemId?: string) => {
    if (isAuthenticated && itemId) {
      await cartApi.removeItem(itemId)
    }
    removeItem(productId, size, color)
  }

  const update = async (productId: string, size: string, color: string, quantity: number, itemId?: string) => {
    if (isAuthenticated && itemId) {
      await cartApi.updateItem(itemId, quantity)
    }
    updateQuantity(productId, size, color, quantity)
  }

  return { add, remove, update }
}
