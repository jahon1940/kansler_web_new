import ProductsList from './containers/list'
import ShoppingCartSidebar from './containers/sidebar'

const ShoppingCartView = () => {
  return (
    <main className="flex py-4 relative w-full shrink-0 custom-container gap-3 flex-1">
      {/* <ShoppingCartSidebar /> */}
      <ProductsList />
    </main>
  )
}

export default ShoppingCartView
