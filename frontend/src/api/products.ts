import { api } from './client'
import type { Product, ProductFilters, ProductListResponse } from '@/types/product'

export const productsApi = {
  list: async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, val]) => {
      if (val === undefined || val === null) return
      if (Array.isArray(val)) {
        val.forEach((v) => params.append(key, String(v)))
      } else {
        params.append(key, String(val))
      }
    })
    const { data } = await api.get('/products', { params })
    return data
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get(`/products/${slug}`)
    return data
  },

  // Admin endpoints
  adminList: async (page = 1, pageSize = 20): Promise<ProductListResponse> => {
    const { data } = await api.get('/admin/products', { params: { page, page_size: pageSize } })
    return data
  },

  create: async (payload: Record<string, unknown>): Promise<Product> => {
    const { data } = await api.post('/admin/products', payload)
    return data
  },

  update: async (id: string, payload: Record<string, unknown>): Promise<Product> => {
    const { data } = await api.patch(`/admin/products/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`)
  },

  uploadImages: async (productId: string, files: File[]): Promise<{ images: string[] }> => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const { data } = await api.post(`/admin/products/${productId}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  deleteImage: async (productId: string, filename: string): Promise<void> => {
    await api.delete(`/admin/products/${productId}/images`, { data: { filename } })
  },
}
