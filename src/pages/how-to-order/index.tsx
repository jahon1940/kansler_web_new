import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { defaultLocale } from '@/config'
import HowToOrderView from '@/views/how-to-order'

import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common', 'fields', 'actions'])),
    },
  }
}

const Page = () => {
  return <HowToOrderView />
}

export default Page
