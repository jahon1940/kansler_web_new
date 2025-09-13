import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import LoginView from '@/views/login'
import { defaultLocale } from '@/config'

import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common', 'fields', 'actions'])),
    },
  }
}

const Page = () => {
  return <LoginView />
}

export default Page
