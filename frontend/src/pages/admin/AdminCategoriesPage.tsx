import { CategoriesTab } from '@/components/admin/CategoriesTab'

export function AdminCategoriesPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl mb-8">Categorias</h1>
      <CategoriesTab />
    </div>
  )
}
