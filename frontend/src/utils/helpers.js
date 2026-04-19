import { resolveBackendUrl } from './config'

/** Format a price number to currency string */
export const formatPrice = (price, currency = '$') => {
  return `${currency}${Number(price).toFixed(2)}`
}

/** Get localized product name based on i18n language */
export const getLocalizedName = (product, lang) => {
  if (lang === 'fr' && product.nameFr) return product.nameFr
  if (lang === 'es' && product.nameEs) return product.nameEs
  return product.nameEn || product.name
}

/** Get localized product description */
export const getLocalizedDesc = (product, lang) => {
  if (lang === 'fr' && product.descriptionFr) return product.descriptionFr
  if (lang === 'es' && product.descriptionEs) return product.descriptionEs
  return product.descriptionEn || product.description
}

/** Get first image URL of product, with fallback */
export const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    return resolveBackendUrl(product.images[0])
  }
  return 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600'
}

/** Truncate text to n characters */
export const truncate = (str, n = 80) => {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

/** Category label map */
export const CATEGORIES = [
  'RINGS','NECKLACES','BRACELETS','EARRINGS',
  'WATCHES','BAGS','BELTS','SUNGLASSES','OTHER',
]

export const ORDER_STATUSES = ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED']

export const STATUS_COLORS = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED:   'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}
