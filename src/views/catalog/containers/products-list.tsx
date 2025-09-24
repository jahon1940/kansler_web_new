import { FormInstance, Skeleton, Table } from 'antd'
import { useCallback } from 'react'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { useTranslation } from 'next-i18next'
import { InView } from 'react-intersection-observer'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { Media } from '@/config/media-styles-config'
import { formatAmount } from '@/utils/format-amount'
import { getProducts } from '@/views/search/services'
import { getSubcategoryChildren } from '../services'
import useViewTypeStore from '@/views/search/store/use-view-type-store'

import useAuthStore from '@/store/auth-store'
import Loader from '@/components/shared/loader'
import CategoryChips from '../components/category-chips'
import ProductCard from '@/components/shared/product-card'
import MadeToOrder from '@/components/shared/made-to-order'
import CartInputStepper from '@/components/shared/cart-input-stepper'
// import CartInputStepper from '@/components/shared/cart-input-stepper'
import BrandTableRow from '@/views/search/components/brand-table-row'
import MeasureTableRow from '@/views/search/components/measure-table-row'
import NoProductsFound from '@/views/search/components/no-products-found'
import ProductsTableCard from '@/views/search/components/products-table-card'
import ClickableTableRow from '@/views/shopping-cart/components/clickable-table-row'

import type { FC } from 'react'
import type { IListResponse } from '@/types'
import type { ColumnsType } from 'antd/es/table'
import type { IProduct } from '@/views/search/types'

