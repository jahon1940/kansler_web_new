import { useTranslation } from 'next-i18next'

const MadeToOrder = () => {
  const { t } = useTranslation()

  return (
    // <div className="text-xs h-[51.7px] content-center text-error dark:text-red-500 text-center">
    <div className="text-xs h-[32px] content-center text-error dark:text-red-500 text-center">
      {t('common:made-to-order')}
    </div>
  )
}

export default MadeToOrder
