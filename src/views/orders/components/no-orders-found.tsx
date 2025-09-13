import { useTranslation } from 'next-i18next'

import EmptyOrdersIcon from '@/components/icons/empty-orders'

const NoOrdersFound = () => {
  const { t } = useTranslation('common')

  return (
    <div className="bg-white dark:bg-dprimary flex-1 rounded-xl">
      <div className="flex flex-col items-center h-full justify-center text-center">
        <EmptyOrdersIcon className="text-[200px] mb-6" />
        <h2 className="text-lg font-semibold text-black dark:text-white">
          {t('common:orders_not_found.title')}
        </h2>
        <p className="text-gray-600 mt-2 dark:text-gray-300">
          {t('common:orders_not_found.subtitle')}
        </p>
      </div>
    </div>
  )
}

export default NoOrdersFound
