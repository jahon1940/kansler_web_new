import { create } from 'zustand'
import Cookies from 'js-cookie'

import { DEFAULT_THEME } from '@/config'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const cookieTheme: any = Cookies.get('theme')

export const useThemeStore = create<ThemeState>((set) => ({
  theme: cookieTheme || DEFAULT_THEME,
  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    Cookies.set('theme', theme, { expires: 365 })
    set({ theme })
  },
}))
