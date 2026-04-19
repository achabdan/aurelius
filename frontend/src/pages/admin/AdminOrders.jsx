import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, ChevronDown, X } from 'lucide-react'
import api from '../../utils/api'
import { formatPrice, ORDER_STATUSES, STATUS_COLORS } from '../../utils/helpers'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function AdminOrders() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = async (p = 1, status = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 15 })
      if (status) params.set('status', status)
      const res = await api.get(`/orders?${params}`)
      setOrders(res.data.orders)
      setTotalPages(res.data.pagination.totalPages)
      setTotal(res.data.pagination.total)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders(page, statusFilter) }, [page, statusFilter])

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      toast.success('Status updated')
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      if (selected?.id === orderId) setSelected(prev => ({ ...prev, status: newStatus }))
    } catch { toast.error('Update failed') }
    finally { setUpdatingId(null) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-noir-900">{t('admin.orders')}</h1>
          <p className="text-sm text-noir-500 font-sans mt-0.5">{total} total orders</p>
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="input-field py-2 pr-8 text-xs appearance-none w-40"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>{t(`admin.${s.toLowerCase()}`)}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-14 bg-noir-100 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-xl text-noir-400">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border border-noir-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-noir-50 border-b border-noir-100">
              <tr>
                {[t('admin.order_id'), t('admin.customer'), 'Phone', t('admin.date'), t('admin.total'), t('admin.status'), t('admin.update_status'), ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest font-sans text-noir-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-noir-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-noir-600">{order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-noir-900 font-medium">{order.customerName}</p>
                    <p className="text-xs text-noir-500">{order.city}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-sans text-noir-600">{order.phone}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-sans text-noir-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans font-medium text-noir-900">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-[10px] px-2 py-1 font-medium font-sans', STATUS_COLORS[order.status])}>
                      {t(`admin.${order.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusUpdate(order.id, e.target.value)}
                        className="text-xs border border-noir-200 px-2 py-1.5 appearance-none pr-6 bg-white text-noir-700 focus:outline-none focus:border-noir-900 cursor-pointer disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{t(`admin.${s.toLowerCase()}`)}</option>
                        ))}
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-noir-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(order)}
                      className="p-1.5 text-noir-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
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

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-noir-100 sticky top-0 bg-white">
              <h2 className="font-display text-lg text-noir-900">Order Details</h2>
              <button onClick={() => setSelected(null)}><X size={20} className="text-noir-500" /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer info */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-sans text-noir-500 mb-3">Customer</h3>
                <div className="bg-cream-50 p-4 space-y-2">
                  {[
                    ['Name', selected.customerName],
                    ['Phone', selected.phone],
                    ['Address', selected.address],
                    ['City', selected.city],
                    ...(selected.notes ? [['Notes', selected.notes]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3 text-sm font-sans">
                      <span className="text-noir-500 w-16 flex-shrink-0">{label}:</span>
                      <span className="text-noir-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-sans text-noir-500 mb-3">Items</h3>
                <div className="space-y-2">
                  {selected.items?.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm font-sans py-2 border-b border-noir-50">
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0] && (
                          <img src={item.product.images[0]} alt="" className="w-10 h-12 object-cover bg-cream-100" />
                        )}
                        <div>
                          <p className="font-medium text-noir-900">{item.product?.name}</p>
                          <p className="text-xs text-noir-500">× {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-sans text-noir-600">Total</span>
                <span className="font-display text-2xl text-noir-900">{formatPrice(selected.total)}</span>
              </div>

              {/* Status update */}
              <div>
                <label className="input-label">Update Status</label>
                <div className="relative">
                  <select
                    value={selected.status}
                    onChange={e => handleStatusUpdate(selected.id, e.target.value)}
                    className="input-field appearance-none pr-8"
                  >
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s}>{t(`admin.${s.toLowerCase()}`)}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
