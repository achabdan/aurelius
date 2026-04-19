/**
 * Cart Store — Zustand global state
 * Persists cart to localStorage
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item or increment quantity
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(i => i.id === product.id)
        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },

      // Remove item entirely
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.id !== productId) })
      },

      // Update quantity (0 removes it)
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map(i =>
            i.id === productId ? { ...i, quantity } : i
          ),
        })
      },

      // Clear entire cart
      clearCart: () => set({ items: [] }),

      // Computed: total item count
      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      // Computed: subtotal
      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    {
      name: 'aurelius-cart',
    }
  )
)

export default useCartStore
