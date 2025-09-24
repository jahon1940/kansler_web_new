import api from '@/services/axios'

import type { IPoster } from '../types'
import type { IListResponse } from '@/types'
import type { IProduct } from '@/views/search/types'

export const getPostersItem = async (id?: number | string): Promise<IPoster> => {
  const res: IPoster = await api({
    url: `/clients/posters/${id}`,
    method: 'get',
  })

  return res
}

export const getPostersItemProducts = async ({
  id,
  ...params
}: any): Promise<IListResponse<IProduct>> => {
  const res: IListResponse<IProduct> = await api({
    url: `/clients/posters/${id}/products`,
    method: 'get',
    params,
  })

  return res
}
