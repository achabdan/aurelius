import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/product/ProductCard'
import ProductSkeleton from '../components/product/ProductSkeleton'

export default function HomePage() {
  const { t } = useTranslation()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products?featured=true&limit=8')
      .then(res => setFeatured(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-noir-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-noir-950/90 via-noir-950/60 to-transparent" />
        </div>

        <div className="container-site relative z-10 py-20">
          <div className="max-w-xl">
            <p className="section-subtitle text-gold-400 animate-fade-in"
               style={{ animationDelay: '0.1s', opacity: 0, animation: 'fadeIn 0.8s ease forwards 0.1s' }}>
              {t('home.hero_subtitle')}
            </p>

            <h1
              className="font-display text-5xl md:text-7xl text-white leading-[1.05] mb-6 whitespace-pre-line"
              style={{ opacity: 0, animation: 'slideUp 0.9s ease forwards 0.2s' }}
            >
              {t('home.hero_title')}
            </h1>

            <p
              className="text-noir-300 font-sans text-lg leading-relaxed mb-10 max-w-sm"
              style={{ opacity: 0, animation: 'slideUp 0.9s ease forwards 0.35s' }}
            >
              {t('home.hero_desc')}
            </p>

            <div
              className="flex flex-wrap gap-4"
              style={{ opacity: 0, animation: 'slideUp 0.9s ease forwards 0.5s' }}
            >
              <Link to="/products" className="btn-gold px-8 py-4 text-sm">
                {t('home.hero_cta')}
                <ArrowRight size={16} />
              </Link>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-noir-900 px-8 py-4 text-sm">
                {t('home.hero_cta2')}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold-400 animate-pulse" />
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className="bg-cream-100 border-y border-cream-200">
        <div className="container-site py-8">
          <div className="grid grid-cols-3 divide-x divide-cream-200">
            {[
              { num: '500+', label: 'Curated Pieces' },
              { num: '100%', label: 'Authentic Quality' },
              { num: 'COD', label: 'Cash on Delivery' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center py-2">
                <div className="font-display text-2xl md:text-3xl text-noir-900">{num}</div>
                <div className="text-xs uppercase tracking-widest text-noir-500 font-sans mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gender Categories ────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-subtitle">{t('home.categories_subtitle')}</p>
            <h2 className="section-title">{t('home.categories_title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Women */}
            <Link to="/women" className="group relative overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=900&q=80"
                alt="Women's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-noir-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-gold-400 text-xs uppercase tracking-[0.2em] font-sans mb-2">
                  {t('home.women_desc')}
                </p>
                <h3 className="font-display text-3xl text-white mb-4">{t('home.women_collection')}</h3>
                <span className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-wider border-b border-white/50 group-hover:border-gold-400 group-hover:text-gold-400 transition-colors pb-0.5">
                  {t('home.shop_now')} <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Men */}
            <Link to="/men" className="group relative overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&q=80"
                alt="Men's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-noir-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-gold-400 text-xs uppercase tracking-[0.2em] font-sans mb-2">
                  {t('home.men_desc')}
                </p>
                <h3 className="font-display text-3xl text-white mb-4">{t('home.men_collection')}</h3>
                <span className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-wider border-b border-white/50 group-hover:border-gold-400 group-hover:text-gold-400 transition-colors pb-0.5">
                  {t('home.shop_now')} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="py-20 bg-cream-50">
        <div className="container-site">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-subtitle">{t('home.featured_subtitle')}</p>
              <h2 className="section-title">{t('home.featured_title')}</h2>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-2 text-sm text-noir-600 hover:text-gold-600 font-sans uppercase tracking-wider transition-colors"
            >
              {t('home.view_all')} <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <ProductSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link to="/products" className="btn-outline">
              {t('home.view_all')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category pills ───────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-noir-100">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="section-subtitle">{t('home.new_arrivals')}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              ['RINGS', 'products.rings'],
              ['NECKLACES', 'products.necklaces'],
              ['BRACELETS', 'products.bracelets'],
              ['EARRINGS', 'products.earrings'],
              ['WATCHES', 'products.watches'],
              ['BAGS', 'products.bags'],
            ].map(([cat, key]) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="px-6 py-2.5 border border-noir-200 text-xs uppercase tracking-[0.15em] font-sans text-noir-700 hover:border-gold-400 hover:text-gold-600 transition-colors"
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COD Banner ───────────────────────────────────────────── */}
      <section className="py-16 bg-noir-900">
        <div className="container-site text-center">
          <p className="section-subtitle text-gold-400">{t('product.cod_badge')}</p>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
            Order Now, Pay on Delivery
          </h2>
          <p className="text-noir-400 font-sans max-w-md mx-auto mb-8">
            No online payment needed. Place your order and pay cash when it arrives at your door.
          </p>
          <Link to="/products" className="btn-gold px-8 py-4">
            {t('home.hero_cta')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
