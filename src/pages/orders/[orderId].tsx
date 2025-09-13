import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { defaultLocale } from '@/config'

import OrdersItemView from '@/views/orders-item'

import type { GetServerSideProps } from 'next'
import { ROUTES } from '@/constants'

export const getServerSideProps: GetServerSideProps = async ({ locale, req }) => {
  const token = req.cookies['auth_token']

  // if (!token) {
  //   return {
  //     notFound: true,
  //   }
  // }

  if (!token) {
    return {
      redirect: {
        destination: (locale === 'uz' ? '/uz/' : '') + ROUTES.LOGIN,
        permanent: false,
      },
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common', 'fields', 'actions'])),
    },
  }
}

const Page = () => {
  return <OrdersItemView />
}

export default Page
