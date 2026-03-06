import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productsApi } from '@/api/products'
import type { Product, ProductListResponse, SortBy } from '@/types/product'

export function useProducts(category?: string) {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<ProductListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    const filters = {
      ...(category && { category }),
      ...(searchParams.get('min_price') && { min_price: Number(searchParams.get('min_price')) }),
      ...(searchParams.get('max_price') && { max_price: Number(searchParams.get('max_price')) }),
      ...(searchParams.getAll('sizes').length && { sizes: searchParams.getAll('sizes') }),
      ...(searchParams.getAll('colors').length && { colors: searchParams.getAll('colors') }),
      ...(searchParams.getAll('tags').length && { tags: searchParams.getAll('tags') as Product['tags'] }),
      sort_by: (searchParams.get('sort_by') as SortBy) || 'relevance',
      page: Number(searchParams.get('page') || 1),
      page_size: 20,
    }

    productsApi
      .list(filters)
      .then((res) => { if (!controller.signal.aborted) setData(res) })
      .catch((err) => { if (!controller.signal.aborted) setError(err.message) })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false) })

    return () => controller.abort()
  }, [searchParams, category])

  return { data, isLoading, error }
}
