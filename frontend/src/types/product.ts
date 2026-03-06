export interface ColorOption {
  name: string
  hex: string
}

export type ProductTag = 'new_in' | 'best_seller' | 'last_pieces' | 'sale'
export type SortBy = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'best_selling'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  tags: ProductTag[]
  price: number
  sale_price: number | null
  stock: number
  sizes: string[]
  colors: ColorOption[]
  images: string[]
  is_active: boolean
  sold_count: number
}

export interface ProductListResponse {
  items: Product[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface ProductFilters {
  category?: string
  min_price?: number
  max_price?: number
  sizes?: string[]
  colors?: string[]
  tags?: ProductTag[]
  sort_by?: SortBy
  page?: number
  page_size?: number
}
