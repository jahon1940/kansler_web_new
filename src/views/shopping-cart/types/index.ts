import type { IBrand } from '@/types'

interface ICartProduct {
  id: number
  product: IProduct
  quantity: number
  price: number
  price_discount: number
  name: string
  vendor_code: string
  barcode: string[]
  total_price: number
  loaderKey?: 'loader'
}

interface IProduct {
  id: number
  organization: IOrganization
  category: ICategory
  brand: IBrand
  made_in: IMadeIn
  classifier_code: string
  classifier_title: string
  packagename: string
  packagecode: string
  title: string
  vendor_code: string
  nds: string
  loaderKey?: 'loader'
  price: number
  price_discount: number
  measure: string
  description: string
  actual: boolean
  bestseller: boolean
  discount: boolean
  promotion: boolean
  stop_list: boolean
  min_box_quantity: number
  quantity_in_box: string
  max_quantity: number
  pre_order: string
  barcode: string[]
  arrival_date: string
  weight: number
  size: string
  image_url: string
  in_fav: boolean
  in_cart: boolean
  has_comment: boolean
  stocks: string
  contractor: {
    stock: {
      id: number
      name: string
      address: string
      phone_number: string
      longitude: string
      latitude: string
    }
    quantity: number
    quantity_reserve: number
  }
}

interface ICartTotalAmount {
  price: number
  price_discount: number
}

interface IOrganization {
  id: number
  name: string
}

interface ICategory {
  id: number
  name: string
  image_url: string
  children: boolean
}

interface IGetProductsParams {
  page?: number
  page_size?: number
}

interface IMadeIn {
  id: number
  name: string
}

interface IOrderBodyData {
  company_id: number | undefined
  comment: string
  cart_product: any
}

interface IOrderResponse {
  id: number
  created_at: string
  price: number
  status: any
  agent: any
  organization_orders: OrganizationOrder[]
}

interface OrganizationOrder {
  id: number
  organization: Organization
  address: Address
  status: any
  price: number
  invoice: any
  rating: any
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

export type {
  IOrganization,
  ICategory,
  IGetProductsParams,
  IProduct,
  ICartTotalAmount,
  ICartProduct,
  IOrderBodyData,
  IOrderResponse,
}
