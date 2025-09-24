import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { defaultLocale } from '@/config'

import PaymentAndDeliveryView from '@/views/payment-and-delivery'

import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common', 'fields', 'actions'])),
    },
  }
}

const Page = () => {
  return <PaymentAndDeliveryView />
}

export default Page
