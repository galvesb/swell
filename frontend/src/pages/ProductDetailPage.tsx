import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Tote, Heart } from '@phosphor-icons/react'
import { productsApi } from '@/api/products'
import { ProductCarousel } from '@/components/products/ProductCarousel'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    productsApi
      .getBySlug(slug)
      .then((p) => {
        setProduct(p)
        if (p.sizes.length > 0) setSelectedSize(p.sizes[0])
        if (p.colors.length > 0) setSelectedColor(p.colors[0].name)
      })
      .finally(() => setIsLoading(false))
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      product_id: product.id,
      quantity,
      size: selectedSize || 'U',
      color: selectedColor || 'Único',
      name: product.name,
      price: product.sale_price ?? product.price,
      image: product.images[0],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="animate-pulse bg-swell-border" style={{ aspectRatio: '2/3' }} />
          <div className="space-y-4">
            <div className="h-6 bg-swell-border animate-pulse w-3/4" />
            <div className="h-4 bg-swell-border animate-pulse w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-swell-text-light">Produto não encontrado.</p>
        <Link to="/" className="text-swell-accent hover:underline mt-4 inline-block">
          Voltar ao início
        </Link>
      </div>
    )
  }

  const displayPrice = product.sale_price ?? product.price
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price

  return (
    <div>
      {/* Breadcrumb */}
      <div className="px-6 md:px-10 pt-6 text-[10px] uppercase tracking-wider text-swell-text-light">
        <Link to="/">INÍCIO</Link> &nbsp;&lt;&nbsp; <Link to={`/categoria/${product.category}`}>{product.category.toUpperCase()}</Link> &nbsp;&lt;&nbsp; {product.name.toUpperCase()}
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 grid md:grid-cols-2 gap-10">
        {/* Carousel */}
        <ProductCarousel images={product.images} alt={product.name} />

        {/* Info */}
        <div className="flex flex-col">
          {/* Tags */}
          <div className="flex gap-2 mb-3">
            {product.tags.includes('new_in') && (
              <span className="text-swell-alert text-xs italic">novo!</span>
            )}
            {product.tags.includes('last_pieces') && (
              <span className="text-swell-alert text-xs italic">vai acabar!</span>
            )}
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-normal mb-2">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            {hasDiscount && (
              <span className="text-swell-text-light line-through text-sm">
                {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            )}
            <span className={`text-xl font-medium ${hasDiscount ? 'text-swell-alert' : ''}`}>
              {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider mb-2">
                Cor: <span className="normal-case font-normal">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === c.name ? 'border-swell-accent scale-110' : 'border-transparent hover:border-swell-text-light'}`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider mb-2">Tamanho</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-xs border transition-colors ${selectedSize === s ? 'bg-swell-accent text-white border-swell-accent' : 'border-swell-border hover:border-swell-accent'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider mb-2">Quantidade</p>
            <div className="inline-flex border border-swell-border">
              <button
                className="px-4 py-2 text-sm"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="px-4 py-2 text-sm border-x border-swell-border">{quantity}</span>
              <button
                className="px-4 py-2 text-sm"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>
            <p className="text-xs text-swell-text-light mt-1">{product.stock} em estoque</p>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-swell-accent hover:bg-swell-accent-hover disabled:opacity-50 text-white py-4 uppercase text-sm tracking-wider transition-colors"
            >
              <Tote size={18} />
              {product.stock === 0 ? 'Esgotado' : added ? 'Adicionado ✓' : 'Adicionar à Sacola'}
            </button>
            <button className="border border-swell-border px-4 hover:border-swell-alert hover:text-swell-alert transition-colors" aria-label="Favoritar">
              <Heart size={20} weight="light" />
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-xs uppercase tracking-wider mb-2">Descrição</p>
              <p className="text-sm text-swell-text-light font-light leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
