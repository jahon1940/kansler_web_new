import ProductsList from './containers/list'
import MyOrdersSidebar from './containers/sidebar'

const OrdersView = () => {
  return (
    <main className="flex py-4 relative w-full shrink-0 custom-container gap-3 flex-1">
      <MyOrdersSidebar />
      <ProductsList />
    </main>
  )
}

export default OrdersView
