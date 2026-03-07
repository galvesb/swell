import { useState, useEffect, FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { productsApi } from '@/api/products'
import { categoriesApi, type Category } from '@/api/categories'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { Product } from '@/types/product'

const ALL_SIZES = ['XPP', 'PP', 'P', 'M', 'G', 'GG', 'XGG', 'U']
const ALL_TAGS = ['novos', 'mais_vendidos', 'ultimas_pecas', 'promocoes', 'principal'] as const

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id !== 'novo'
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    sale_price: '',
    stock: '',
    sizes: [] as string[],
    tags: [] as string[],
    images: [] as string[],
    is_active: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (isEditing && id) {
      productsApi.adminList(1, 100).then((res) => {
        const found = res.items.find((p) => p.id === id)
        if (found) {
          setProduct(found)
          setForm({
            name: found.name,
            description: found.description,
            category: found.category,
            price: String(found.price),
            sale_price: found.sale_price ? String(found.sale_price) : '',
            stock: String(found.stock),
            sizes: found.sizes,
            tags: found.tags,
            images: found.images,
            is_active: found.is_active,
          })
        }
      })
    }
  }, [id, isEditing])

  const toggleSize = (size: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }))

  const toggleTag = (tag: string) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        stock: Number(form.stock),
        sizes: form.sizes,
        tags: form.tags,
        images: form.images,
        is_active: form.is_active,
      }

      if (isEditing && id) {
        await productsApi.update(id, payload)
        navigate('/admin')
      } else {
        const created = await productsApi.create({ ...payload, colors: [] })
        navigate(`/admin/produtos/${created.id}`)
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Erro ao salvar produto.')
    } finally {
      setIsLoading(false)
    }
  }

  const productId = isEditing ? id! : product?.id ?? ''

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/admin" className="flex items-center gap-2 text-swell-text-light text-sm mb-6 hover:text-swell-accent transition-colors">
        <ArrowLeft size={16} /> Voltar ao painel
      </Link>

      <h1 className="font-serif text-3xl mb-8">
        {isEditing ? 'Editar Produto' : 'Novo Produto'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-xs uppercase tracking-wider mb-1.5">Nome *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs uppercase tracking-wider mb-1.5">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs uppercase tracking-wider mb-1.5">Categoria *</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            required
            className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent bg-white"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price + Sale price + Stock */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5">Preço *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
              className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5">Preço Sale</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.sale_price}
              onChange={(e) => setForm((f) => ({ ...f, sale_price: e.target.value }))}
              className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5">Estoque *</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              required
              className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-xs uppercase tracking-wider mb-2">Tamanhos</label>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`px-3 py-1.5 text-xs border transition-colors ${form.sizes.includes(s) ? 'bg-swell-accent text-white border-swell-accent' : 'border-swell-border hover:border-swell-accent'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs uppercase tracking-wider mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-xs border transition-colors ${form.tags.includes(tag) ? 'bg-swell-accent text-white border-swell-accent' : 'border-swell-border hover:border-swell-accent'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        {isEditing && productId && (
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2">Imagens</label>
            <ImageUpload
              productId={productId}
              currentImages={form.images}
              onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
            />
          </div>
        )}

        {/* Active */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            className="w-4 h-4 accent-swell-accent"
          />
          <label htmlFor="is_active" className="text-sm">Produto ativo (visível na loja)</label>
        </div>

        {error && <p className="text-swell-alert text-sm">{error}</p>}

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-swell-accent hover:bg-swell-accent-hover disabled:opacity-60 text-white px-8 py-3 uppercase text-sm tracking-wider transition-colors"
          >
            {isLoading ? 'Salvando...' : 'Salvar Produto'}
          </button>
          <Link
            to="/admin"
            className="border border-swell-border px-8 py-3 uppercase text-sm tracking-wider hover:border-swell-accent transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
