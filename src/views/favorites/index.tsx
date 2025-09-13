import { useTranslation } from 'next-i18next'

import FavoritesList from './containers/list'
import ViewTypeButton from './components/view-type-button'

const FavoritesView = () => {
  const { t } = useTranslation()

  return (
    <main className="flex py-4 relative w-full shrink-0 max-w-[1240px] mx-auto gap-3 flex-1 flex-col">
      <div className="flex items-center gap-4">
        <h2 className="text-[24px] font-semibold dark:text-white">{t('common:favorites')}</h2>
        <ViewTypeButton />
      </div>
      <FavoritesList />
    </main>
  )
}

export default FavoritesView
