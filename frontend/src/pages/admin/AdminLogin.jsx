import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import useAuthStore from '../../context/authStore'

export default function AdminLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-noir-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display text-3xl text-white tracking-widest">AURELIUS</span>
          <p className="text-xs text-noir-500 font-sans mt-2 uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-noir-900 border border-noir-800 p-8">
          <h1 className="font-display text-xl text-white mb-6">{t('admin.login_title')}</h1>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 text-xs font-sans mb-5">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-noir-400 mb-2">
                {t('admin.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-noir-800 border border-noir-700 text-white px-4 py-3 text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors placeholder:text-noir-600"
                placeholder="admin@aurelius.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-noir-400 mb-2">
                {t('admin.password')}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-noir-800 border border-noir-700 text-white px-4 py-3 pr-10 text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors placeholder:text-noir-600"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-500 hover:text-noir-300"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 text-white py-3 text-sm font-sans font-medium uppercase tracking-widest hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? t('common.loading') : t('admin.login')}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-noir-600 font-sans mt-6">
          Default: admin@aurelius.com / Admin@123456
        </p>
      </div>
    </div>
  )
}
