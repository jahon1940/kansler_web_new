import api from '@/services/axios'

import type { IOrgOrder, MyOrdersItem } from '../types'
import { IListResponse } from '@/types'

export async function getMyOrdersItem(id: number | string): Promise<MyOrdersItem> {
  const res: MyOrdersItem = await api({
    url: `/clients/orders/${id}`,
    method: 'get',
  })

  return res
}

export async function getOrgOrders({ id, ...params }: any): Promise<IListResponse<IOrgOrder>> {
  const res: IListResponse<IOrgOrder> = await api({
    url: `/clients/organization-orders/${id}/products`,
    method: 'get',
    params,
  })

  return res
}

export async function rateOrgOrder({
  id,
  ...data
}: {
  id: number | string
  organization_order_id: number
  rating: number | undefined
}): Promise<MyOrdersItem> {
  const res: MyOrdersItem = await api({
    url: `/clients/orders/${id}`,
    method: 'put',
    data,
  })

  return res
}
