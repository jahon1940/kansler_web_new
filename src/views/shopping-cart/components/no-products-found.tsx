import { useTranslation } from 'next-i18next'

import EmptyCartIcon from '@/components/icons/empty-cart'

const NoProductsFound = () => {
  const { t } = useTranslation('common')

  return (
    <div className="bg-white flex-1 dark:bg-dprimary rounded-xl">
      <div className="flex flex-col items-center h-full justify-center text-center">
        <EmptyCartIcon className="text-[200px] mb-6" />
        <h2 className="text-lg font-semibold dark:text-white text-gray-900">
          {t('shopping_cart_not_found.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('shopping_cart_not_found.subtitle')}
        </p>
      </div>
    </div>
  )
}

export default NoProductsFound
