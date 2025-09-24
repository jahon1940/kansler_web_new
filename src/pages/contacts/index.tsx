import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { defaultLocale } from '@/config'

import ContactsView from '@/views/contacts'

import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common', 'fields', 'actions'])),
    },
  }
}

const Page = () => {
  return <ContactsView />
}

export default Page
