import { useTranslation } from 'next-i18next'

const NoFavoritesFound = () => {
  const { t } = useTranslation('common')

  return (
    <div className="bg-white flex items-center justify-center dark:bg-dprimary flex-1 rounded-xl">
      <div className="flex flex-col items-center h-full justify-center text-center">
        <h2 className="text-lg font-semibold dark:text-white text-gray-900">
          {t('common:favorites_not_found.title')}
        </h2>
        <p className="text-gray-600 mt-2 dark:text-white max-w-[400px]">
          {t('common:favorites_not_found.subtitle')}
        </p>
      </div>
    </div>
  )
}

export default NoFavoritesFound
