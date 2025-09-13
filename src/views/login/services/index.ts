import api from '@/services/axios'

import type { ILoginBody, ILoginResponse } from '../types'

export async function login(data: ILoginBody): Promise<ILoginResponse> {
  const res: ILoginResponse = await api({
    url: '/clients/auth/login',
    method: 'post',
    data,
  })

  return res
}
