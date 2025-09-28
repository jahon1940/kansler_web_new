import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { Button, Form, Input } from 'antd'
import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'

import { getCounts } from '@/services'
import useAuthStore from '@/store/auth-store'
import useCounterStore from '@/store/counter-store'
import LocaleSwitcher from '../shared/locale-switcher'

// import ChatDrawer from '../shared/chat-drawer'

import Bag2BoldIcon from '../icons/bag-2-bold'
import HeartBoldIcon from '../icons/heart-bold'
import Home2BoldIcon from '../icons/home-2-bold'
import ProfileBoldIcon from '../icons/profile-bold'
import Bag2OutlineIcon from '../icons/bag-2-outline'
import HeartOutlineIcon from '../icons/heart-outline'
import Home2OutlineIcon from '../icons/home-2-outline'
import ProfileOutlineIcon from '../icons/profile-outline'
import ShoppingCartBoldIcon from '../icons/shopping-cart-bold'
import SearchNormalOutlineIcon from '../icons/search-normal-outline'
import ShoppingCartOutlineIcon from '../icons/shopping-cart-outline'

import type { FC } from 'react'
import ChatDrawer from '../shared/chat-drawer'
import DownloadIcon from '../icons/download'
import DeliveryIcon from '../icons/delivery'
import TelegramIcon from '../icons/telegram'
import { PhoneIcon } from 'lucide-react'
import CatalogMenu from '../shared/catalog-menu'

const ThemeSwitcher = dynamic(() => import('../shared/theme-switcher'), { ssr: false })

const Header: FC = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { push, query, pathname } = useRouter()
  const isSignedIn = useAuthStore((state) => state.isSignedIn)
  const { favoritesCount, cartCount, setCartCount, setFavoritesCount } = useCounterStore()

  const { data: counts } = useQuery({
    queryKey: ['counts', isSignedIn],
    queryFn: () => getCounts(),
    enabled: isSignedIn,
  })

  useEffect(() => {
    if (counts?.cart_products) {
      setCartCount(counts.cart_products)
    }
    if (counts?.favorite_products) {
      setFavoritesCount(counts?.favorite_products)
    }

    if (!isSignedIn) {
      setCartCount(0)
      setFavoritesCount(0)
    }
  }, [counts, isSignedIn])

  const links = [
    { href: '/', icon: <Home2OutlineIcon />, activeIcon: <Home2BoldIcon />, label: 'Main' },
    // {
    //   href: '/catalog',
    //   icon: <Category2OutlineIcon />,
    //   activeIcon: <Category2BoldIcon />,
    //   label: 'Categories',
    // },
    {
      href: '/favorites',
      icon: <HeartOutlineIcon />,
      activeIcon: <HeartBoldIcon />,
      label: 'Favorites',
      count: favoritesCount,
    },
    {
      href: '/shopping-cart',
      icon: <ShoppingCartOutlineIcon />,
      activeIcon: <ShoppingCartBoldIcon />,
      label: 'Shopping Cart',
      count: cartCount,
    },
    {
      href: '/orders',
      icon: <Bag2OutlineIcon />,
      activeIcon: <Bag2BoldIcon />,
      label: 'My orders',
    },
    {
      href: '/profile',
      icon: <ProfileOutlineIcon />,
      activeIcon: <ProfileBoldIcon />,
      label: 'Profile',
    },
  ]

  const formSubmitHandler = (values: { search: string }) => {
    push({
      pathname: '/search',
      query: queryString.stringify(
        { ...values, order_by: 'created_at', page: 1 },
        { skipEmptyString: true }
      ),
    })
  }

  useEffect(() => {
    form.setFieldValue('title', query?.title)
  }, [query, form])

  return (
    <header className="hidden md:flex select-none sticky top-0 z-10 border-b border-gray-300 dark:border-dborder flex-col">
      <div className="bg-[#E0E2E7] dark:bg-dsecondary">
        <div className="custom-container items-center flex gap-2 justify-between py-2">
          <ChatDrawer />
          <ul className="flex items-center gap-4 flex-1 justify-evenly">
            <li className="flex items-center gap-2">
              <PhoneIcon size={16} />
              +998 (78) 148-44-44
            </li>
            <li className="flex items-center gap-2">
              <TelegramIcon className="text-[18px]" /> @kansler_support_bot
            </li>
            <li className="flex items-center gap-2">
              <DeliveryIcon className="text-[18px]" /> Доставим не позднее 2х дней
            </li>
          </ul>
          <div className="items-center flex gap-2 justify-end">
            <Button
            // htmlType="submit"
            // color="default"
            // variant="filled"
            // className="text-[15px] font-medium border border-secondary-light/20 dark:border-dborder dark:bg-dsecondary dark:text-white"
            >
              <DownloadIcon className="text-[18px]" />
              Скачать прайс
            </Button>
            <ThemeSwitcher />
            <LocaleSwitcher />
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-dprimary py-[10px] text-black dark:text-white">
        <div className="custom-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 gap-3">
              <Link href="/" className="h-[48px] w-[200px]">
                <Image
                  src="/logo.png"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                  alt="Logo"
                />
              </Link>
              <CatalogMenu />
              <Form
                className="flex items-center gap-1 flex-1"
                form={form}
                onFinish={formSubmitHandler}
              >
                <Form.Item name="title" className="max-w-[338px] w-full">
                  <Input
                    prefix={
                      <SearchNormalOutlineIcon className="text-[22px] mr-1 text-[#616883] dark:text-gray-400" />
                    }
                    type="text"
                    variant="filled"
                    placeholder={t('actions:search') + '...'}
                    aria-label="Search"
                    className="w-full text-[14px] border border-secondary-light/20 dark:border-dborder dark:bg-dsecondary dark:text-white font-medium"
                  />
                </Form.Item>
                <Button
                  htmlType="submit"
                  color="default"
                  variant="filled"
                  className="text-[15px] font-medium border border-secondary-light/20 dark:border-dborder dark:bg-dsecondary dark:text-white"
                >
                  {t('actions:search')}
                </Button>
              </Form>
            </div>

            <nav className="flex items-center gap-[17px]">
              {/* <div className=" border-4 border-dsecondary rounded-full p-1 cursor-pointer">
                <CImage src={CircleLogo} width={35} height={35} alt="logo" />
              </div> */}
              {links.map(({ href, icon, label, activeIcon, count }) => (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  draggable={false}
                  className="relative"
                >
                  <Button
                    type="text"
                    className={twMerge(
                      'text-[25px]',
                      pathname === href
                        ? 'text-primary bg-primary-light/20 dark:bg-primary/20'
                        : 'text-black dark:text-white'
                    )}
                    icon={pathname === href ? activeIcon : icon}
                  />
                  {isSignedIn && count !== undefined && count > 0 ? (
                    <span className="h-[16px] min-w-[16px] px-1 absolute right-[-5px] top-0 inline-flex items-center justify-center shrink-0 text-xs text-white bg-red-500 rounded-full">
                      {count}
                    </span>
                  ) : null}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
