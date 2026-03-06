import { api } from './client'
import type { CartItem, GuestCartItem } from '@/types/cart'

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const { data } = await api.get('/cart')
    return data
  },

  addItem: async (payload: Omit<CartItem, 'id'>): Promise<CartItem> => {
    const { data } = await api.post('/cart/items', payload)
    return data
  },

  updateItem: async (itemId: string, quantity: number): Promise<CartItem> => {
    const { data } = await api.patch(`/cart/items/${itemId}`, { quantity })
    return data
  },

  removeItem: async (itemId: string): Promise<void> => {
    await api.delete(`/cart/items/${itemId}`)
  },

  mergeCart: async (items: GuestCartItem[]): Promise<CartItem[]> => {
    const { data } = await api.post('/cart/merge', {
      items: items.map(({ product_id, quantity, size, color }) => ({
        product_id,
        quantity,
        size,
        color,
      })),
    })
    return data
  },
}
