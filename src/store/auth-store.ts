import { create } from 'zustand'
import Cookies from 'js-cookie'

interface AuthState {
  isSignedIn: boolean
  setAuthToken: (token: string) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: !!Cookies.get('auth_token'),
  setAuthToken: (token) => {
    // Cookies.set('auth_token', token, { expires: 7 }) 7 days
    Cookies.set('auth_token', token)
    set({ isSignedIn: true })
  },
  logout: () => {
    Cookies.remove('auth_token')
    set({ isSignedIn: false })
  },
}))

export default useAuthStore
