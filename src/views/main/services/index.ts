import api from '@/services/axios'

import type { IAdminStory, IPoster } from '../types'
import type { IListResponse } from '@/types'
import { IProduct } from '@/views/shopping-cart/types'

export const getPosters = async (params?: any): Promise<IListResponse<IPoster>> => {
  const res: IListResponse<IPoster> = await api({
    url: '/clients/posters',
    method: 'get',
    params,
  })

  return res
}

export const getPopular = async (params?: any): Promise<IListResponse<IProduct>> => {
  const res: IListResponse<IProduct> = await api({
    url: '/clients/products/popular',
    method: 'get',
    params,
  })

  return res
}

export const getPromotions = async (params?: any): Promise<IListResponse<IProduct>> => {
  const res: IListResponse<IProduct> = await api({
    url: '/clients/products/discount',
    method: 'get',
    params,
  })

  return res
}

export const getBestsellers = async (params?: any): Promise<IListResponse<IProduct>> => {
  const res: IListResponse<IProduct> = await api({
    url: '/clients/products/hit',
    method: 'get',
    params,
  })

  return res
}

export const getNewArrivals = async (params?: any): Promise<IListResponse<IProduct>> => {
  const res: IListResponse<IProduct> = await api({
    url: '/clients/products/latest',
    method: 'get',
    params,
  })

  return res
}

export const getAdminStories = async (params?: any): Promise<IListResponse<IAdminStory>> => {
  const res: IListResponse<IAdminStory> = await api({
    url: '/clients/admin-stories/',
    method: 'get',
    params,
  })

  return res
}

export const getStories = async (params?: any): Promise<IListResponse<IAdminStory>> => {
  const res: IListResponse<IAdminStory> = await api({
    url: '/clients/stories/',
    method: 'get',
    params,
  })

  return res
}
