import axios from 'axios'
import queryString from 'query-string'
import { deleteCookie, getCookie } from 'cookies-next'

import { API_BASE_URL, defaultLocale } from '@/config'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
  paramsSerializer: (params) => {
    return queryString.stringify(params)
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getCookie('auth_token')
    const language = getCookie('NEXT_LOCALE')
    const sessionKey = getCookie('session-key-kansler')

    if (token) {
      config.headers['Device-Token'] = `Mirel ${token}`
    }

    // set 'Accept-Language' only if its not already set in the request
    if (!config.headers['Accept-Language']) {
      config.headers['Accept-Language'] = language || defaultLocale
    }

    config.headers['sessionkey'] = sessionKey

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie('auth_token')
      deleteCookie('session-key-kansler')
    }

    console.error('API Error:', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api
