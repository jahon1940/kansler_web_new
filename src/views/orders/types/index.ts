interface IOrder {
  id: number
  created_at: string
  price: number
  price_percent_1: number
  sent_from_1c: boolean
  status: any
  agent: any
  loaderKey?: string
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

interface IOrderParams {
  page?: number
  page_size?: number
}

export type { IOrganization, ICategory, IOrderParams, IOrder }
