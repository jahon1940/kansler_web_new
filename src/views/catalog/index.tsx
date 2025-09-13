import { Form } from 'antd'

import MenuSidebar from './containers/menu-sidebar'
import ProductsList from './containers/products-list'

const CatalogView = () => {
  const [form] = Form.useForm()

  return (
    <main className="flex py-4 custom-container w-full gap-3 h-full flex-1">
      <MenuSidebar form={form} />
      <ProductsList form={form} />
    </main>
  )
}

export default CatalogView
