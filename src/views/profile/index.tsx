import { useRouter } from 'next/router'

import LimitBonuses from './containers/limit-bonuses'
import TradingPoints from './containers/trading-points'
import ProfileSidebar from './containers/profile-sidebar'
import PaymentHistory from './containers/payment-history'
import NoCategoryFound from './components/no-category-found'

const ProfileView = () => {
  const { query } = useRouter()

  return (
    <main className="custom-container flex w-full flex-1 py-4">
      <div className="flex gap-4 flex-1">
        <ProfileSidebar />

        <div className="flex-1 rounded-2xl">
          {query.category === 'limit-bonuses' ? <LimitBonuses /> : null}
          {query.category === 'debt-history' ? <PaymentHistory /> : null}
          {query.category === 'trading-points' ? <TradingPoints /> : null}
          {!query.category ? <NoCategoryFound /> : null}
        </div>
      </div>
    </main>
  )
}

export default ProfileView
