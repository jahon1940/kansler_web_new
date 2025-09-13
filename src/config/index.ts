export const defaultLocale = 'ru'
export const locales = ['ru', 'uz']

export const API_HOST = process.env.NEXT_PUBLIC_API_URL ?? ''
export const API_VERSION = process.env.NEXT_PUBLIC_API_URL_VERSION
export const API_BASE_URL = `${API_HOST}/${API_VERSION}`

export const DEFAULT_THEME = 'light'

export const colors = {
  black: '#222B50',
  'primary-dark': '#354AB5',
  primary: '#006e36',
  'primary-light': '#C7D0FF',
  secondary: '#0F0F0F',
  'secondary-light': '#9A9A9A',
  'secondary-dark': '#191919',
  'secondary-300': '#6C6C6C',
  error: '#CA4E2E',
  'error-light': '#F8D3AE',
  warning: '#B2A23F',
  'warning-light': '#FDF8BC',
  info: '#3E77B0',
  'info-500': '#6EC8F7',
  'info-light': '#C4F8FD',
  success: '#099D42',
  'success-light': '#DAF3E4',
  'grey-soft': '#F4F4F4',
  'grey-stroke': '#D9D9D9',
  background: '#F4F7FD',
  'card-dark': '#393E46',
  'card-light': '#EDF5FB',
  'background-light': '#F4F7FD',

  dprimary: '#505663ff',
  dsecondary: '#2a323dff',
  dborder: '#374151',
}
