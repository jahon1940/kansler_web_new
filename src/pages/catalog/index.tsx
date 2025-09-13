import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { defaultLocale } from '@/config'

import CatalogView from '@/views/catalog'

import type { GetStaticProps } from 'next'

export const getServerSideProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common', 'fields', 'actions'])),
    },
  }
}

const Page = () => {
  return <CatalogView />
}

export default Page
