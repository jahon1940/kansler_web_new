interface ICurrent {
  id: number
  name: string
  full_name: string
  inn: string
  phone_numbers: any[]
  company_type: string
  is_address: boolean
  is_pos: boolean
  addresses: Address[]
  main_contacts: MainContact[]
  region: string
  manager: Manager
  children: boolean
}

interface ILimit {
  id: number
  company: Company
  organization: Organization
  total_limit: string
}

interface IBonus {
  id: number
  company: Company
  organization: Organization
  total_bonus: string
}

interface IAddress {
  id: number
  organization: Organization
  name: string
  phone_numbers: string
  manager: Manager
  agent: Agent
  latitude: any
  longitude: any
  region: string
  active: boolean
}

interface IContract {
  id: number
  name: string
  company: Company
  organization: Organization
  manager: Manager
  agent: Agent
}

interface IDebt {
  id: number
  company: Company
  organization: Organization
  contract: IContract
  total_debt: string
  pre_payment: string
  debt_15_days: string
  debt_16_45_days: string
  debt_46_60_days: string
  debt_61_90_days: string
  debt_91_120_days: string
  debt_over_120_days: string
}

interface IPayment {
  id: number
  organization: Organization
  company: Company
  contract: IContract
  number: string
  date: string
  amount: string
  loaderKey?: 'loader' | 'nothing'
}

export interface Agent {
  id: number
  name: string
  full_name: string
  phone: string
}

interface Company {
  id: number
  name: string
  full_name: string
  inn: string
  phone_numbers: any[]
  company_type: string
  main_contacts: MainContact[]
  region: string
  manager: Manager
  children: boolean
}

interface MainContact {
  name: string
  type: any
  phone: string
}

interface Manager {
  id: number
  name: string
  full_name: string
  phone: string
}

interface Organization {
  id: number
  name: string
}

interface Address {
  id: number
  name: string
  phone_numbers: string
  latitude: any
  longitude: any
  region: string
}

interface MainContact {
  name: string
  type: any
  phone: string
}

interface Manager {
  id: number
  name: string
  full_name: string
  phone: string
}

export type { ICurrent, ILimit, IBonus, IAddress, IContract, IDebt, IPayment }
