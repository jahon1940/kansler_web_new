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

export type { IOrganization, ICategory, IGetProductsParams }
