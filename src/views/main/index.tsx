import Products from './containers/products'
import MainBanner from './containers/main-banner'

const MainView = () => {
  return (
    <main className="max-w-[1240px] w-full mx-auto py-4">
      <MainBanner />
      <Products />
    </main>
  )
}

export default MainView