const ProductsList: FC<{ form: FormInstance<Record<string, any>> | undefined }> = ({ form }) => {
  const { t } = useTranslation('common')
  const { query } = useRouter()
  const isTableType = useViewTypeStore((store) => store.isTableType)
  const isSignedIn = useAuthStore((state) => state.isSignedIn)

  const categoryId = (query?.productId as string[])?.filter((val) => val !== 'categories').slice(-1)

  const {
    data: products,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage: IListResponse<IProduct>) => {
      const page = lastPage?.next ? queryString.parseUrl(lastPage?.next)?.query?.page : null

      if (page) {
        return Number(page)
      }

      return null
    },
    queryKey: [
      'products',
      query.brands,
      query.categories,
      query.order_by,
      query.organization_id,
      query.price_from,
      query.price_to,
      query.title,
      query.page,
      query.page_size,
      query.productId,
      query.category,
      query.grandcategory,
      query.subcategory,
    ],
    queryFn: ({ pageParam }) =>
      getProducts({
        order_by: 'created_at',
        page_size: 20,
        categories:
          query.grandcategory || query.subcategory || query.category || (categoryId as any),
        ...query,
        productId: undefined,
        grandcategory: undefined,
        category: undefined,
        subcategory: undefined,
        page: pageParam as number,
      }),
    enabled: Boolean(queryString.stringify(query).length),
  })

  const { data: subcategories } = useQuery({
    queryKey: ['subcategories', query.subcategory],
    queryFn: () => getSubcategoryChildren(query.subcategory as string),
    enabled: Boolean(query?.subcategory),
  })

  const content = products?.pages.flatMap((page) => page?.results)

  const columns: ColumnsType<IProduct> = [
    {
      title: t('fields:title.label'),
      dataIndex: 'title',
      key: 'title',
      className: 'text-[12px] p-2 dark:text-white',
      render: (_: string, record: IProduct) => {
        if (record.loaderKey === 'loader') {
          return (
            <div className="flex gap-2 items-center">
              <Skeleton.Avatar
                shape="square"
                className="rounded-lg overflow-hidden"
                size={75}
                active
              />
              <div className="flex flex-col gap-2">
                <Skeleton.Input active className="w-full rounded-lg h-[12px]" />
                <Skeleton.Input active className="w-full rounded-lg h-[12px]" />
              </div>
            </div>
          )
        }

        return <ProductsTableCard {...record} />
      },
    },
    {
      title: `${t('fields:organization.label')} / ${t('fields:brand.label')}`,
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
      className: 'text-[12px] p-2 dark:text-white',
      render: (_, record) => {
        if (record.loaderKey === 'loader') {
          return (
            <InView onChange={(val) => val && fetchNextPage()}>
              {({ ref }) => (
                <div ref={ref} className="flex flex-col gap-2">
                  <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
                  <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
                </div>
              )}
            </InView>
          )
        }

        return <BrandTableRow {...record} />
      },
    },
    {
      width: 120,
      key: 'measure',
      dataIndex: 'measure',
      className: 'text-[12px] p-2 dark:text-white',
      title: `${t('fields:quantity_in_box.label')} / ${t('fields:measure.label')}`,
      render: (_: string, record: IProduct) => {
        if (record.loaderKey === 'loader') {
          return (
            <div className="flex flex-col gap-2">
              <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
              <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
            </div>
          )
        }

        return <MeasureTableRow {...record} />
      },
    },
    {
      width: 120,
      key: 'price',
      dataIndex: 'price',
      className: 'text-[12px] p-2 text-center dark:text-white',
      title: t('fields:price.label'),
      render: (_, record: IProduct) => {
        if (record.loaderKey === 'loader') {
          return <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
        }

        return (
          <div className="text-center items-center flex flex-col font-semibold">
            {isSignedIn && record?.price_discount !== 0 ? (
              <span className="text-secondary-light line-through">
                {formatAmount(record?.price)}
                <span className="text-[12px]">{t('common:uzs')}</span>
              </span>
            ) : null}

            <span className="text-primary dark:text-white text-[16px]">
              {formatAmount(
                isSignedIn && record?.price_discount !== 0 ? record?.price_discount : record?.price
              )}{' '}
              <span className="text-[12px]">{t('common:uzs')}</span>
            </span>
          </div>
        )
      },
    },
    {
      width: 200,
      key: 'action',
      title: t('actions:action'),
      className: 'text-[12px] p-2 dark:text-white',
      render: (_, record) => {
        if (record.loaderKey === 'loader') {
          return <Skeleton.Input active className="max-w-[210px] w-full rounded-lg h-[38px]" />
        }

        if (isSignedIn) {
          return record.max_quantity > 0 ? (
            <CartInputStepper
              productId={record?.id}
              inCart={record?.in_cart}
              minQuantity={record?.min_box_quantity}
              isInStock={record?.max_quantity > 0}
            />
          ) : (
            <MadeToOrder />
          )
        }

        return null
      },
    },
  ]

  const dataSource =
    content && content.length
      ? [...content, hasNextPage ? { loaderKey: 'loader' } : null].filter(Boolean)
      : []

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (content?.length === 0) {
    return <NoProductsFound form={form} />
  }

  return (
    <div className={twMerge('flex flex-col duration-200 flex-1 h-auto rounded-xl')}>
      <CategoryChips />

      {content && content?.length > 0 && isTableType ? (
        <>
          <Media lessThan="md">
            <div className="flex flex-wrap gap-3">
              {content?.map((product, i) => <ProductCard fixedWidth key={i} {...product} />)}
              <InView onChange={(val) => val && loadMoreItems()}>
                {({ ref }) => (
                  <div ref={ref} className="text-center min-h-[20px] py-4 col-span-full">
                    {isFetchingNextPage ? <Loader /> : null}
                  </div>
                )}
              </InView>
            </div>
          </Media>
          <Media greaterThanOrEqual="md" className="h-full flex-1">
            <Table
              dataSource={dataSource}
              columns={columns as any}
              pagination={false}
              bordered
              components={{
                body: {
                  row: ClickableTableRow,
                },
              }}
              className={twMerge(
                'h-full [&_thead]:sticky dark:[&_th]:bg-dsecondary [&_td]:border-2 [&_th]:border-2 dark:[&_.ant-table-container]:border-dborder dark:[&_th]:border-dborder dark:[&_td]:!border-dborder [&_thead]:z-[1]',
                subcategories && subcategories?.count
                  ? '[&_thead]:top-[171px]'
                  : '[&_thead]:top-[109px]'
              )}
            />
          </Media>
        </>
      ) : null}
      {isLoading ? (
        <div className="w-full flex-1 flex items-center justify-center">
          <Loader />
        </div>
      ) : null}

      {!query?.category ? (
        <div className="dark:text-white text-black flex justify-center items-center flex-1">
          {t('common:choose-category')}
        </div>
      ) : null}

      {content && content?.length > 0 && !isTableType ? (
        <div className="flex flex-wrap gap-3">
          {content?.map((product, i) => <ProductCard fixedWidth key={i} {...product} />)}
          <InView onChange={(val) => val && loadMoreItems()}>
            {({ ref }) => (
              <div ref={ref} className="text-center min-h-[20px] py-4 col-span-full">
                {isFetchingNextPage ? <Loader /> : null}
              </div>
            )}
          </InView>
        </div>
      ) : null}
    </div>
  )
}

export default ProductsList
