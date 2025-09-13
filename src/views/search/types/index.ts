import type { IBrand } from '@/types'

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
  title_slug: string
  vendor_code: string
  nds: string
  loaderKey?: 'loader'
  price: number
  price_discount: number
  retailer_price: number
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

interface IOrganization {
  id: number
  name: string
}

interface ICategory {
  id: number
  name: string
  name_slug: string
  image_url: string
  children: boolean
  parent: number
}

interface IGetProductsParams {
  brands?: string
  categories?: string
  order_by: string
  organization_id?: string
  price_from?: number
  price_to?: number
  title?: string
  page?: number
  page_size?: number
  productId?: undefined
  subcategory?: undefined
  category?: undefined
  grandcategory?: undefined
}

interface IMadeIn {
  id: number
  name: string
}

export type { IOrganization, ICategory, IGetProductsParams, IProduct }
