import api from '@/services/axios'

import type { IListResponse } from '@/types'
import type { IAddress, IBonus, IContract, ICurrent, IDebt, ILimit, IPayment } from '../types'

export async function getAuthCurrent(): Promise<ICurrent> {
  const res: ICurrent = await api({
    url: '/clients/auth/current',
    method: 'get',
  })

  return res
}

export async function getCompaniesChildren(): Promise<IListResponse<ICurrent>> {
  const res: IListResponse<ICurrent> = await api({
    url: '/clients/companies/children',
    method: 'get',
  })

  return res
}

export async function getCompanyLimits(id: number | string): Promise<IListResponse<ILimit>> {
  const res: IListResponse<ILimit> = await api({
    url: `/clients/companies/${id}/limit`,
    method: 'get',
  })

  return res
}

export async function getCompanyBonuses(id: number | string): Promise<IListResponse<IBonus>> {
  const res: IListResponse<IBonus> = await api({
    url: `/clients/companies/${id}/bonus`,
    method: 'get',
  })

  return res
}

export async function getCompanyAddresses(id: number | string): Promise<IListResponse<IAddress>> {
  const res: IListResponse<IAddress> = await api({
    url: `/clients/companies/${id}/addresses`,
    method: 'get',
  })

  return res
}

export async function getCompanyContracts(id: number | string): Promise<IListResponse<IContract>> {
  const res: IListResponse<IContract> = await api({
    url: `/clients/companies/${id}/contracts`,
    method: 'get',
  })

  return res
}

export async function getCompanyDebts(
  companyId: any,
  contractId: any
): Promise<IListResponse<IDebt>> {
  const res: IListResponse<IDebt> = await api({
    url: `/clients/companies/${companyId}/contracts/${contractId}/debts`,
    method: 'get',
  })

  return res
}

export async function getCompanyPayment(
  companyId: any,
  contractId: any
): Promise<IListResponse<IPayment>> {
  const res: IListResponse<IPayment> = await api({
    url: `/clients/companies/${companyId}/contracts/${contractId}/payment`,
    method: 'get',
  })

  return res
}
