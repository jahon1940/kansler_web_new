import { useEffect, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'

import Header from './header'
import Footer from './footer'
import { getSessionKey } from '@/services'

interface IProps {
  children: ReactNode
}

const EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000

const Layout = ({ children }: IProps) => {
  const getStoredSession = () => {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem('session-key-kansler')
    if (!stored) return null

    try {
      const parsed = JSON.parse(stored)
      if (parsed.expiry && Date.now() < parsed.expiry) {
        return parsed.value
      } else {
        localStorage.removeItem('session-key-kansler')
        return null
      }
    } catch {
      localStorage.removeItem('session-key-kansler')
      return null
    }
  }

  const sessionKey = getStoredSession()

  const { data } = useQuery({
    queryKey: ['session-key'],
    queryFn: () => getSessionKey(),
    enabled: !sessionKey,
  })

  useEffect(() => {
    if (data?.session_key && !sessionKey) {
      const payload = {
        value: data.session_key,
        expiry: Date.now() + EXPIRY_DURATION,
      }
      localStorage.setItem('session-key-kansler', JSON.stringify(payload))
    }
  }, [data, sessionKey])

  return (
    <div className="flex flex-col min-h-screen mb-[57px] lg:m-0">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
