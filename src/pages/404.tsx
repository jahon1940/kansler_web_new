import Link from 'next/link'
import { Button } from 'antd'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { defaultLocale } from '@/config'

import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common', 'fields', 'actions'])),
    },
  }
}

const NotFoundPage = () => {
  const { t } = useTranslation('common')

  return (
    <div className="flex-1 text-black dark:text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-3">{t('common:not-found-page.title')}</h1>
        <p className="text-md mb-6">{t('common:not-found-page.description')}</p>
        <Link href={'/'}>
          <Button type="primary">{t('actions:go-to-main')}</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
