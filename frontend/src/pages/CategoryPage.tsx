import { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Square, SquaresFour, Faders } from '@phosphor-icons/react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { FilterSidebar } from '@/components/products/FilterSidebar'
import { useProducts } from '@/hooks/useProducts'

const CATEGORY_META: Record<string, { name: string; description: string }> = {
  'new-in': { name: 'New In', description: 'As novidades que acabaram de chegar.' },
  alfaiataria: {
    name: 'Alfaiataria',
    description:
      'Descubra a nossa coleção de alfaiataria, onde a qualidade e o estilo se encontram. Cada peça é cuidadosamente selecionada para atender às suas necessidades.',
  },
  ocasioes: { name: 'Ocasiões', description: 'Looks perfeitos para cada momento.' },
  colecoes: { name: 'Coleções', description: 'Nossas coleções exclusivas.' },
  'best-sellers': { name: 'Best Sellers', description: 'Os favoritos de todas.' },
  roupas: { name: 'Roupas', description: 'Nossa linha completa de roupas.' },
  'ultimas-pecas': { name: 'Últimas Peças', description: 'Corra, estoque limitado!' },
  sale: { name: 'Sale', description: 'Promoções imperdíveis.' },
}

export function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [columns, setColumns] = useState<2 | 4>(4)

  const meta = CATEGORY_META[category ?? ''] ?? { name: category ?? '', description: '' }
  const { data, isLoading } = useProducts(category)

  const currentPage = Number(searchParams.get('page') || 1)
  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="px-10 pt-8 pb-0 text-[10px] uppercase tracking-wider text-swell-text-light">
        <Link to="/">INÍCIO</Link> &nbsp;&lt;&nbsp; {meta.name.toUpperCase()}
      </div>

      {/* Category header */}
      <div className="text-center px-5 py-10">
        <h2 className="font-serif text-4xl font-normal mb-5">{meta.name}</h2>
        {meta.description && (
          <p className="max-w-2xl mx-auto text-swell-text-light text-sm font-light">
            {meta.description}
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex justify-between items-center px-10 pb-5">
        <div className="flex gap-2 items-center text-swell-text-light">
          <button onClick={() => setColumns(4)} aria-label="Grid 4 colunas">
            <SquaresFour size={24} className={columns === 4 ? 'text-swell-text-dark' : ''} />
          </button>
          <button onClick={() => setColumns(2)} aria-label="Grid 2 colunas">
            <Square size={24} className={columns === 2 ? 'text-swell-text-dark' : ''} />
          </button>
          {data && (
            <span className="text-xs ml-2 text-swell-text-light">{data.total} produtos</span>
          )}
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 border border-swell-border px-5 py-2.5 text-xs bg-white hover:border-swell-accent transition-colors"
        >
          Filtrar e Ordenar <Faders size={16} />
        </button>
      </div>

      {/* Grid */}
      <ProductGrid products={data?.items ?? []} columns={columns} isLoading={isLoading} />

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-2 pb-16">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 text-sm border transition-colors ${
                p === currentPage
                  ? 'bg-swell-accent text-white border-swell-accent'
                  : 'border-swell-border hover:border-swell-accent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <FilterSidebar isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  )
}
