import { Form } from 'antd'
import { useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import FilterSidebar from './filter-sidebar'
import ProductsList from './products-list'
import CloseSquareOutlineIcon from '@/components/icons/close-square-outline'

const SearchLayout = () => {
  const [form] = Form.useForm()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {isDesktop ? (
        <FilterSidebar form={form} />
      ) : (
        <>
          <div className="fixed right-4 bottom-16 z-[1]">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg bg-primary text-white px-4 py-2 font-medium"
            >
              Фильтры
            </button>
          </div>

          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
              <div className="w-fit bg-white dark:bg-dprimary h-full rounded-l-xl overflow-y-auto p-3">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-black dark:text-white">Фильтры</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-black hover:text-black dark:hover:text-white"
                  >
                    <CloseSquareOutlineIcon className="text-[24px]" />
                  </button>
                </div>
                <FilterSidebar form={form} />
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex-1">
        <ProductsList form={form} />
      </div>
    </div>
  )
}

export default SearchLayout
