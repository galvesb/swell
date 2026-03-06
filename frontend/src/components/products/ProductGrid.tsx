import { ProductCard } from './ProductCard'
import type { Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 4
  isLoading?: boolean
}

export function ProductGrid({ products, columns = 4, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-1 px-10 pb-16 ${columns === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-swell-border" style={{ aspectRatio: '2/3' }} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-swell-text-light">
        <p>Nenhum produto encontrado.</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-1 px-10 pb-16 ${columns === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
