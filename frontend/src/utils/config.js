const rawApiUrl = import.meta.env.VITE_API_URL?.trim() || ''

export const apiOrigin = rawApiUrl
  ? rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '')
  : ''

export const apiBaseUrl = apiOrigin ? `${apiOrigin}/api` : '/api'

export const resolveBackendUrl = (path) => {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return apiOrigin ? `${apiOrigin}${normalizedPath}` : normalizedPath
}
