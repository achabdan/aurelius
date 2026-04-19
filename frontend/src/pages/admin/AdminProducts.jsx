import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, X, Upload, ChevronDown, Star } from 'lucide-react'
import api from '../../utils/api'
import { CATEGORIES, formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const GENDERS = ['WOMEN', 'MEN', 'UNISEX']
const EMPTY_FORM = {
  name: '', nameEn: '', nameFr: '', nameEs: '',
  description: '', descriptionEn: '', descriptionFr: '', descriptionEs: '',
  price: '', stock: '', category: 'RINGS', gender: 'WOMEN',
  images: [], featured: false,
}

export default function AdminProducts() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null) // null = create, object = edit
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState('basic') // 'basic' | 'multilang'
  const fileRef = useRef()

  const fetchProducts = async (p = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/products?page=${p}&limit=12&sortBy=createdAt&sortOrder=desc`)
      setProducts(res.data.products)
      setTotalPages(res.data.pagination.totalPages)
    } catch (e) { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts(page) }, [page])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImageUrl('')
    setTab('basic')
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name || '', nameEn: p.nameEn || '', nameFr: p.nameFr || '', nameEs: p.nameEs || '',
      description: p.description || '', descriptionEn: p.descriptionEn || '',
      descriptionFr: p.descriptionFr || '', descriptionEs: p.descriptionEs || '',
      price: p.price || '', stock: p.stock || '', category: p.category || 'RINGS',
      gender: p.gender || 'WOMEN', images: p.images || [], featured: p.featured || false,
    })
    setImageUrl('')
    setTab('basic')
    setModalOpen(true)
  }

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setForm(f => ({ ...f, images: [...f.images, imageUrl.trim()] }))
      setImageUrl('')
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm(f => ({ ...f, images: [...f.images, res.data.url] }))
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category || !form.gender) {
      toast.error('Name, price, category and gender are required')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 }
      if (editing) {
        await api.put(`/products/${editing.id}`, payload)
        toast.success('Product updated!')
      } else {
        await api.post('/products', payload)
        toast.success('Product created!')
      }
      setModalOpen(false)
      fetchProducts(page)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts(page)
    } catch { toast.error('Delete failed') }
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-noir-900">{t('admin.products')}</h1>
          <p className="text-sm text-noir-500 font-sans mt-0.5">{products.length} items loaded</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus size={15} /> {t('admin.add_product')}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-noir-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-noir-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-noir-50 border-b border-noir-100">
              <tr>
                {['Image', 'Product', 'Category', 'Price', 'Stock', 'Gender', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest font-sans text-noir-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-noir-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-12 bg-cream-100 overflow-hidden">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-display text-sm text-noir-900">{p.name}</p>
                    {p.featured && <span className="text-[10px] text-gold-600 font-sans flex items-center gap-1"><Star size={9} fill="currentColor" /> Featured</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-sans text-noir-600">{t(`products.${p.category?.toLowerCase()}`)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans font-medium text-noir-900">{formatPrice(p.price)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-xs font-sans', p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-yellow-600' : 'text-green-600')}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-noir-500 font-sans">{t(`common.${p.gender?.toLowerCase()}`)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-noir-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-noir-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={clsx('w-8 h-8 text-xs border font-sans transition-colors',
                page === i + 1 ? 'bg-noir-900 text-white border-noir-900' : 'border-noir-200 text-noir-600 hover:border-noir-900')}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white w-full max-w-2xl my-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-noir-100">
              <h2 className="font-display text-lg text-noir-900">
                {editing ? t('admin.edit_product') : t('admin.add_product')}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} className="text-noir-500 hover:text-noir-900" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-noir-100">
              {['basic', 'multilang'].map(tab_ => (
                <button key={tab_} onClick={() => setTab(tab_)}
                  className={clsx('px-6 py-3 text-xs uppercase tracking-widest font-sans transition-colors',
                    tab === tab_ ? 'border-b-2 border-noir-900 text-noir-900' : 'text-noir-500 hover:text-noir-900')}>
                  {tab_ === 'basic' ? 'Basic Info' : t('admin.multilang')}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {tab === 'basic' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">{t('admin.product_name')} *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} className="input-field" required />
                    </div>
                    <div>
                      <label className="input-label">{t('admin.price')} *</label>
                      <input type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} className="input-field" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="input-label">{t('admin.category')} *</label>
                      <div className="relative">
                        <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field appearance-none pr-8">
                          {CATEGORIES.map(c => <option key={c} value={c}>{t(`products.${c.toLowerCase()}`)}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">{t('admin.gender')} *</label>
                      <div className="relative">
                        <select value={form.gender} onChange={e => set('gender', e.target.value)} className="input-field appearance-none pr-8">
                          {GENDERS.map(g => <option key={g} value={g}>{t(`common.${g.toLowerCase()}`)}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">{t('admin.stock')}</label>
                      <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} className="input-field" />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">{t('admin.description')}</label>
                    <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" />
                  </div>

                  {/* Featured */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                      className="w-4 h-4 accent-gold-500" />
                    <span className="text-sm font-sans text-noir-700">{t('admin.featured')}</span>
                  </label>

                  {/* Images */}
                  <div>
                    <label className="input-label">{t('admin.images')}</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 bg-cream-100">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                            <X size={9} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Upload file */}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <button type="button" onClick={() => fileRef.current.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 text-xs font-sans text-noir-600 border border-dashed border-noir-300 px-4 py-2.5 hover:border-noir-900 transition-colors mb-2 disabled:opacity-50">
                      <Upload size={13} /> {uploading ? 'Uploading…' : t('admin.upload_image')}
                    </button>

                    {/* URL input */}
                    <div className="flex gap-2">
                      <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                        placeholder={t('admin.image_url')} className="input-field text-xs py-2 flex-1" />
                      <button type="button" onClick={handleAddImageUrl} className="btn-outline px-3 py-2 text-xs">Add</button>
                    </div>
                  </div>
                </>
              )}

              {tab === 'multilang' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    {[['nameEn', t('admin.name_en')], ['nameFr', t('admin.name_fr')], ['nameEs', t('admin.name_es')]].map(([key, label]) => (
                      <div key={key}>
                        <label className="input-label">{label}</label>
                        <input value={form[key]} onChange={e => set(key, e.target.value)} className="input-field text-xs" />
                      </div>
                    ))}
                  </div>
                  {[['descriptionEn', t('admin.desc_en')], ['descriptionFr', t('admin.desc_fr')], ['descriptionEs', t('admin.desc_es')]].map(([key, label]) => (
                    <div key={key}>
                      <label className="input-label">{label}</label>
                      <textarea rows={3} value={form[key]} onChange={e => set(key, e.target.value)} className="input-field resize-none text-xs" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-noir-100">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">{t('admin.cancel')}</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? t('common.loading') : t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
