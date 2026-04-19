import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Truck, ShieldCheck, AlertCircle } from 'lucide-react'
import useCartStore from '../context/cartStore'
import api from '../utils/api'
import { getLocalizedName, formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const items = useCartStore(s => s.items)
  const clearCart = useCartStore(s => s.clearCart)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  const [form, setForm] = useState({ customerName: '', phone: '', address: '', city: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="font-display text-2xl text-noir-400 mb-4">{t('cart.empty')}</p>
        <Link to="/products" className="btn-primary">{t('cart.continue_shopping')}</Link>
      </div>
    </div>
  )

  const validate = () => {
    const e = {}
    if (!form.customerName.trim()) e.customerName = t('checkout.name_required')
    if (!form.phone.trim()) e.phone = t('checkout.phone_required')
    if (!form.address.trim()) e.address = t('checkout.address_required')
    if (!form.city.trim()) e.city = t('checkout.city_required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      }
      const res = await api.post('/orders', payload)
      clearCart()
      navigate(`/confirmation/${res.data.order.id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const Field = ({ name, label, placeholder, type = 'text', rows }) => (
    <div>
      <label className="input-label">{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          value={form[name]}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          placeholder={placeholder}
          className="input-field resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[name]}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          placeholder={placeholder}
          className={`input-field ${errors[name] ? 'border-red-400' : ''}`}
        />
      )}
      {errors[name] && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-sans">
          <AlertCircle size={11} /> {errors[name]}
        </p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-cream-100 border-b border-cream-200 py-10">
        <div className="container-site text-center">
          <p className="section-subtitle">{t('checkout.subtitle')}</p>
          <h1 className="section-title">{t('checkout.title')}</h1>
        </div>
      </div>

      <div className="container-site py-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              {/* COD notice */}
              <div className="flex items-start gap-3 bg-gold-50 border border-gold-200 p-4 mb-8">
                <Truck size={18} className="text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-sans font-medium text-gold-800">{t('checkout.subtitle')}</p>
                  <p className="text-xs text-gold-700 font-sans mt-0.5">{t('checkout.cod_info')}</p>
                </div>
              </div>

              <h2 className="font-display text-xl text-noir-900 mb-6">{t('checkout.your_info')}</h2>

              <div className="space-y-5">
                <Field name="customerName" label={t('checkout.full_name')} placeholder="John Doe" />
                <Field name="phone" label={t('checkout.phone')} placeholder="+1 555 000 0000" type="tel" />
                <Field name="address" label={t('checkout.address')} placeholder="123 Main Street, Apt 4" />
                <Field name="city" label={t('checkout.city')} placeholder="New York" />
                <Field name="notes" label={t('checkout.notes')} placeholder={t('checkout.notes_placeholder')} rows={3} />
              </div>

              {/* Security badges */}
              <div className="flex items-center gap-2 mt-6 text-xs text-noir-500 font-sans">
                <ShieldCheck size={14} className="text-green-500" />
                <span>{t('product.secure')} — Your information is safe with us.</span>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-cream-50 border border-cream-200 p-6 sticky top-24">
                <h2 className="font-display text-xl text-noir-900 mb-6">{t('checkout.order_summary')}</h2>

                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-16 bg-cream-200 flex-shrink-0 overflow-hidden">
                        <img src={item.images?.[0] || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-display text-noir-900 leading-snug">
                          {getLocalizedName(item, i18n.language)}
                        </p>
                        <p className="text-xs text-noir-500 font-sans mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-xs font-sans font-medium text-noir-900 mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cream-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-sm text-noir-600">{t('cart.total')}</span>
                    <span className="font-display text-2xl text-noir-900">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-[10px] text-gold-600 font-sans mt-1 uppercase tracking-wider">
                    {t('confirmation.cod_note')}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-4"
                >
                  {submitting ? t('checkout.placing') : t('checkout.place_order')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
