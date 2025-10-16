import { useEffect, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

import Header from './header'
import Footer from './footer'
import { getSessionKey } from '@/services'

interface IProps {
  children: ReactNode
}

const EXPIRY_DAYS = 7

const Layout = ({ children }: IProps) => {
  const getStoredSession = () => {
    if (typeof window === 'undefined') return null
    const cookie = getCookie('session-key-kansler')
    return cookie || null
  }

  const sessionKey = getStoredSession()

  const { data } = useQuery({
    queryKey: ['session-key'],
    queryFn: () => getSessionKey(),
    enabled: !sessionKey,
  })

  useEffect(() => {
    if (data?.session_key && !sessionKey) {
      setCookie('session-key-kansler', data.session_key, {
        maxAge: EXPIRY_DAYS * 24 * 60 * 60,
        sameSite: 'strict',
        secure: true,
      })
    } else if (!data?.session_key && !sessionKey) {
      deleteCookie('session-key-kansler')
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
