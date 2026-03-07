import { useState, useRef, useEffect } from 'react'
import { Upload, X } from '@phosphor-icons/react'
import { settingsApi } from '@/api/settings'
import { useSettingsStore } from '@/store/settingsStore'
import type { SecondaryColor } from '@/types/settings'

const COLOR_OPTIONS: { value: SecondaryColor; label: string }[] = [
  { value: '#A98F81', label: 'Original' },
  { value: '#348b92', label: 'Verde Agua' },
]

export function SiteSettingsPage() {
  const { settings, update } = useSettingsStore()
  const [storeName, setStoreName] = useState('')
  const [heroText, setHeroText] = useState('')
  const [secondaryColor, setSecondaryColor] = useState<SecondaryColor>('#A98F81')
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [heroPreview, setHeroPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name)
      setHeroText(settings.hero_text)
      setSecondaryColor(settings.secondary_color)
    }
  }, [settings])

  const handleFileChange = (file: File | null) => {
    setHeroFile(file)
    if (file) {
      setHeroPreview(URL.createObjectURL(file))
    } else {
      setHeroPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    const fd = new FormData()
    if (storeName !== settings?.store_name) fd.append('store_name', storeName)
    if (heroText !== settings?.hero_text) fd.append('hero_text', heroText)
    if (secondaryColor !== settings?.secondary_color) fd.append('secondary_color', secondaryColor)
    if (heroFile) fd.append('hero_image', heroFile)

    try {
      const updated = await settingsApi.update(fd)
      update(updated)
      setHeroFile(null)
      setHeroPreview(null)
      setSuccess(true)
    } catch {
      setError('Erro ao salvar configurações. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const currentHero = heroPreview ?? settings?.hero_image ?? null

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl mb-8">Geral</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Nome da Loja */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-swell-text-light mb-2">
            Nome da Loja
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-swell-border px-4 py-2.5 text-sm focus:outline-none focus:border-swell-accent"
            placeholder="Swell"
          />
        </div>

        {/* Texto do Hero */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-swell-text-light mb-2">
            Texto do Hero
          </label>
          <input
            type="text"
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            className="w-full border border-swell-border px-4 py-2.5 text-sm focus:outline-none focus:border-swell-accent"
            placeholder="Nova Coleção 2025"
          />
        </div>

        {/* Imagem do Hero */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-swell-text-light mb-2">
            Imagem do Hero
          </label>
          <div className="flex items-start gap-4">
            {currentHero && (
              <div className="relative w-32 h-20">
                <img
                  src={currentHero}
                  alt="Hero atual"
                  className="w-full h-full object-cover"
                />
                {heroFile && (
                  <button
                    type="button"
                    onClick={() => handleFileChange(null)}
                    className="absolute top-1 right-1 bg-swell-alert text-white rounded-full p-0.5"
                    aria-label="Remover seleção"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-32 h-20 border-2 border-dashed border-swell-border hover:border-swell-accent flex flex-col items-center justify-center gap-1 text-swell-text-light text-xs transition-colors"
            >
              <Upload size={20} />
              {heroFile ? heroFile.name.slice(0, 12) + '…' : 'Alterar'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </div>
          <p className="text-xs text-swell-text-light mt-1">JPEG, PNG ou WEBP. Máx. 5MB.</p>
        </div>

        {/* Cor Secundária */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-swell-text-light mb-3">
            Cor Secundária
          </label>
          <div className="flex gap-6">
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSecondaryColor(opt.value)}
                className="flex flex-col items-center gap-2"
                aria-label={opt.label}
              >
                <span
                  className={`w-10 h-10 rounded-full transition-all ${
                    secondaryColor === opt.value
                      ? 'ring-2 ring-offset-2 ring-swell-accent'
                      : 'ring-1 ring-swell-border'
                  }`}
                  style={{ backgroundColor: opt.value }}
                />
                <span className="text-xs text-swell-text-light">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {error && <p className="text-swell-alert text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm">Configurações salvas com sucesso!</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-swell-accent text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-swell-accent-hover transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}
