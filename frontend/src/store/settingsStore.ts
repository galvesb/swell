import { create } from 'zustand'
import { settingsApi } from '@/api/settings'
import type { SiteSettings, SecondaryColor } from '@/types/settings'

const COLOR_MAP: Record<SecondaryColor, { accent: string; hover: string }> = {
  '#A98F81': { accent: '#A98F81', hover: '#91776b' },
  '#348b92': { accent: '#348b92', hover: '#2a6f75' },
}

function applyColorVars(color: SecondaryColor) {
  const { accent, hover } = COLOR_MAP[color] ?? COLOR_MAP['#A98F81']
  document.documentElement.style.setProperty('--swell-accent', accent)
  document.documentElement.style.setProperty('--swell-accent-hover', hover)
}

interface SettingsStore {
  settings: SiteSettings | null
  init: () => Promise<void>
  update: (data: Partial<SiteSettings>) => void
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,

  async init() {
    try {
      const data = await settingsApi.get()
      document.title = data.store_name
      applyColorVars(data.secondary_color)
      set({ settings: data })
    } catch {
      // keep defaults from CSS vars in :root
    }
  },

  update(data) {
    const current = get().settings
    const next = { ...current, ...data } as SiteSettings
    if (data.secondary_color) {
      applyColorVars(data.secondary_color)
    }
    if (data.store_name) {
      document.title = data.store_name
    }
    set({ settings: next })
  },
}))
