import { X } from '@phosphor-icons/react'
import { useSearchParams } from 'react-router-dom'

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const SIZES = ['XPP', 'PP', 'P', 'M', 'G', 'GG']
const COLORS = [
  { name: 'Preto', hex: '#1a1a1a' },
  { name: 'Branco', hex: '#f5f5f5' },
  { name: 'Bege', hex: '#D4B896' },
  { name: 'Marrom', hex: '#8B6553' },
  { name: 'Azul', hex: '#2C5F8A' },
]
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'newest', label: 'Mais Recente' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'best_selling', label: 'Mais Vendido' },
]

export function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const getParam = (key: string) => searchParams.get(key) ?? ''
  const getParamArray = (key: string) => searchParams.getAll(key)

  const toggleArrayParam = (key: string, value: string) => {
    const current = getParamArray(key)
    const next = new URLSearchParams(searchParams)
    if (current.includes(value)) {
      next.delete(key)
      current.filter((v) => v !== value).forEach((v) => next.append(key, v))
    } else {
      next.append(key, value)
    }
    next.set('page', '1')
    setSearchParams(next)
  }

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const clearAll = () => setSearchParams({})

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[90%] md:w-[380px] bg-white z-[100] overflow-y-auto shadow-xl sidebar-transition ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-swell-border">
          <span className="font-serif text-lg">Filtrar e Ordenar</span>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Sort */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-medium mb-3">Ordenar por</h3>
            <select
              value={getParam('sort_by') || 'relevance'}
              onChange={(e) => setParam('sort_by', e.target.value)}
              className="w-full border border-swell-border px-3 py-2 text-sm focus:outline-none focus:border-swell-accent"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-medium mb-3">Preço</h3>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                placeholder="Min"
                value={getParam('min_price')}
                onChange={(e) => setParam('min_price', e.target.value)}
                className="w-full border border-swell-border px-3 py-2 text-sm focus:outline-none focus:border-swell-accent"
              />
              <span className="text-swell-text-light">–</span>
              <input
                type="number"
                placeholder="Max"
                value={getParam('max_price')}
                onChange={(e) => setParam('max_price', e.target.value)}
                className="w-full border border-swell-border px-3 py-2 text-sm focus:outline-none focus:border-swell-accent"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-medium mb-3">Tamanho</h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const selected = getParamArray('sizes').includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggleArrayParam('sizes', s)}
                    className={`px-3 py-1.5 text-xs border transition-colors ${selected ? 'bg-swell-accent text-white border-swell-accent' : 'border-swell-border hover:border-swell-accent'}`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-medium mb-3">Cor</h3>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => {
                const selected = getParamArray('colors').includes(c.name)
                return (
                  <button
                    key={c.name}
                    onClick={() => toggleArrayParam('colors', c.name)}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${selected ? 'border-swell-accent scale-110' : 'border-transparent hover:border-swell-text-light'}`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                )
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-medium mb-3">Filtros rápidos</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'novos', label: 'Novo!' },
                { value: 'promocoes', label: 'Promoções' },
                { value: 'ultimas_pecas', label: 'Últimas Peças' },
                { value: 'mais_vendidos', label: 'Mais Vendido' },
              ].map((tag) => {
                const selected = getParamArray('tags').includes(tag.value)
                return (
                  <button
                    key={tag.value}
                    onClick={() => toggleArrayParam('tags', tag.value)}
                    className={`px-3 py-1.5 text-xs border transition-colors ${selected ? 'bg-swell-accent text-white border-swell-accent' : 'border-swell-border hover:border-swell-accent'}`}
                  >
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Clear */}
          <button
            onClick={clearAll}
            className="w-full border border-swell-border py-2.5 text-sm uppercase tracking-wider hover:bg-swell-bg transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </>
  )
}
