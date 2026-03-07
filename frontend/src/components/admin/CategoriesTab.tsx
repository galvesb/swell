import { useState, useEffect, FormEvent } from 'react'
import { Pencil, Trash, Plus, X, Check } from '@phosphor-icons/react'
import { categoriesApi, type Category } from '@/api/categories'

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // New category form
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Editing
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const load = () => {
    setIsLoading(true)
    categoriesApi
      .adminList()
      .then(setCategories)
      .catch(() => setError('Erro ao carregar categorias'))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setIsSaving(true)
    setError('')
    try {
      await categoriesApi.create({ name: newName.trim(), description: newDesc.trim() })
      setNewName('')
      setNewDesc('')
      setShowNew(false)
      load()
    } catch {
      setError('Erro ao criar categoria')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDesc(cat.description)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditDesc('')
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    setIsSaving(true)
    setError('')
    try {
      await categoriesApi.update(id, { name: editName.trim(), description: editDesc.trim() })
      cancelEdit()
      load()
    } catch {
      setError('Erro ao atualizar categoria')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Excluir a categoria "${name}"?`)) return
    setError('')
    try {
      await categoriesApi.delete(id)
      load()
    } catch {
      setError('Erro ao excluir categoria')
    }
  }

  if (isLoading) {
    return <p className="text-sm text-swell-text-light">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-swell-alert text-sm">{error}</p>}

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat) =>
          editingId === cat.id ? (
            <div key={cat.id} className="flex items-center gap-2 border border-swell-accent p-3">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-swell-border px-3 py-2 text-sm focus:outline-none focus:border-swell-accent"
                  placeholder="Nome"
                />
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full border border-swell-border px-3 py-2 text-sm focus:outline-none focus:border-swell-accent"
                  placeholder="Descricao (opcional)"
                />
              </div>
              <button
                onClick={() => handleUpdate(cat.id)}
                disabled={isSaving}
                className="text-green-600 hover:text-green-700 p-1"
                aria-label="Salvar"
              >
                <Check size={18} />
              </button>
              <button
                onClick={cancelEdit}
                className="text-swell-text-light hover:text-swell-text-dark p-1"
                aria-label="Cancelar"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              key={cat.id}
              className="flex items-center justify-between border border-swell-border p-3"
            >
              <div>
                <span className="text-sm font-medium">{cat.name}</span>
                {cat.description && (
                  <span className="text-xs text-swell-text-light ml-2">— {cat.description}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(cat)}
                  className="text-swell-text-light hover:text-swell-accent p-1"
                  aria-label="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-swell-text-light hover:text-swell-alert p-1"
                  aria-label="Excluir"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ),
        )}
        {categories.length === 0 && (
          <p className="text-sm text-swell-text-light">Nenhuma categoria cadastrada.</p>
        )}
      </div>

      {/* New form */}
      {showNew ? (
        <form onSubmit={handleCreate} className="space-y-3 border border-dashed border-swell-border p-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome da categoria"
            required
            className="w-full border border-swell-border px-3 py-2 text-sm focus:outline-none focus:border-swell-accent"
            autoFocus
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Descricao (opcional)"
            className="w-full border border-swell-border px-3 py-2 text-sm focus:outline-none focus:border-swell-accent"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-swell-accent text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-swell-accent-hover transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={() => { setShowNew(false); setNewName(''); setNewDesc('') }}
              className="border border-swell-border px-4 py-2 text-xs uppercase tracking-wider hover:border-swell-accent transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 border border-dashed border-swell-border px-4 py-3 text-sm text-swell-text-light hover:border-swell-accent hover:text-swell-accent transition-colors w-full justify-center"
        >
          <Plus size={16} /> Nova Categoria
        </button>
      )}
    </div>
  )
}
