import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { defaultLocale } from '@/config'

import OrdersView from '@/views/orders'

import type { GetServerSideProps } from 'next'

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
        destination: (locale === 'uz' ? '/uz/' : '') + '/auth/login',
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
  return <OrdersView />
}

export default Page
