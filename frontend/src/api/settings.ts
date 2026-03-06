import { api } from '@/api/client'
import type { SiteSettings } from '@/types/settings'

export const settingsApi = {
  get(): Promise<SiteSettings> {
    return api.get('/settings').then((r) => r.data)
  },

  update(data: FormData): Promise<SiteSettings> {
    return api
      .put('/settings', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data)
  },
}
