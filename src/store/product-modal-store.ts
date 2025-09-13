import { create } from 'zustand'

interface IModalState {
  isOpen: boolean
  setIsOpen: (value?: boolean) => void
}

const useProductModalStore = create<IModalState>()((set) => ({
  isOpen: false,
  setIsOpen: (value) => set((state) => ({ isOpen: value ?? !state.isOpen })),
}))

export default useProductModalStore
