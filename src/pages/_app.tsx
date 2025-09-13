import i18next from 'i18next'
import Cookies from 'js-cookie'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { initReactI18next } from 'react-i18next'
import { appWithTranslation } from 'next-i18next'
import { PagesProgressBar } from 'next-nprogress-bar'
import { App as AntdApp, Button, ConfigProvider, notification } from 'antd'
import {
  HydrationBoundary,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { DEFAULT_THEME } from '@/config'
import Layout from '@/components/layout'
import { themeLight, themeDark } from '@/config/theme-config'
import { MediaContextProvider } from '@/config/media-styles-config'

import '@/styles/globals.css'
import 'react-multi-carousel/lib/styles.css'

import nextI18NextConfig from '../../next-i18next.config'

import type { AppProps } from 'next/app'
import type { IError } from '@/types'
import Head from 'next/head'

i18next.use(initReactI18next).init({
  ...nextI18NextConfig.i18n,
  fallbackLng: 'ru',
})

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

function App({ Component, pageProps }: AppProps) {
  const [api, contextHolder] = notification.useNotification({
    maxCount: 1,
    showProgress: true,
    duration: 20,
    closeIcon: null,
  })
  const [theme, setTheme] = useState<'light' | 'dark'>(DEFAULT_THEME)

  useEffect(() => {
    const storedTheme = Cookies.get('theme') as 'light' | 'dark' | undefined
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  const showErrorNotification = (errorMessage: IError) => {
    const key = `open${Date.now()}`
    api.error({
      key,
      message: null,
      description: errorMessage?.message || 'Something went wrong!',
      closable: false,
      role: 'alert',
      pauseOnHover: true,
      placement: 'top',
      btn: (
        <Button type="primary" onClick={() => api.destroy(key)}>
          Ок
        </Button>
      ),
    })
  }

  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
      queryCache: new QueryCache({
        onError: (error: any) => {
          showErrorNotification(error?.response?.data)
        },
      }),
      mutationCache: new MutationCache({
        onError: (error: any) => {
          showErrorNotification(error?.response?.data)
        },
      }),
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <MediaContextProvider>
          <ConfigProvider theme={theme === 'light' ? themeLight : themeDark} componentSize="large">
            <style jsx global>{`
              :root {
                font-family: ${inter.style.fontFamily};
              }
            `}</style>
            <AntdApp>
              {contextHolder}
              <Head>
                <title>Mirel - Канцтовары оптом, Deli torg, Signum, Grand trading.</title>
                <meta
                  name="description"
                  content="Присоединяйтесь к сообществу оптовых покупателей и оцените удобство онлайн-заказов канцелярии. Всё для бизнеса — в одном месте и с доставкой."
                />
                <link rel="icon" href="/favicon.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <PagesProgressBar height="4px" color="#fffd00" options={{ showSpinner: false }} />
            </AntdApp>
          </ConfigProvider>
        </MediaContextProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

export default appWithTranslation(App, nextI18NextConfig)
