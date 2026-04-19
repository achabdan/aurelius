import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Package, Shield, Truck, ArrowLeft, Plus, Minus } from 'lucide-react'
import api from '../utils/api'
import useCartStore from '../context/cartStore'
import { getLocalizedName, getLocalizedDesc, formatPrice } from '../utils/helpers'
import ProductCard from '../components/product/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const addItem = useCartStore(s => s.addItem)

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setLoading(true)
    setQty(1)
    setActiveImg(0)
    api.get(`/products/${id}`)
      .then(async res => {
        setProduct(res.data)
        // Fetch related
        const rel = await api.get(`/products?category=${res.data.category}&limit=4`)
        setRelated(rel.data.products.filter(p => p.id !== id))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-noir-100 animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-noir-100 w-1/4 animate-pulse" />
            <div className="h-8 bg-noir-100 w-3/4 animate-pulse" />
            <div className="h-6 bg-noir-100 w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div className="container-site py-20 text-center">
      <p className="font-display text-2xl text-noir-400">Product not found</p>
      <Link to="/products" className="btn-outline mt-6">Back to Products</Link>
    </div>
  )

  const name = getLocalizedName(product, i18n.language)
  const desc = getLocalizedDesc(product, i18n.language)
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800']

  const handleAdd = () => {
    addItem(product, qty)
    toast.success(`${name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-site py-8 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-noir-500 font-sans mb-8">
          <Link to="/" className="hover:text-noir-900 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-noir-900 transition-colors">
            {t('nav.all')}
          </Link>
          <span>/</span>
          <span className="text-noir-900">{name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden bg-cream-100">
              <img
                src={images[activeImg]}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-noir-900' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="section-subtitle mb-2">
              {t(`products.${product.category?.toLowerCase()}`)} ·{' '}
              {t(`common.${product.gender?.toLowerCase()}`)}
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-noir-900 leading-tight mb-4">
              {name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-3xl text-noir-900">{formatPrice(product.price)}</span>
              {product.stock > 0 ? (
                <span className="text-xs text-green-600 font-sans bg-green-50 px-2.5 py-1 border border-green-200">
                  {t('product.in_stock', { count: product.stock })}
                </span>
              ) : (
                <span className="text-xs text-red-500 font-sans bg-red-50 px-2.5 py-1 border border-red-200">
                  {t('product.out_of_stock')}
                </span>
              )}
            </div>

            <div className="divider-gold mb-6" />

            {/* Description */}
            <p className="text-noir-600 font-sans text-sm leading-relaxed mb-8">{desc}</p>

            {/* Quantity + Add */}
            {product.stock > 0 && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <label className="input-label mb-0">{t('product.quantity')}</label>
                  <div className="flex items-center border border-noir-200">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-noir-700 hover:bg-noir-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-sans text-sm">{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-noir-700 hover:bg-noir-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  className="btn-primary w-full py-4 text-sm"
                >
                  <ShoppingBag size={16} />
                  {t('product.add_to_cart')}
                </button>

                <Link to="/checkout" onClick={handleAdd} className="btn-gold w-full py-4 text-sm text-center block">
                  {t('product.buy_now')}
                </Link>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-noir-100">
              {[
                { icon: Truck, label: t('product.cod_badge') },
                { icon: Package, label: t('product.free_returns') },
                { icon: Shield, label: t('product.secure') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <Icon size={20} className="text-gold-500" />
                  <span className="text-[10px] text-noir-500 font-sans leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="mb-8">
              <p className="section-subtitle">{t('product.related')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {related.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
