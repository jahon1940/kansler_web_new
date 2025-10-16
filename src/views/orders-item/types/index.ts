import { IProduct } from '@/views/shopping-cart/types'

interface MyOrdersItem {
  id: number
  created_at: string
  price: number
  status: any
  agent: any
  organization_orders: IOrganizationOrder[]
}

interface IOrgOrder {
  id: number
  product: IProduct
  name: string
  vendor_code: string
  barcode: string[]
  quantity: number
  price: number
  total_price: number
}

interface IOrganizationOrder {
  id: number
  organization: Organization
  address: Address
  status: string
  price: number
  invoice: any
  rating?: number
}

interface Organization {
  id: number
  name: string
}

interface Address {
  id: number
  organization: Organization2
  name: string
  phone_numbers: string
  manager: Manager
  agent: Agent
  latitude: any
  longitude: any
  region: string
  active: boolean
}

interface Organization2 {
  id: number
  name: string
}

interface Manager {
  id: number
  name: string
  full_name: string
  phone: string
}

interface Agent {
  id: number
  name: string
  full_name: string
  phone: string
}

export type { MyOrdersItem, IOrganizationOrder, IOrgOrder }
