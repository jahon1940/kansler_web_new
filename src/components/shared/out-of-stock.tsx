import { useTranslation } from 'next-i18next'

const OutOfStock = () => {
  const { t } = useTranslation()

  return (
    // <div className="text-xs h-[51.7px] content-center text-error dark:text-red-500 text-center">
    <div className="text-xs h-[32px] content-center text-error dark:text-red-500 text-center">
      {t('common:out-of-stock')}
    </div>
  )
}

export default OutOfStock
