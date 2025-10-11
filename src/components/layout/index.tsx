import { useRouter } from 'next/router'

import Header from './header'
import { Media } from '@/config/media-styles-config'

import MobileDownload from '../shared/mobile-download'

import { useEffect, type ReactNode } from 'react'
import Footer from './footer'
import { useQuery } from '@tanstack/react-query'
import { getSessionKey } from '@/services'
import { getCookie, setCookie } from 'cookies-next'

interface IProps {
  children: ReactNode
}

const Layout = ({ children }: IProps) => {
  const { pathname } = useRouter()
  const sessionKey = getCookie('session-key-kansler')

  const { data } = useQuery({
    queryKey: ['session-key'],
    queryFn: () => getSessionKey(),
    enabled: Boolean(sessionKey),
  })

  useEffect(() => {
    if (data?.session_key) {
      setCookie('session-key-kansler', data?.session_key)
    }
  }, [data])

  return (
    <>
      {/* <Media greaterThanOrEqual={pathname.includes('politika') ? 'xs' : 'sm'}> */}
      <div className="flex flex-col min-h-screen mb-[57px] lg:m-0">
        <Header />
        {children}
        <Footer />
      </div>
      {/* </Media> */}
      {/* {pathname.includes('politika') ? null : (
        <Media lessThan="sm">
          <MobileDownload />
        </Media>
      )} */}
    </>
  )
}

export default Layout
