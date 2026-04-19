import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Package, MapPin, Phone, Truck } from 'lucide-react'
import api from '../utils/api'
import { formatPrice } from '../utils/helpers'

export default function ConfirmationPage() {
  const { orderId } = useParams()
  const { t } = useTranslation()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    // Try to fetch order details (will fail without admin auth on GET /orders/:id in production)
    // For confirmation we show a success message with the order ID
    setOrder({ id: orderId })
  }, [orderId])

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-lg w-full">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={42} className="text-green-500" />
          </div>
          <p className="section-subtitle text-green-600 mb-2">{t('confirmation.subtitle')}</p>
          <h1 className="font-display text-4xl text-noir-900 mb-4">{t('confirmation.title')}</h1>
          <p className="text-noir-600 font-sans text-sm leading-relaxed max-w-sm mx-auto">
            {t('confirmation.desc')}
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white border border-noir-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-noir-100">
            <span className="text-xs uppercase tracking-widest font-sans text-noir-500">
              {t('confirmation.order_number')}
            </span>
            <span className="font-mono text-sm text-noir-900 font-medium">
              {orderId?.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { icon: Truck, text: 'Cash on Delivery — No prepayment required' },
              { icon: Package, text: 'Your order is being processed' },
              { icon: Phone, text: 'We will call to confirm your delivery' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm font-sans text-noir-600">
                <Icon size={16} className="text-gold-500 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-noir-100">
            <p className="text-[10px] uppercase tracking-wider text-gold-600 font-sans font-medium">
              {t('confirmation.cod_note')}
            </p>
          </div>
        </div>

        <Link to="/products" className="btn-primary w-full text-center block">
          {t('confirmation.continue')}
        </Link>
      </div>
    </div>
  )
}
