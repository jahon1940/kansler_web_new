import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'

import { getAuthCurrent } from '../services'

const NoCategoryFound = () => {
  const { t } = useTranslation('common')

  const { data } = useQuery({
    queryKey: ['auth-current'],
    queryFn: () => getAuthCurrent(),
  })

  return (
    <div className="bg-white h-full dark:bg-dprimary flex-1 rounded-xl">
      <div className="flex flex-col items-center h-full justify-center text-center">
        {data && data.is_address ? (
          <p className="text-gray-600 mt-2 dark:text-white">
            {t('category_not_found.page_restricted')}
          </p>
        ) : null}

        {data && !data.is_address ? (
          <>
            <p className="text-gray-600 mt-2 dark:text-white">
              {t('category_not_found.page_info')}
            </p>
            <p className="text-gray-600 mt-2 dark:text-white">
              {t('category_not_found.limits_bonuses')}
            </p>
            <p className="text-gray-600 mt-2 dark:text-white">
              {t('category_not_found.debts_payment_history')}
            </p>
            <p className="text-gray-600 mt-2 mb-10 dark:text-white">
              {t('category_not_found.list_of_trade_points')}
            </p>
            <p className="text-gray-600 mt-2 dark:text-white">
              {t('category_not_found.select_organization')}
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default NoCategoryFound
