import axios from 'axios'
import { apiBaseUrl } from './config'

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage if present
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('aurelius-admin') || '{}')
    const token = stored?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {}
  return config
})

export default api
