import api from '@/services/axios'

import type { IListResponse } from '@/types'
import type {
  ICartProduct,
  ICartTotalAmount,
  ICategory,
  IGetProductsParams,
  IOrderBodyData,
  IOrderResponse,
  IOrganization,
} from '../types'

export const getOrganizations = async (params?: any): Promise<IListResponse<IOrganization>> => {
  const res: IListResponse<IOrganization> = await api({
    url: '/clients/organizations',
    method: 'get',
    params,
  })

  return res
}

export async function getCartProducts(
  params: IGetProductsParams
): Promise<IListResponse<ICartProduct>> {
  const res: IListResponse<ICartProduct> = await api({
    url: '/clients/cart/cart-products',
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

export async function getCartTotalAmount(params?: any): Promise<ICartTotalAmount> {
  const res: ICartTotalAmount = await api({
    url: '/clients/cart',
    method: 'get',
    params,
  })

  return res
}

export async function deleteFromCart(productId: number) {
  const res = await api({
    url: `/clients/cart/cart-products/${productId}`,
    method: 'delete',
  })

  return res
}

export async function addToCart(data: { product_id: number; quantity: number }) {
  const res = await api({
    url: `/clients/cart/cart-products`,
    method: 'post',
    data,
  })

  return res
}

export async function createOrder(data: IOrderBodyData) {
  const res: IOrderResponse = await api({
    url: `/clients/orders`,
    method: 'post',
    data,
  })

  return res
}
