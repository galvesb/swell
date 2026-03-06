import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import useEmblaCarousel from 'embla-carousel-react'
import { useSettingsStore } from '@/store/settingsStore'
import { productsApi } from '@/api/products'
import type { Product } from '@/types/product'

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1515347619362-7dd3e215442e?auto=format&fit=crop&w=1400&q=80'

export function HomePage() {
  const settings = useSettingsStore((s) => s.settings)
  const storeName = settings?.store_name ?? 'Swell'
  const heroText = settings?.hero_text ?? 'Nova Coleção 2025'
  const heroImage = settings?.hero_image ?? DEFAULT_HERO

  const [principais, setPrincipais] = useState<Product[]>([])

  useEffect(() => {
    productsApi
      .list({ tags: ['principal'], page_size: 20 })
      .then((res) => setPrincipais(res.items))
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: 400 }}>
        <img
          src={heroImage}
          alt={storeName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center px-5">
          <h1 className="font-serif text-5xl md:text-7xl font-normal mb-4">{storeName}</h1>
          <p className="text-sm md:text-base font-light tracking-widest mb-8 uppercase">{heroText}</p>
          <Link
            to="/categoria/new-in"
            className="border border-white px-10 py-3.5 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Explorar
          </Link>
        </div>
      </section>

      {/* Principais */}
      {principais.length > 0 && (
        <section className="px-6 md:px-10 py-16">
          <h2 className="font-serif text-2xl text-center mb-10">Principais</h2>

          {/* Mobile: grid 2 colunas */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {principais.map((product) => (
              <PrincipalCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop: carrossel Embla */}
          <div className="hidden md:block">
            <PrincipaisCarousel products={principais} />
          </div>
        </section>
      )}
    </div>
  )
}

function PrincipalCard({ product }: { product: Product }) {
  const displayPrice = product.sale_price ?? product.price
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price

  return (
    <Link to={`/produto/${product.slug}`} className="group relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col items-start justify-end p-4">
        <span className="text-white text-xs uppercase tracking-widest font-medium">{product.name}</span>
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount && (
            <span className="text-white/60 text-xs line-through">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
          <span className="text-white text-xs font-medium">
            {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
    </Link>
  )
}

function PrincipaisCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 4,
    containScroll: 'trimSnaps',
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2">
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[calc(25%-6px)]">
              <PrincipalCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-colors"
          aria-label="Anterior"
        >
          <CaretLeft size={20} />
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-colors"
          aria-label="Próximo"
        >
          <CaretRight size={20} />
        </button>
      )}
    </div>
  )
}
