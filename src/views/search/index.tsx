import { Form } from 'antd'

import ProductsList from './containers/products-list'
import FilterSidebar from './containers/filter-sidebar'

const SearchView = () => {
  const [form] = Form.useForm()

  return (
    <main className="flex py-4 relative w-full shrink-0 custom-container gap-3 flex-1">
      <FilterSidebar form={form} />
      <ProductsList form={form} />
    </main>
  )
}

export default SearchView
