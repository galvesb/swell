import { api } from './client'

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  order: number
}

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories')
    return data
  },

  adminList: async (): Promise<Category[]> => {
    const { data } = await api.get('/admin/categories')
    return data
  },

  create: async (payload: { name: string; description?: string }): Promise<Category> => {
    const { data } = await api.post('/admin/categories', payload)
    return data
  },

  update: async (id: string, payload: { name?: string; description?: string; order?: number }): Promise<Category> => {
    const { data } = await api.patch(`/admin/categories/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`)
  },
}
