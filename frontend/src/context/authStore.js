import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await api.post('/admin/login', { email, password })
        const { token, admin } = res.data
        set({ token, admin, isAuthenticated: true })
        return admin
      },

      logout: () => {
        set({ token: null, admin: null, isAuthenticated: false })
      },
    }),
    { name: 'aurelius-admin' }
  )
)

export default useAuthStore
