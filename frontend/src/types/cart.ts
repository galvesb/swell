export interface CartItem {
  id: string
  product_id: string
  quantity: number
  size: string
  color: string
}

export interface GuestCartItem {
  product_id: string
  quantity: number
  size: string
  color: string
  // local display data
  name?: string
  price?: number
  image?: string
}
