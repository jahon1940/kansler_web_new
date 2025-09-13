import { useRouter } from 'next/router'

import Header from './header'
import { Media } from '@/config/media-styles-config'

import MobileDownload from '../shared/mobile-download'

import type { ReactNode } from 'react'
import Footer from './footer'

interface IProps {
  children: ReactNode
}

const Layout = ({ children }: IProps) => {
  const { pathname } = useRouter()

  return (
    <>
      <Media greaterThanOrEqual={pathname.includes('politika') ? 'xs' : 'sm'}>
        <div className="flex flex-col min-h-screen">
          <Header />
          {children}
          <Footer />
        </div>
      </Media>
      {pathname.includes('politika') ? null : (
        <Media lessThan="sm">
          <MobileDownload />
        </Media>
      )}
    </>
  )
}

export default Layout
