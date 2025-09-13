import Image from 'next/image'
import { useState } from 'react'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { Button, FormInstance } from 'antd'
import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

import { API_HOST } from '@/config'
import { getCategoriesWeb } from '../services'

import FilterForm from '@/components/shared/filter-form'
import ViewTypeButton from '@/views/search/components/view-type-button'

import SettingsOutlineIcon from '@/components/icons/settings-outline'
import Category2OutlineIcon from '@/components/icons/category-2-outline'
import ArrowRightOutlineIcon from '@/components/icons/arrow-right-outline'

import type { FC } from 'react'

const MenuSidebar: FC<{ form: FormInstance<Record<string, any>> | undefined }> = ({ form }) => {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { replace, query } = useRouter()
  const [isFilter, setIsFilter] = useState(false)

  const { data: categories } = useQuery({
    queryKey: ['categories-web'],
    queryFn: () => getCategoriesWeb(),
  })

  const toggleMenu = (
    id: string,
    level: 'category' | 'subcategory' | 'grandcategory',
    hasChildren: boolean
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(level)

    if (current === id) {
      params.delete(level)
    } else {
      params.set(level, id)
    }

    if (level === 'category') {
      replace(
        {
          pathname: '/catalog',
          query:
            query.category === id
              ? undefined
              : queryString.stringify({ category: id, productId: undefined }),
        },
        undefined,
        {
          scroll: false,
        }
      )
    }
    if (level === 'subcategory') {
      replace(
        {
          pathname: '/catalog',
          query: queryString.stringify({
            ...query,
            subcategory: query.subcategory === id ? undefined : id,
            grandcategory: undefined,
            productId: undefined,
          }),
        },
        undefined,
        {
          scroll: false,
        }
      )
    }
    // if (level === 'grandcategory') {
    //   replace(
    //     {
    //       pathname: '/catalog',
    //       query: queryString.stringify({ ...query, grandcategory: id, productId: undefined }),
    //     },
    //     undefined,
    //     {
    //       scroll: false,
    //     }
    //   )
    // }

    return hasChildren
  }

  const isOpen = (id: string, level: 'category' | 'subcategory' | 'grandcategory') =>
    searchParams.get(level) === id

  const isActive = (id: string, level: 'category' | 'subcategory' | 'grandcategory') =>
    searchParams.get(level) === id

  return (
    <div
      className={twMerge(
        'w-[315px] shrink-0 max-h-[calc(100vh-141px)] rounded-xl h-auto dark:border-dborder border border-transparent flex flex-col overflow-hidden sticky top-[125px] p-2',
        isFilter ? 'bg-white dark:bg-dprimary' : 'bg-[#F4F7FD] dark:bg-dprimary'
      )}
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <span className="font-semibold text-black dark:text-white flex-1 line-clamp-1">
          {t('view-style')}
        </span>
        <Button
          color="default"
          variant="filled"
          icon={isFilter ? <Category2OutlineIcon /> : <SettingsOutlineIcon />}
          className="text-[20px] bg-white dark:bg-dsecondary dark:text-white dark:border-dborder border border-secondary-light/20"
          onClick={() => setIsFilter((prev) => !prev)}
        />
        {queryString.stringify(query).length ? <ViewTypeButton white /> : null}
      </div>
      {isFilter ? (
        <FilterForm removeCategory form={form} />
      ) : (
        <ul className="flex flex-col gap-2 h-[calc(100vh-141px)] overflow-auto pb-6">
          {categories?.results?.map((parent) => (
            <li
              key={parent.id}
              className={
                isOpen(parent.id + '', 'category') && parent.children?.length
                  ? 'bg-primary-light rounded-lg dark:bg-dsecondary'
                  : ''
              }
            >
              <button
                onClick={() => toggleMenu(parent.id + '', 'category', !!parent.children?.length)}
                className={`w-full inline-flex dark:text-white gap-2 items-center text-sm text-left p-2 rounded-lg duration-150 ${
                  isActive(parent.id + '', 'category')
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-dsecondary hover:bg-primary-light/40'
                }`}
              >
                <div className="size-[40px] shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={API_HOST + parent.image_url}
                    width={50}
                    height={50}
                    alt="image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="flex-1">{parent.name}</span>
                {parent?.children?.length ? (
                  <ArrowRightOutlineIcon
                    className={`${isOpen(parent.id + '', 'category') ? 'rotate-90' : ''}`}
                  />
                ) : null}
              </button>
              {isOpen(parent.id + '', 'category') && parent.children?.length && (
                <ul className="flex flex-col gap-1 p-2">
                  {parent.children.map((child) => (
                    <li key={child.id}>
                      <button
                        onClick={() =>
                          toggleMenu(child.id + '', 'subcategory', !!child.children?.length)
                        }
                        className={`w-full inline-flex items-center gap-2 text-left text-sm p-2 rounded-lg duration-150 ${
                          isActive(child.id + '', 'subcategory')
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-dprimary dark:text-white'
                        }`}
                      >
                        <span className="flex-1">{child.name}</span>
                        {/* {child.children?.length ? (
                        <ArrowRightOutlineIcon
                          className={`${isOpen(child.id + '', 'subcategory') ? 'rotate-90' : ''}`}
                        />
                      ) : null} */}
                      </button>
                      {/* {isOpen(child.id + '', 'subcategory') && child.children?.length ? (
                      <ul className="ml-4 mt-1">
                        {child.children.map((subchild) => (
                          <li key={subchild.id}>
                            <button
                              onClick={() => toggleMenu(subchild.id + '', 'grandcategory', false)}
                              className={`w-full text-left p-2 rounded-lg duration-150 ${
                                isActive(subchild.id + '', 'grandcategory')
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-400'
                              }`}
                            >
                              {subchild.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null} */}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MenuSidebar
