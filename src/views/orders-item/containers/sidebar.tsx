import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

import { getMyOrdersItem } from '../services'

import OrgOrderCard from '../components/org-order-card'

const OrdersItemSidebar = () => {
  const { query } = useRouter()

  const { data: orders } = useQuery({
    queryKey: ['orders', query.orderId],
    queryFn: () => getMyOrdersItem(query.orderId as string),
  })

  return (
    <div className="bg-white dark:bg-dprimary w-[315px] top-[125px] h-[calc(100vh-201px)] sticky gap-3 rounded-xl flex flex-col overflow-auto p-2">
      <h1 className="my-2 pl-3 text-[16px] dark:text-white font-semibold">Заказы по поставщикам</h1>
      <div className="flex flex-col gap-3 overflow-auto">
        {orders?.organization_orders.map((order, i) => <OrgOrderCard key={i} {...order} />)}
      </div>
    </div>
  )
}

export default OrdersItemSidebar
