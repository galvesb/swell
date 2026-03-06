import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PencilSimple, Trash, Plus } from '@phosphor-icons/react'
import { productsApi } from '@/api/products'
import type { Product, ProductListResponse } from '@/types/product'

export function AdminDashboard() {
  const [data, setData] = useState<ProductListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const load = async (p: number) => {
    setIsLoading(true)
    try {
      const res = await productsApi.adminList(p, 20)
      setData(res)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = async (product: Product) => {
    if (!confirm(`Excluir "${product.name}"?`)) return
    await productsApi.delete(product.id)
    load(page)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Painel Admin</h1>
        <Link
          to="/admin/produtos/novo"
          className="flex items-center gap-2 bg-swell-accent text-white px-5 py-2.5 text-sm uppercase tracking-wider hover:bg-swell-accent-hover transition-colors"
        >
          <Plus size={16} /> Novo Produto
        </Link>
      </div>

      {isLoading ? (
        <p className="text-swell-text-light">Carregando...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-swell-border text-left text-xs uppercase tracking-wider text-swell-text-light">
                  <th className="pb-3 pr-4">Imagem</th>
                  <th className="pb-3 pr-4">Nome</th>
                  <th className="pb-3 pr-4">Categoria</th>
                  <th className="pb-3 pr-4">Preço</th>
                  <th className="pb-3 pr-4">Estoque</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((p) => (
                  <tr key={p.id} className="border-b border-swell-border hover:bg-swell-bg transition-colors">
                    <td className="py-3 pr-4">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-12 h-16 object-cover" />
                      ) : (
                        <div className="w-12 h-16 bg-swell-border" />
                      )}
                    </td>
                    <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{p.name}</td>
                    <td className="py-3 pr-4 text-swell-text-light capitalize">{p.category}</td>
                    <td className="py-3 pr-4">
                      {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={p.stock <= 5 ? 'text-swell-alert' : ''}>{p.stock}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/produtos/${p.id}`)}
                          className="p-1.5 hover:text-swell-accent transition-colors"
                          aria-label="Editar"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-1.5 hover:text-swell-alert transition-colors"
                          aria-label="Excluir"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div className="flex gap-2 mt-6">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 text-sm border ${p === page ? 'bg-swell-accent text-white border-swell-accent' : 'border-swell-border hover:border-swell-accent'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
