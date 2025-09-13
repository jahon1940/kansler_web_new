import dayjs from 'dayjs'
import { Skeleton, Table } from 'antd'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { useTranslation } from 'next-i18next'
import { InView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getMyOrders } from '../services'
import { formatAmount } from '@/utils/format-amount'

import Loader from '@/components/shared/loader'
import NoOrdersFound from '../components/no-orders-found'
import ClickableTableRow from '../components/clickable-table-row'
// import CartInputStepper from '@/components/shared/cart-input-stepper'

import type { IOrder } from '../types'
import type { IListResponse } from '@/types'
import type { ColumnsType } from 'antd/es/table'

const ProductsList = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const {
    data: orders,
    fetchNextPage,
    // isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage: IListResponse<IOrder>) => {
      const page = lastPage?.next ? queryString.parseUrl(lastPage?.next)?.query?.page : null

      if (page) {
        return Number(page)
      }

      return null
    },
    queryKey: ['orders', query.page, query.page_size],
    queryFn: ({ pageParam }) =>
      getMyOrders({
        page_size: 30,
        page: pageParam as number,
      }),
    // enabled: Boolean(queryString.stringify(query).length),
  })

  const content = orders?.pages.flatMap((page) => page?.results)

  const columns: ColumnsType<IOrder> = [
    {
      title: t('fields:order.label'),
      dataIndex: 'id',
      key: 'id',
      className: 'text-[14px] p-2 text-center dark:text-white',
      render: (val, record) => {
        if (record.loaderKey === 'loader') {
          return (
            <InView onChange={(val) => val && fetchNextPage()}>
              {({ ref }) => (
                <div ref={ref} className="flex justify-center">
                  <Skeleton.Input active className="w-[50%] rounded-lg h-[18px]" />
                </div>
              )}
            </InView>
          )
        }

        return (
          <div className="flex gap-2 w-full">
            <span className="text-primary-dark dark:text-primary"># {val}</span>
            <span>
              {record?.sent_from_1c ? t('common:ordered-via-1c') : t('common:ordered-via-website')}
            </span>
          </div>
        )
      },
    },
    {
      title: t('fields:date.label'),
      dataIndex: 'created_at',
      key: 'created_at',
      className: 'text-[14px] p-2 text-center dark:text-white',
      render: (val, record) => {
        if (record.loaderKey === 'loader') {
          return (
            <InView onChange={(val) => val && fetchNextPage()}>
              {({ ref }) => (
                <div ref={ref} className="flex justify-center">
                  <Skeleton.Input active className="w-[50%] rounded-lg h-[18px]" />
                </div>
              )}
            </InView>
          )
        }

        return dayjs(val).format('DD.MM.YYYY, HH:mm')
      },
    },
    {
      key: 'price',
      dataIndex: 'price',
      className: 'text-[14px] p-2 w-[450px] text-center dark:text-white',
      title: t('fields:total.label'),
      render: (val, record) => {
        if (record.loaderKey === 'loader') {
          return (
            <InView onChange={(val) => val && fetchNextPage()}>
              {({ ref }) => (
                <div ref={ref} className="flex">
                  <Skeleton.Input active className="w-[80%] rounded-lg h-[18px]" />
                </div>
              )}
            </InView>
          )
        }

        return (
          <div className="flex text-[16px] font-medium items-center gap-2">
            <div className="flex-1 text-start">
              <span>
                {formatAmount(val)} <span className="text-[12px]">{t('common:uzs')}</span>
              </span>
            </div>
            <span className="text-xs">
              {record?.sent_from_1c ? t('common:lost-profit') : t('common:profit')}:
            </span>
            <span
              className={twMerge('text-xs', record?.sent_from_1c ? 'text-red-500' : 'text-success')}
            >
              {record?.sent_from_1c ? '-' : ''}
              {formatAmount(record?.price_percent_1)}{' '}
              <span className="text-[12px]">{t('common:uzs')}</span>
            </span>
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
    return <NoOrdersFound />
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
          className="h-full dark:[&_th]:bg-dsecondary [&_thead]:sticky [&_td]:border-2 [&_th]:border-2 [&_thead]:top-[109px] [&_thead]:z-[1] dark:[&_.ant-table-container]:border-dborder dark:[&_th]:!border-dborder dark:[&_td]:!border-dborder"
        />
      ) : null}
    </div>
  )
}

export default ProductsList
