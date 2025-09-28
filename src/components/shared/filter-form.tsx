import { useEffect } from 'react'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useQueries } from '@tanstack/react-query'
import { Button, Form, FormInstance, InputNumber, Space } from 'antd'

import { getBrands } from '@/services'
import { formatAmount } from '@/utils/format-amount'
import { getCategories } from '@/views/search/services'

import CSelect from '../ui/cselect'

import type { FC } from 'react'

interface IProps {
  form: FormInstance<Record<string, any>> | undefined
  removeCategory?: boolean
}

const FilterForm: FC<IProps> = ({ form, removeCategory }) => {
  const { t } = useTranslation('common')
  const { push, query, pathname } = useRouter()
  const organization_id = Form.useWatch('organization_id', form)

  const [
    { data: brands, isFetching: isBrandFetching },
    { data: categories, isFetching: isCategoryFetching },
  ] = useQueries({
    queries: [
      {
        queryKey: ['brands', organization_id],
        queryFn: () => getBrands({ page: 1, organization_id, page_size: 100 }),
      },
      { queryKey: ['categories'], queryFn: () => getCategories() },
    ],
  })

  const handleSubmit = (values: Record<string, any>) => {
    push({
      pathname,
      query: queryString.stringify(
        { ...query, ...values, product: null, page: 1 },
        { skipNull: true, skipEmptyString: true }
      ),
    })
  }

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

  const handleReset = () => {
    form?.resetFields()
    push({ pathname, query: queryString.stringify({ order_by: 'created_at', page: 1 }) })
  }

  useEffect(() => {
    form?.setFieldsValue({ order_by: orderByOptions[0].value, ...query })
  }, [query])

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ sortBy: 'date' }}
      className="flex flex-col gap-4 overflow-auto"
    >
      <Form.Item label={t('fields:brand.label')} name="brands">
        <CSelect
          loading={isBrandFetching}
          variant="filled"
          notFoundContent={null}
          placeholder={t('fields:brand.placeholder')}
          optionFilterProp="label"
          allowClear
          className="[&_.ant-select-selector]:border [&_.ant-select-selector]:border-secondary-light/20 dark:[&_.ant-select-selector]:bg-dsecondary"
          showSearch
          options={
            brands?.results?.map((val) => ({
              label: val.name,
              value: val.id + '',
            })) || []
          }
        />
      </Form.Item>

      {removeCategory ? null : (
        <Form.Item label={t('fields:category.label')} name="categories">
          <CSelect
            loading={isCategoryFetching}
            variant="filled"
            notFoundContent={null}
            placeholder={t('fields:category.placeholder')}
            allowClear
            className="[&_.ant-select-selector]:border dark:[&_.ant-select-selector]:bg-dsecondary [&_.ant-select-selector]:border-secondary-light/20"
            options={
              categories?.results?.map((val) => ({
                label: val.name,
                value: val.id + '',
              })) || []
            }
          />
        </Form.Item>
      )}

      <Form.Item label={t('fields:price.label')}>
        <Space.Compact>
          <Form.Item name="price_from" noStyle>
            <InputNumber
              variant="filled"
              controls={false}
              className="border border-secondary-light/20 dark:bg-dsecondary w-full"
              min={0}
              placeholder={t('fields:price_from.placeholder')}
              formatter={formatAmount}
              parser={(val) => (val ? (Number(val?.replace(/\s/g, '')) as 0 | 10000) : undefined)}
            />
          </Form.Item>
          <Form.Item
            name="price_to"
            noStyle
            dependencies={['price_from']}
            validateDebounce={1000}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const priceFrom = getFieldValue('price_from')
                  if (value === undefined || value === null || value === '' || value >= priceFrom) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(t('fields:price_to.validation')))
                },
              }),
            ]}
          >
            <InputNumber
              variant="filled"
              controls={false}
              min={0}
              className="border border-secondary-light/20 dark:bg-dsecondary w-full"
              placeholder={t('fields:price_to.placeholder')}
              formatter={formatAmount}
              parser={(val) => (val ? (Number(val?.replace(/\s/g, '')) as 0 | 10000) : undefined)}
            />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label={t('fields:order_by.label')} name="order_by">
        <CSelect
          loading={isCategoryFetching}
          variant="filled"
          notFoundContent={null}
          placeholder={t('fields:order_by.placeholder')}
          className="[&_.ant-select-selector]:border dark:[&_.ant-select-selector]:bg-dsecondary [&_.ant-select-selector]:border-secondary-light/20"
          options={orderByOptions}
        />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          color="default"
          variant="filled"
          className="border border-secondary-light/20 dark:bg-dsecondary dark:text-white"
          onClick={handleReset}
        >
          {t('actions:reset')}
        </Button>
        <Button type="primary" htmlType="submit">
          {t('actions:search')}
        </Button>
      </div>
    </Form>
  )
}

export default FilterForm
