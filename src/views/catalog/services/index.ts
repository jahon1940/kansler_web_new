import api from '@/services/axios'

import type { IListResponse } from '@/types'
import type { IOrganization } from '../types'
import type { ICategory } from '@/views/search/types'

export const getCategoriesWeb = async (params?: any): Promise<IListResponse<IOrganization>> => {
  const res: IListResponse<IOrganization> = await api({
    url: '/clients/categories/web',
    method: 'get',
    params,
  })

  return res
}

export const getSubcategoryChildren = async (id?: any): Promise<IListResponse<ICategory>> => {
  const res: IListResponse<ICategory> = await api({
    url: `/clients/categories/${id}/children`,
    method: 'get',
  })

  return res
}
