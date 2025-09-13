import api from '@/services/axios'

import type { IFavorite } from '../types'
import type { IListResponse } from '@/types'

export async function getFavorites(params: any): Promise<IListResponse<IFavorite>> {
  const res: IListResponse<IFavorite> = await api({
    url: `/clients/favourites`,
    method: 'get',
    params,
  })

  return res
}
