import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import useCartStore from '../../context/cartStore'
import { getProductImage, getLocalizedName, formatPrice } from '../../utils/helpers'
import clsx from 'clsx'

export default function CartDrawer({ open, onClose }) {
  const { t, i18n } = useTranslation()
  const items = useCartStore(s => s.items)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const clearCart = useCartStore(s => s.clearCart)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 cart-overlay',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={clsx(
          'fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-noir-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-noir-700" />
            <h2 className="font-display text-lg text-noir-900">{t('cart.title')}</h2>
            {items.length > 0 && (
              <span className="text-xs text-noir-500 font-sans">
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 text-noir-500 hover:text-noir-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={48} className="text-noir-200" />
              <p className="font-display text-lg text-noir-400">{t('cart.empty')}</p>
              <p className="text-sm text-noir-400 font-sans">{t('cart.empty_desc')}</p>
              <button onClick={onClose} className="btn-outline mt-2">
                {t('cart.continue_shopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-24 bg-cream-100 flex-shrink-0 overflow-hidden">
                    <img
                      src={getProductImage(item)}
                      alt={getLocalizedName(item, i18n.language)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm text-noir-900 leading-snug mb-1">
                      {getLocalizedName(item, i18n.language)}
                    </h4>
                    <p className="text-xs text-gold-600 font-sans font-medium mb-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-noir-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-noir-600 hover:bg-noir-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-sans">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 flex items-center justify-center text-noir-600 hover:bg-noir-50 disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-noir-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-noir-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-sans text-noir-600">{t('cart.subtotal')}</span>
              <span className="font-display text-xl text-noir-900">{formatPrice(subtotal)}</span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center"
            >
              {t('cart.checkout')}
            </Link>

            <button
              onClick={() => { clearCart(); onClose() }}
              className="w-full text-center text-xs text-noir-400 hover:text-red-500 font-sans py-1 transition-colors"
            >
              {t('cart.clear_cart')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
