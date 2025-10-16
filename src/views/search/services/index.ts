import api from '@/services/axios'

import type { IListResponse } from '@/types'
import type { ICategory, IGetProductsParams, IOrganization } from '../types'
import { IProduct } from '@/views/shopping-cart/types'

export const getOrganizations = async (params?: any): Promise<IListResponse<IOrganization>> => {
  const res: IListResponse<IOrganization> = await api({
    url: '/clients/organizations',
    method: 'get',
    params,
  })

  return res
}

export async function getProducts(params: IGetProductsParams): Promise<IListResponse<IProduct>> {
  const res: IListResponse<IProduct> = await api({
    url: '/clients/products/search',
    method: 'get',
    params,
  })

  return res
}

export async function getProduct(slug: string, token?: string): Promise<IProduct> {
  const headers: Record<string, string> = {}

  if (token) {
    headers['Device-Token'] = `Mirel ${token}`
  }

  const res: IProduct = await api({
    url: `/clients/products/product/${slug}`,
    method: 'get',
    headers,
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
