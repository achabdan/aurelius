import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-noir-950 text-noir-300">
      {/* Main footer */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-display text-2xl text-white tracking-[0.1em]">AURELIUS</span>
            <p className="mt-4 text-sm text-noir-400 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="mt-6 flex gap-3">
              <div className="w-8 h-8 border border-noir-700 flex items-center justify-center hover:border-gold-500 cursor-pointer transition-colors">
                <span className="text-xs">IG</span>
              </div>
              <div className="w-8 h-8 border border-noir-700 flex items-center justify-center hover:border-gold-500 cursor-pointer transition-colors">
                <span className="text-xs">FB</span>
              </div>
              <div className="w-8 h-8 border border-noir-700 flex items-center justify-center hover:border-gold-500 cursor-pointer transition-colors">
                <span className="text-xs">TW</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-sans font-medium mb-5">
              {t('footer.collections')}
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/women', label: t('common.women') },
                { to: '/men', label: t('common.men') },
                { to: '/products?category=RINGS', label: t('products.rings') },
                { to: '/products?category=WATCHES', label: t('products.watches') },
                { to: '/products?category=NECKLACES', label: t('products.necklaces') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-noir-400 hover:text-gold-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-sans font-medium mb-5">
              {t('footer.info')}
            </h4>
            <ul className="space-y-3">
              {[
                t('footer.about'),
                t('footer.contact'),
                t('footer.shipping'),
                t('footer.privacy'),
              ].map(label => (
                <li key={label}>
                  <span className="text-sm text-noir-400 hover:text-gold-400 transition-colors cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-noir-800">
        <div className="container-site py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-noir-500">
            © {new Date().getFullYear()} Aurelius. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-noir-500">COD · Secure Checkout</span>
            <div className="flex gap-2">
              {['VISA','MC','AMEX'].map(c => (
                <span key={c} className="px-2 py-0.5 border border-noir-700 text-[10px] text-noir-500">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
