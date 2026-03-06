import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GuestCartItem } from '@/types/cart'

interface CartState {
  items: GuestCartItem[]
  isOpen: boolean
  addItem: (item: GuestCartItem) => void
  updateQuantity: (product_id: string, size: string, color: string, quantity: number) => void
  removeItem: (product_id: string, size: string, color: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  totalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === item.product_id && i.size === item.size && i.color === item.color,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      updateQuantity: (product_id, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === product_id && i.size === size && i.color === color
              ? { ...i, quantity }
              : i,
          ),
        })),

      removeItem: (product_id, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product_id === product_id && i.size === size && i.color === color),
          ),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'swell-guest-cart',
      partialize: (state) => ({ items: state.items }), // don't persist isOpen
    },
  ),
)
