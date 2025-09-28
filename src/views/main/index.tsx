import Products from './containers/products'
import MainBanner from './containers/main-banner'
import TrustedBy from './containers/trusted-by'

const MainView = () => {
  return (
    <main className="max-w-[1240px] w-full mx-auto py-4 overflow-hidden">
      <MainBanner />
      <TrustedBy />
      <Products />
    </main>
  )
}

export default MainView
