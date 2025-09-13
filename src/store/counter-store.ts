import { create } from 'zustand'

interface CounterState {
  cartCount: number
  favoritesCount: number

  incrementCart: () => void
  decrementCart: () => void
  setCartCount: (value: number) => void

  incrementFavorites: () => void
  decrementFavorites: () => void
  setFavoritesCount: (value: number) => void
}

const useCounterStore = create<CounterState>((set) => ({
  cartCount: 0,
  favoritesCount: 0,

  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  decrementCart: () => set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),
  setCartCount: (value: number) => set({ cartCount: Math.max(0, value) }),

  incrementFavorites: () => set((state) => ({ favoritesCount: state.favoritesCount + 1 })),
  decrementFavorites: () =>
    set((state) => ({ favoritesCount: Math.max(0, state.favoritesCount - 1) })),
  setFavoritesCount: (value: number) => set({ favoritesCount: Math.max(0, value) }),
}))

export default useCounterStore
