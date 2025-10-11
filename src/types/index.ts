interface IListResponse<T> {
  page_number: number
  page_size: number
  total_pages: number
  count: number
  next: any
  previous: any
  results: T[]
}

interface ISessionKeyResponse {
  session_key: string
}

interface IError {
  error_code: string
  message: string
}

interface ICount {
  favorite_products: number
  cart_products: number
}

interface IContractor {
  id: number
  title: string
  contractor: Contractor[]
}

interface Contractor {
  stock: Stock
  quantity: number
  quantity_reserve: number
}

interface Stock {
  id: number
  name: string
  address: string
  phone_number: string
  longitude: number
  latitude: number
}

type IChatResponse = {
  llm_answer: string
  products: IChatProduct[]
}

type IChatProduct = {
  id: number
  name: string
  price: string
  image_url: string
  description: string
  category: string
  vendor_code: string
  brand: string
}

interface IChatHistory {
  id: number
  session_id: string
  type: string
  content: string
}

interface IBrand {
  id: number
  name: string
  image_url: string
  is_ordered: boolean
}

export type {
  IListResponse,
  IError,
  ICount,
  IContractor,
  IChatResponse,
  IChatHistory,
  IBrand,
  ISessionKeyResponse,
}
