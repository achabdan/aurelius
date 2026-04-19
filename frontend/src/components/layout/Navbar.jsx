import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Search, Menu, X, Globe } from 'lucide-react'
import useCartStore from '../../context/cartStore'
import clsx from 'clsx'

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'es', label: 'ES', full: 'Español' },
]

export default function Navbar({ onCartClick }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const items = useCartStore(s => s.items)
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearchOpen(false)
      setSearch('')
    }
  }

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    setLangOpen(false)
  }

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/women', label: t('nav.women') },
    { to: '/men', label: t('nav.men') },
    { to: '/products', label: t('nav.all') },
  ]

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-noir-900 text-cream-100 text-center py-2 text-xs tracking-[0.15em] uppercase font-sans">
        Free shipping on orders over $150 · Cash on Delivery Available
      </div>

      <header
        className={clsx(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled ? 'bg-white shadow-sm' : 'bg-white'
        )}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-noir-700 hover:text-noir-900"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="font-display text-2xl md:text-3xl font-semibold tracking-[0.08em] text-noir-900">
                AURELIUS
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'text-xs uppercase tracking-[0.15em] font-sans font-medium transition-colors',
                      isActive ? 'text-noir-900 border-b border-noir-900 pb-0.5' : 'text-noir-500 hover:text-noir-900'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-noir-600 hover:text-noir-900 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="p-2 text-noir-600 hover:text-noir-900 transition-colors flex items-center gap-1"
                  aria-label="Language"
                >
                  <Globe size={16} />
                  <span className="text-xs font-sans font-medium uppercase hidden md:block">
                    {i18n.language?.slice(0,2).toUpperCase()}
                  </span>
                </button>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-noir-100 shadow-lg z-50 min-w-[130px]">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={clsx(
                            'w-full text-left px-4 py-2.5 text-xs font-sans hover:bg-cream-100 transition-colors',
                            i18n.language?.startsWith(lang.code) ? 'text-gold-600 font-medium' : 'text-noir-700'
                          )}
                        >
                          {lang.label} — {lang.full}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={onCartClick}
                className="relative p-2 text-noir-600 hover:text-noir-900 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-24 px-4">
            <div className="w-full max-w-xl bg-white">
              <form onSubmit={handleSearch} className="flex">
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('products.search_placeholder')}
                  className="flex-1 px-5 py-4 font-sans text-sm text-noir-900 outline-none placeholder:text-noir-400"
                />
                <button type="submit" className="px-5 bg-noir-900 text-white hover:bg-noir-800 transition-colors">
                  <Search size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 text-noir-500 hover:text-noir-900"
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-72 bg-white h-full flex flex-col shadow-2xl animate-slide-in-right">
              <div className="flex items-center justify-between p-5 border-b border-noir-100">
                <span className="font-display text-xl font-semibold">AURELIUS</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-6 space-y-6">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'block text-sm uppercase tracking-[0.15em] font-sans',
                        isActive ? 'text-noir-900 font-medium' : 'text-noir-500'
                      )
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-6 border-t border-noir-100">
                <div className="flex gap-3">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { changeLanguage(lang.code); setMobileOpen(false) }}
                      className={clsx(
                        'text-xs font-sans font-medium uppercase px-2 py-1 border',
                        i18n.language?.startsWith(lang.code)
                          ? 'border-noir-900 text-noir-900'
                          : 'border-noir-200 text-noir-500'
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
          </div>
        )}
      </header>
    </>
  )
}
