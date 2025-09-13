import { create } from 'zustand'

interface BearState {
  isTableType: boolean
  setIsTableType: () => void
}

const useViewTypeStore = create<BearState>()((set) => ({
  isTableType: true,
  setIsTableType: () => set((state) => ({ isTableType: !state.isTableType })),
}))

export default useViewTypeStore
