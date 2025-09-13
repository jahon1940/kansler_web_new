import dayjs from 'dayjs'
import Link from 'next/link'
import { Button } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

import { getMyOrdersItem } from './services'

import OrdersItemSidebar from './containers/sidebar'
import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'
import MyOrgOrdersList from './containers/list'

const OrdersItemView = () => {
  const { query } = useRouter()

  const { data: orders } = useQuery({
    queryKey: ['orders', query.orderId],
    queryFn: () => getMyOrdersItem(query.orderId as string),
  })

  return (
    <div className="flex flex-col py-4 relative w-full shrink-0 custom-container gap-3 flex-1">
      <div className="w-full">
        <div className="flex items-center mb-2 gap-4">
          <Link href={'/orders'}>
            <Button
              icon={<ArrowLeftOutlineIcon />}
              className="dark:bg-dprimary dark:border-dprimary dark:text-white"
            />
          </Link>
          <h1 className="text-2xl dark:text-white font-semibold">
            Заказ № {orders?.id} от {dayjs(orders?.created_at).format('DD.MM.YYYY, HH:mm')}{' '}
          </h1>
        </div>
      </div>
      <main className="flex relative w-full shrink-0 gap-3 flex-1">
        <OrdersItemSidebar />
        <MyOrgOrdersList />
      </main>
    </div>
  )
}

export default OrdersItemView
