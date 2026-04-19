import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react'
import useAuthStore from '../../context/authStore'
import clsx from 'clsx'

export default function AdminLayout() {
  const { t } = useTranslation()
  const { admin, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.dashboard') },
    { to: '/admin/products', icon: Package, label: t('admin.products') },
    { to: '/admin/orders', icon: ShoppingBag, label: t('admin.orders') },
  ]

  return (
    <div className="flex h-screen bg-noir-50">
      {/* Sidebar */}
      <aside className="w-60 bg-noir-950 flex flex-col">
        <div className="p-6 border-b border-noir-800">
          <span className="font-display text-xl text-white tracking-widest">AURELIUS</span>
          <p className="text-xs text-noir-500 mt-1 font-sans">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 text-sm font-sans transition-colors',
                  isActive
                    ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-400'
                    : 'text-noir-400 hover:text-white hover:bg-noir-800'
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-noir-800">
          <div className="px-4 py-3 mb-2">
            <p className="text-xs text-noir-400 font-sans">{admin?.email}</p>
            <p className="text-sm text-white font-sans font-medium">{admin?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-noir-400 hover:text-red-400 transition-colors font-sans"
          >
            <LogOut size={15} />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
