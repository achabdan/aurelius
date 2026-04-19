import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Eye } from 'lucide-react'
import useCartStore from '../../context/cartStore'
import { getProductImage, getLocalizedName, formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation()
  const addItem = useCartStore(s => s.addItem)
  const [adding, setAdding] = useState(false)
  const [imgError, setImgError] = useState(false)

  const name = getLocalizedName(product, i18n.language)
  const imgSrc = imgError
    ? 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600'
    : getProductImage(product)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    setAdding(true)
    addItem(product, 1)
    toast.success(`${name} ${t('products.added')}`)
    setTimeout(() => setAdding(false), 1000)
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-cream-100 aspect-[3/4]">
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="badge-gold text-[10px]">Featured</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-noir-800/80 text-white text-[10px]">
              {t('products.out_of_stock')}
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-noir-900/0 group-hover:bg-noir-900/10 transition-colors duration-300" />

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className={clsx(
                'flex-1 py-3 text-xs font-sans font-medium uppercase tracking-widest transition-colors flex items-center justify-center gap-2',
                product.stock === 0
                  ? 'bg-noir-300 text-noir-500 cursor-not-allowed'
                  : 'bg-noir-900 text-white hover:bg-gold-500'
              )}
            >
              <ShoppingBag size={13} />
              {adding ? t('products.added') : t('products.add_to_cart')}
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <p className="text-[10px] uppercase tracking-[0.15em] text-gold-500 font-sans mb-1">
          {t(`products.${product.category?.toLowerCase()}`) || product.category}
        </p>
        <h3 className="font-display text-base text-noir-900 leading-snug mb-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm font-medium text-noir-900">
            {formatPrice(product.price)}
          </span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[10px] text-red-500 font-sans">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
