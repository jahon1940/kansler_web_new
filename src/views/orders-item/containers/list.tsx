import { Skeleton, Table } from 'antd'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { InView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getOrgOrders } from '../services'
import { formatAmount } from '@/utils/format-amount'

import Loader from '@/components/shared/loader'
import BrandTableRow from '@/views/shopping-cart/components/brand-table-row'
import NoProductsFound from '@/views/shopping-cart/components/no-products-found'
import ProductsTableCard from '@/views/shopping-cart/components/products-table-card'
import ClickableTableRow from '@/views/shopping-cart/components/clickable-table-row'

// import CartInputStepper from '@/components/shared/cart-input-stepper'

import type { IListResponse } from '@/types'
import type { ColumnsType } from 'antd/es/table'
import type { ICartProduct } from '@/views/shopping-cart/types'

const MyOrgOrdersList = () => {
  const { t } = useTranslation('common')
  const { query } = useRouter()

  const {
    data: orders,
    fetchNextPage,
    // isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage: IListResponse<ICartProduct>) => {
      const page = lastPage?.next ? queryString.parseUrl(lastPage?.next)?.query?.page : null

      if (page) {
        return Number(page)
      }

      return null
    },
    queryKey: ['org-orders', query.page, query.page_size, query.org_order],
    queryFn: ({ pageParam }) =>
      getOrgOrders({
        id: query.org_order,
        page_size: 20,
        page: pageParam as number,
      }) as any,
    enabled: Boolean(query.org_order),
  })

  const content = orders?.pages.flatMap((page) => page?.results)

  const columns: ColumnsType<ICartProduct> = [
    {
      title: t('fields:title.label'),
      dataIndex: 'title',
      key: 'title',
      className: 'text-[12px] p-2 dark:text-white',
      render: (_: string, record: ICartProduct) => {
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

        return (
          <ProductsTableCard
            {...(record?.product?.id
              ? record?.product
              : { ...record?.product, title: record?.name, vendor_code: record?.vendor_code })}
          />
        )
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

        return <BrandTableRow {...record?.product} />
      },
    },

    {
      width: 120,
      key: 'count',
      dataIndex: 'count',
      className: 'text-[12px] p-2 dark:text-white text-center',
      title: t('fields:quantity.label'),
      render: (_: string, record: ICartProduct) => {
        if (record.loaderKey === 'loader') {
          return (
            <div className="flex flex-col gap-2">
              <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
              <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
            </div>
          )
        }

        return record?.quantity + ' ' + record.product?.measure
      },
    },
    {
      width: 120,
      key: 'price',
      dataIndex: 'price',
      className: 'text-[12px] p-2 dark:text-white text-center',
      title: t('fields:price.label'),
      render: (_, record: ICartProduct) => {
        if (record.loaderKey === 'loader') {
          return <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
        }

        return (
          <div className="text-center items-center flex flex-col font-semibold">
            <span className="text-[16px]">
              {formatAmount(record?.product?.price)}{' '}
              <span className="text-[12px]">{t('common:uzs')}</span>
            </span>
            {/* {isSignedIn && record?.product?.price_discount !== 0 ? (
              <span className="text-secondary-light line-through">
                {formatAmount(record?.product?.price)}
                {t('common:uzs')}
              </span>
            ) : null}

            <span className="text-black">
              {formatAmount(
                isSignedIn && record?.product?.price_discount !== 0
                  ? record?.product?.price_discount
                  : record?.product?.price
              )}{' '}
              {t('common:uzs')}
            </span> */}
          </div>
        )
      },
    },
    {
      width: 120,
      key: 'total_price',
      dataIndex: 'total_price',
      className: 'text-[12px] p-2 dark:text-white text-center',
      title: t('fields:total.label'),
      render: (_, record: ICartProduct) => {
        if (record.loaderKey === 'loader') {
          return <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
        }

        return (
          <div className="text-center items-center flex flex-col font-semibold">
            <span className="text-[16px]">
              {formatAmount(record?.price)} <span className="text-[12px]">{t('common:uzs')}</span>
            </span>

            {/* {isSignedIn && record?.product?.price_discount !== 0 ? (
              <span className="text-secondary-light line-through">
                {formatAmount(record?.product?.price)}
                {t('common:uzs')}
              </span>
            ) : null}

            <span className="text-black">
              {formatAmount(
                isSignedIn && record?.product?.price_discount !== 0
                  ? record?.product?.price_discount
                  : record?.product?.price
              )}{' '}
              {t('common:uzs')}
            </span> */}
          </div>
        )
      },
    },
  ]

  const dataSource =
    content && content.length
      ? [...content, hasNextPage ? { loaderKey: 'loader' } : null].filter(Boolean)
      : []

  if (content?.length === 0) {
    return <NoProductsFound />
  }

  return (
    <div className="flex flex-col duration-200 flex-1 h-auto rounded-xl">
      {isLoading ? (
        <div className="w-full flex-1 flex items-center justify-center">
          <Loader />
        </div>
      ) : null}

      {content && content?.length > 0 ? (
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
          className="h-full dark:[&_th]:bg-dsecondary [&_td]:border-2 [&_th]:border-2 [&_thead]:sticky [&_thead]:top-[109px] [&_thead]:z-[1] dark:[&_.ant-table-container]:border-dborder dark:[&_th]:!border-dborder dark:[&_td]:!border-dborder"
        />
      ) : null}
    </div>
  )
}

export default MyOrgOrdersList
