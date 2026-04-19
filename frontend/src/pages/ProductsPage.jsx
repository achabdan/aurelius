import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/product/ProductCard'
import ProductSkeleton from '../components/product/ProductSkeleton'
import { CATEGORIES } from '../utils/helpers'
import clsx from 'clsx'

const SORT_OPTIONS = [
  { value: 'createdAt:desc', labelKey: 'products.sort_newest' },
  { value: 'price:asc', labelKey: 'products.sort_price_asc' },
  { value: 'price:desc', labelKey: 'products.sort_price_desc' },
]

export default function ProductsPage({ gender: genderProp }) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filter state from URL params
  const category   = searchParams.get('category') || ''
  const minPrice   = searchParams.get('minPrice') || ''
  const maxPrice   = searchParams.get('maxPrice') || ''
  const sort       = searchParams.get('sort') || 'createdAt:desc'
  const search     = searchParams.get('search') || ''
  const page       = parseInt(searchParams.get('page') || '1')
  const gender     = genderProp || searchParams.get('gender') || ''

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const [sortBy, sortOrder] = sort.split(':')
      const params = new URLSearchParams({
        page, limit: 12,
        ...(category && { category }),
        ...(gender && { gender }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(search && { search }),
        sortBy, sortOrder,
      })
      const res = await api.get(`/products?${params}`)
      setProducts(res.data.products)
      setPagination(res.data.pagination)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [category, gender, minPrice, maxPrice, sort, search, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value); else p.delete(key)
    p.delete('page') // reset page on filter change
    setSearchParams(p)
  }

  const clearFilters = () => {
    setSearchParams(genderProp ? {} : {})
  }

  const hasFilters = category || minPrice || maxPrice || search

  const title = genderProp === 'WOMEN'
    ? t('products.women_title')
    : genderProp === 'MEN'
    ? t('products.men_title')
    : t('products.title')

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-cream-100 border-b border-cream-200 py-12">
        <div className="container-site text-center">
          <p className="section-subtitle">{t('products.filter_by')}</p>
          <h1 className="section-title">{title}</h1>
          {!loading && (
            <p className="text-sm text-noir-500 font-sans mt-2">
              {t('products.results', { count: pagination.total })}
            </p>
          )}
        </div>
      </div>

      <div className="container-site py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={clsx(
              'flex items-center gap-2 text-sm font-sans px-4 py-2.5 border transition-colors',
              filtersOpen ? 'border-noir-900 bg-noir-900 text-white' : 'border-noir-200 text-noir-700 hover:border-noir-900'
            )}
          >
            <SlidersHorizontal size={15} />
            {t('common.filter')}
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {/* Search box */}
            <input
              type="text"
              defaultValue={search}
              placeholder={t('products.search_placeholder')}
              onKeyDown={e => e.key === 'Enter' && setParam('search', e.target.value)}
              className="input-field w-48 py-2 text-xs"
            />

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
                className="input-field py-2 pr-8 text-xs appearance-none cursor-pointer w-44"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="mb-8 p-6 border border-noir-100 bg-cream-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="input-label">{t('products.category')}</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={e => setParam('category', e.target.value)}
                    className="input-field py-2 pr-8 text-xs appearance-none cursor-pointer"
                  >
                    <option value="">{t('products.all_categories')}</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{t(`products.${c.toLowerCase()}`)}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-400 pointer-events-none" />
                </div>
              </div>

              {/* Gender (only when not prop-locked) */}
              {!genderProp && (
                <div>
                  <label className="input-label">{t('products.gender')}</label>
                  <div className="relative">
                    <select
                      value={gender}
                      onChange={e => setParam('gender', e.target.value)}
                      className="input-field py-2 pr-8 text-xs appearance-none cursor-pointer"
                    >
                      <option value="">{t('products.all')}</option>
                      <option value="WOMEN">{t('common.women')}</option>
                      <option value="MEN">{t('common.men')}</option>
                      <option value="UNISEX">{t('common.unisex')}</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Price range */}
              <div>
                <label className="input-label">{t('products.price_range')}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    defaultValue={minPrice}
                    onBlur={e => setParam('minPrice', e.target.value)}
                    className="input-field py-2 text-xs w-full"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={maxPrice}
                    onBlur={e => setParam('maxPrice', e.target.value)}
                    className="input-field py-2 text-xs w-full"
                  />
                </div>
              </div>

              {/* Clear */}
              <div className="flex items-end">
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 font-sans">
                    <X size={13} /> {t('products.clear_filters')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <ProductSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-noir-400 mb-4">{t('products.no_products')}</p>
            <button onClick={clearFilters} className="btn-outline">{t('products.clear_filters')}</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.set('page', p)
                  setSearchParams(params)
                }}
                className={clsx(
                  'w-9 h-9 text-sm font-sans border transition-colors',
                  p === pagination.page
                    ? 'bg-noir-900 text-white border-noir-900'
                    : 'border-noir-200 text-noir-600 hover:border-noir-900'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
