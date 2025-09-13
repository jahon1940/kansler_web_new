import { Button } from 'antd'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import type { FC } from 'react'
import type { FormInstance } from 'antd'

const NoProductsFound: FC<{ form: FormInstance<Record<string, any>> | undefined }> = ({ form }) => {
  const { t } = useTranslation('common')
  const { push, pathname } = useRouter()

  const resetHandler = () => {
    form?.resetFields()
    push({ pathname, query: queryString.stringify({ order_by: 'created_at', page: 1 }) })
  }
  return (
    <div className="bg-white dark:bg-dprimary flex-1 rounded-xl">
      <div className="flex flex-col items-center h-full justify-center text-center">
        <h2 className="text-lg font-semibold dark:text-white text-gray-900">
          {t('not_found.title')}
        </h2>
        <p className="text-gray-600 mt-2 dark:text-white">{t('not_found.subtitle')}</p>
        <p className="text-gray-600 dark:text-white">{t('not_found.suggestion')}</p>
        <Button type="primary" className="mt-4" onClick={resetHandler}>
          {t('actions:reset')}
        </Button>
      </div>
    </div>
  )
}

export default NoProductsFound
