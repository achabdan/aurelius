import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Package, TrendingUp, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import api from '../../utils/api'
import { formatPrice, STATUS_COLORS } from '../../utils/helpers'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/analytics')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats || {}
  const recentOrders = data?.recentOrders || []

  const statCards = [
    { label: t('admin.total_orders'), value: stats.totalOrders ?? '—', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: t('admin.pending_orders'), value: stats.pendingOrders ?? '—', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: t('admin.delivered_orders'), value: stats.deliveredOrders ?? '—', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: t('admin.total_revenue'), value: stats.totalRevenue != null ? formatPrice(stats.totalRevenue) : '—', icon: TrendingUp, color: 'text-gold-500', bg: 'bg-gold-50' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-noir-900">{t('admin.dashboard')}</h1>
        <p className="text-sm text-noir-500 font-sans mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-noir-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-noir-500 font-sans mb-2">{label}</p>
                <p className="font-display text-2xl text-noir-900">{loading ? '—' : value}</p>
              </div>
              <div className={`w-10 h-10 ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order status breakdown */}
          <div className="bg-white border border-noir-100 p-6">
            <h2 className="font-display text-lg text-noir-900 mb-5">Orders by Status</h2>
            <div className="space-y-3">
              {[
                { label: t('admin.pending'), value: stats.pendingOrders, color: 'bg-yellow-400' },
                { label: t('admin.confirmed'), value: stats.confirmedOrders, color: 'bg-blue-400' },
                { label: t('admin.shipped'), value: stats.shippedOrders, color: 'bg-purple-400' },
                { label: t('admin.delivered'), value: stats.deliveredOrders, color: 'bg-green-400' },
                { label: t('admin.cancelled'), value: stats.cancelledOrders, color: 'bg-red-400' },
              ].map(({ label, value, color }) => {
                const pct = stats.totalOrders > 0 ? Math.round((value / stats.totalOrders) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-sans mb-1">
                      <span className="text-noir-600">{label}</span>
                      <span className="text-noir-900 font-medium">{value} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-noir-100 h-1.5">
                      <div className={`h-1.5 ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-noir-100 p-6">
            <h2 className="font-display text-lg text-noir-900 mb-5">Recent Orders (7 days)</h2>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-noir-400 font-sans">No orders in the last 7 days.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentOrders.slice(-10).reverse().map((order, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-noir-50 last:border-0">
                    <div>
                      <p className="text-xs font-sans text-noir-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-sans font-medium text-noir-900">
                        {formatPrice(order.total)}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 font-medium ${STATUS_COLORS[order.status]}`}>
                        {t(`admin.${order.status.toLowerCase()}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <a href="/admin/products" className="bg-noir-900 text-white p-5 flex items-center gap-4 hover:bg-noir-800 transition-colors">
          <Package size={20} className="text-gold-400" />
          <div>
            <p className="font-sans font-medium text-sm">Manage Products</p>
            <p className="text-xs text-noir-400 font-sans mt-0.5">Add, edit, delete products</p>
          </div>
        </a>
        <a href="/admin/orders" className="bg-noir-900 text-white p-5 flex items-center gap-4 hover:bg-noir-800 transition-colors">
          <ShoppingBag size={20} className="text-gold-400" />
          <div>
            <p className="font-sans font-medium text-sm">Manage Orders</p>
            <p className="text-xs text-noir-400 font-sans mt-0.5">View and update order status</p>
          </div>
        </a>
      </div>
    </div>
  )
}
