import Link from 'next/link'
import { useState } from 'react'
import queryString from 'query-string'
import { Button, Dropdown } from 'antd'
import { useQuery } from '@tanstack/react-query'

import { API_HOST } from '@/config'
import { ROUTES } from '@/constants'
import { getCategoriesWeb } from '@/views/catalog/services'

import CImage from '../ui/cimage'

export default function CatalogPopup() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  const { data: categories2 } = useQuery({
    queryKey: ['categories-web'],
    queryFn: () => getCategoriesWeb(),
  })

  const activeCategoryData = categories2?.results?.find((c) => c.id === activeCategory)

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomLeft"
      dropdownRender={() => (
        <div className="flex w-[950px] border h-[70vh] bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-fit shrink-0 overflow-y-auto border-r border-gray-200">
            {categories2?.results?.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  activeCategory === cat.id ? 'bg-gray-100' : ''
                }`}
                onMouseEnter={() => setActiveCategory(cat.id)}
              >
                <CImage
                  width={150}
                  height={150}
                  className="size-10 rounded-lg overflow-hidden shrink-0"
                  alt={cat.name}
                  src={API_HOST + cat?.image_url}
                />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {activeCategory ? (
              <div>
                <h3 className="font-semibold mb-3 text-[18px]">{activeCategoryData?.name}</h3>
                <ul className="grid grid-cols-2 gap-4">
                  {activeCategoryData?.children?.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={
                          ROUTES.SEARCH +
                          `?order_by=created_at&page=1&categories=${sub.parent}&subcategory=${sub.id}`
                        }
                        className="text-secondary-light hover:text-secondary"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}

                  {!activeCategoryData?.children?.length ? (
                    <li>
                      <Link
                        href={
                          ROUTES.SEARCH +
                          `?${queryString.stringify(
                            {
                              order_by: 'created_at',
                              page: 1,
                              categories: activeCategoryData?.parent
                                ? activeCategoryData?.parent
                                : activeCategoryData?.id,
                              subcategory: activeCategoryData?.parent
                                ? activeCategoryData?.id
                                : null,
                            },
                            { skipNull: true }
                          )}`
                        }
                        className="text-secondary-light hover:text-secondary"
                      >
                        {activeCategoryData?.name}
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400">Выберите категорию</p>
            )}
          </div>
        </div>
      )}
    >
      <Button type="primary">Каталог</Button>
    </Dropdown>
  )
}
