import api from '@/services/axios'

import type { IListResponse } from '@/types'
import type { ICategory, IOrder, IOrderParams, IOrganization } from '../types'

export const getOrganizations = async (params?: any): Promise<IListResponse<IOrganization>> => {
  const res: IListResponse<IOrganization> = await api({
    url: '/clients/organizations',
    method: 'get',
    params,
  })

  return res
}

export async function getMyOrders(params: IOrderParams): Promise<IListResponse<IOrder>> {
  const res: IListResponse<IOrder> = await api({
    url: '/clients/orders',
    method: 'get',
    params,
  })

  return res
}

export async function getCategories(params?: any): Promise<IListResponse<ICategory>> {
  const res: IListResponse<ICategory> = await api({
    url: '/clients/categories',
    method: 'get',
    params,
  })

  return res
}
