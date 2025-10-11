import api from './axios'

import type {
  IBrand,
  IChatHistory,
  IChatResponse,
  IContractor,
  ICount,
  IListResponse,
  ISessionKeyResponse,
} from '@/types'

export const getSessionKey = async (): Promise<ISessionKeyResponse> => {
  const res: ISessionKeyResponse = await api({
    url: '/clients/session_key',
    method: 'get',
  })

  return res
}

export async function addToFav(data: { product_id: number }) {
  const res = await api({
    url: '/clients/favourites',
    method: 'post',
    data,
  })

  return res
}

export async function removeFromFav(id: number) {
  const res = await api({
    url: `/clients/favourites/${id}`,
    method: 'delete',
  })

  return res
}

export const getCounts = async (): Promise<ICount> => {
  const res: ICount = await api({
    url: '/clients/counts',
    method: 'get',
  })

  return res
}

export async function getBrands(params?: {
  page?: number
  page_size?: number
  organization_id?: number | undefined
  date?: string | undefined
}): Promise<IListResponse<IBrand>> {
  const res: IListResponse<IBrand> = await api({
    url: '/clients/brands',
    method: 'get',
    params,
  })

  return res
}

export const getContractor = async (productId: number): Promise<IContractor> => {
  const res: IContractor = await api({
    url: `/clients/products/${productId}/contractor`,
    method: 'get',
  })

  return res
}

export const sendMessage = async (data: { query: string; user_id: number | string }) => {
  const res: IChatResponse = await api({
    url: 'https://ai.hoomo.uz/agent/chat',
    method: 'post',
    data,
  })

  return res
}

export const getChatHistory = async (params: {
  user_id: number | string
  company_id?: number
  page: number
  page_size: number
}): Promise<IChatHistory[]> => {
  const res: IChatHistory[] = await api({
    url: `https://ai.hoomo.uz/chat/history`,
    method: 'get',
    params,
  })

  return res
}

export const deleteChatHistory = async (params: {
  user_id: number | string
  company_id: number
}) => {
  const res: IChatResponse = await api({
    url: 'https://ai.hoomo.uz/chat/history',
    method: 'delete',
    params,
  })

  return res
}
