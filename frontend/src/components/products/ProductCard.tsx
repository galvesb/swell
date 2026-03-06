import { Link } from 'react-router-dom'
import { Tote, Heart } from '@phosphor-icons/react'
import type { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const displayPrice = product.sale_price ?? product.price
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    const defaultSize = product.sizes[0] ?? 'U'
    const defaultColor = product.colors[0]?.name ?? 'Único'
    addItem({
      product_id: product.id,
      quantity: 1,
      size: defaultSize,
      color: defaultColor,
      name: product.name,
      price: displayPrice,
      image: product.images[0],
    })
    openCart()
  }

  return (
    <Link to={`/produto/${product.slug}`} className="block group bg-white">
      <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-swell-border flex items-center justify-center">
            <span className="text-swell-text-light text-xs">Sem imagem</span>
          </div>
        )}

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.tags.includes('novos') && (
            <span className="text-[10px] text-swell-alert font-medium uppercase tracking-wide">
              novo!
            </span>
          )}
          {product.tags.includes('ultimas_pecas') && (
            <span className="text-[10px] text-swell-alert font-medium italic">
              vai acabar!
            </span>
          )}
          {product.tags.includes('promocoes') && (
            <span className="text-[10px] bg-swell-alert text-white px-1.5 py-0.5 uppercase">
              Promoção
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-swell-accent hover:text-white transition-colors"
            onClick={handleAddToCart}
            aria-label="Adicionar à sacola"
          >
            <Tote size={18} weight="light" />
          </button>
          <button
            className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-swell-alert hover:text-white transition-colors"
            aria-label="Favoritar"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={18} weight="light" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-2 px-0.5 pb-4">
        <p className="text-xs uppercase tracking-wide font-normal text-swell-text-dark truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount && (
            <span className="text-xs text-swell-text-light line-through">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
          <span className={`text-xs ${hasDiscount ? 'text-swell-alert font-medium' : 'text-swell-text-dark'}`}>
            {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
    </Link>
  )
}
