import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import useCartStore from '../context/cartStore'
import { getProductImage, getLocalizedName, formatPrice } from '../utils/helpers'

export default function CartPage() {
  const { t, i18n } = useTranslation()
  const items = useCartStore(s => s.items)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const clearCart = useCartStore(s => s.clearCart)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  if (items.length === 0) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center py-20">
        <ShoppingBag size={64} className="text-noir-200 mx-auto mb-6" />
        <h1 className="font-display text-3xl text-noir-400 mb-3">{t('cart.empty')}</h1>
        <p className="text-noir-500 font-sans text-sm mb-8">{t('cart.empty_desc')}</p>
        <Link to="/products" className="btn-primary">{t('cart.continue_shopping')}</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-cream-100 border-b border-cream-200 py-10">
        <div className="container-site text-center">
          <h1 className="section-title">{t('cart.title')}</h1>
          <p className="text-sm text-noir-500 font-sans mt-1">
            {items.reduce((s, i) => s + i.quantity, 0)} {items.length === 1 ? t('cart.item') : t('cart.items')}
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0 divide-y divide-noir-100">
            {items.map(item => (
              <div key={item.id} className="flex gap-5 py-6">
                <Link to={`/products/${item.id}`} className="w-24 h-28 bg-cream-100 flex-shrink-0 overflow-hidden">
                  <img src={getProductImage(item)} alt={getLocalizedName(item, i18n.language)} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gold-500 font-sans mb-1">
                        {t(`products.${item.category?.toLowerCase()}`)}
                      </p>
                      <Link to={`/products/${item.id}`}>
                        <h3 className="font-display text-lg text-noir-900 hover:text-gold-600 transition-colors">
                          {getLocalizedName(item, i18n.language)}
                        </h3>
                      </Link>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-noir-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-noir-200">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-noir-600 hover:bg-noir-50">
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center font-sans text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-9 h-9 flex items-center justify-center text-noir-600 hover:bg-noir-50 disabled:opacity-30">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-sans font-medium text-noir-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <button onClick={clearCart} className="text-xs text-noir-400 hover:text-red-500 transition-colors font-sans flex items-center gap-1.5">
                <Trash2 size={12} /> {t('cart.clear_cart')}
              </button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-cream-50 border border-cream-200 p-6 sticky top-24">
              <h2 className="font-display text-xl text-noir-900 mb-6">{t('checkout.order_summary')}</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-cream-200">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm font-sans text-noir-600">
                    <span className="truncate mr-4">{getLocalizedName(item, i18n.language)} × {item.quantity}</span>
                    <span className="flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-sans text-sm text-noir-600">{t('cart.total')}</span>
                <span className="font-display text-2xl text-noir-900">{formatPrice(subtotal)}</span>
              </div>
              <Link to="/checkout" className="btn-primary w-full text-center flex items-center justify-center gap-2">
                {t('cart.checkout')} <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="block text-center text-xs text-noir-500 hover:text-noir-900 font-sans mt-4 transition-colors">
                {t('cart.continue_shopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
