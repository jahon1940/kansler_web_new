import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { FormInstance } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const FilterForm = dynamic(() => import('@/components/shared/filter-form'), { ssr: false })

import ViewTypeButton from '../components/view-type-button'

import type { FC } from 'react'

const FilterSidebar: FC<{ form: FormInstance<Record<string, any>> | undefined }> = ({ form }) => {
  const { query } = useRouter()
  const { t } = useTranslation('common')

  const orderByOptions = [
    { value: 'created_at', label: t('order-by-options.created_at') },
    { value: 'alfabetic', label: t('order-by-options.alfabetic') },
    { value: 'price', label: t('order-by-options.price') },
    { value: '-price', label: t('order-by-options.-price') },
    { value: 'promotion', label: t('order-by-options.promotion') },
    { value: 'discount', label: t('order-by-options.discount') },
    { value: 'new', label: t('order-by-options.new') },
    { value: 'bestseller', label: t('order-by-options.bestseller') },
    { value: 'latest', label: t('order-by-options.latest') },
    { value: 'category_group', label: t('order-by-options.category_group') },
  ]

  useEffect(() => {
    form?.setFieldsValue({ order_by: orderByOptions[0].value, ...query })
  }, [query])

  return (
    <div className="bg-white shrink-0 w-[315px] dark:bg-dprimary sticky h-[calc(100vh-141px)] top-[125px] rounded-xl flex flex-col overflow-hidden p-2">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-black dark:text-white">{t('view-style')}</span>
        <ViewTypeButton />
      </div>
      <FilterForm form={form} />
    </div>
  )
}

export default FilterSidebar
