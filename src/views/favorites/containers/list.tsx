import { useCallback } from 'react'
import { Skeleton, Table } from 'antd'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { InView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getFavorites } from '../services'
import useAuthStore from '@/store/auth-store'
import { formatAmount } from '@/utils/format-amount'
import { Media } from '@/config/media-styles-config'
import useViewTypeStore from '@/views/search/store/use-view-type-store'

import Loader from '@/components/shared/loader'
import MadeToOrder from '@/components/shared/made-to-order'
import ProductCard from '@/components/shared/product-card'
import NoFavoritesFound from '../components/no-favorites-found'
import CartInputStepper from '@/components/shared/cart-input-stepper'
import BrandTableRow from '@/views/search/components/brand-table-row'
import MeasureTableRow from '@/views/search/components/measure-table-row'
import ProductsTableCard from '@/views/search/components/products-table-card'
import ClickableTableRow from '@/views/shopping-cart/components/clickable-table-row'
// import CartInputStepper from '@/components/shared/cart-input-stepper'

import type { IFavorite } from '../types'
import type { IListResponse } from '@/types'
import type { ColumnsType } from 'antd/es/table'

const Favorites = () => {
  const { t } = useTranslation('common')
  const { query } = useRouter()
  const isTableType = useViewTypeStore((store) => store.isTableType)
  const isSignedIn = useAuthStore((state) => state.isSignedIn)

  const {
    data: orders,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage: IListResponse<IFavorite>) => {
      const page = lastPage?.next ? queryString.parseUrl(lastPage?.next)?.query?.page : null

      if (page) {
        return Number(page)
      }

      return null
    },
    queryKey: ['favorites', query.page, query.page_size],
    queryFn: ({ pageParam }) =>
      getFavorites({
        page_size: 20,
        page: pageParam as number,
      }),
    // enabled: Boolean(queryString.stringify(query).length),
  })

  const content = orders?.pages.flatMap((page) => page?.results)

  const columns: ColumnsType<IFavorite> = [
    {
      title: t('fields:title.label'),
      dataIndex: 'title',
      key: 'title',
      className: 'text-[12px] p-2 dark:text-white',
      render: (_: string, record: IFavorite) => {
        if (record?.product?.loaderKey === 'loader') {
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

        return <ProductsTableCard {...record?.product} />
      },
    },
    {
      title: `${t('fields:organization.label')} / ${t('fields:brand.label')}`,
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
      className: 'text-[12px] p-2 dark:text-white',
      render: (_, record) => {
        if (record?.product?.loaderKey === 'loader') {
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
      key: 'measure',
      dataIndex: 'measure',
      className: 'text-[12px] p-2 dark:text-white',
      title: `${t('fields:quantity_in_box.label')} / ${t('fields:measure.label')}`,
      render: (_: string, record: IFavorite) => {
        if (record?.product?.loaderKey === 'loader') {
          return (
            <div className="flex flex-col gap-2">
              <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
              <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
            </div>
          )
        }

        return <MeasureTableRow {...record?.product} />
      },
    },
    {
      width: 120,
      key: 'price',
      dataIndex: 'price',
      className: 'text-[12px] p-2 dark:text-white text-center',
      title: t('fields:price.label'),
      render: (_, record: IFavorite) => {
        if (record?.product?.loaderKey === 'loader') {
          return <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
        }

        return (
          <div className="text-center items-center flex flex-col font-semibold">
            {isSignedIn && record?.product?.price_discount !== 0 ? (
              <span className="text-secondary-light line-through">
                {formatAmount(record?.product?.price)}
                <span className="text-[12px]">{t('common:uzs')}</span>
              </span>
            ) : null}

            <span className="text-primary dark:text-white text-[16px]">
              {formatAmount(
                isSignedIn && record?.product?.price_discount !== 0
                  ? record?.product?.price_discount
                  : record?.product?.price
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
      className: 'text-[12px] p-2 dark:text-white ',
      render: (_, record) => {
        if (record?.product?.loaderKey === 'loader') {
          return <Skeleton.Input active className="max-w-[210px] w-full rounded-lg h-[38px]" />
        }

        if (isSignedIn) {
          return record?.product?.max_quantity > 0 ? (
            <CartInputStepper
              productId={record?.product?.id}
              inCart={record?.product?.in_cart}
              minQuantity={record?.product?.min_box_quantity}
              isInStock={record?.product?.max_quantity > 0}
            />
          ) : (
            <MadeToOrder />
          )
        }
      },
    },
  ]

  const dataSource =
    content && content.length
      ? [...content, hasNextPage ? { product: { loaderKey: 'loader' } } : null].filter(Boolean)
      : []

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (content?.length === 0) {
    return <NoFavoritesFound />
  }

  return (
    <div className="flex flex-col duration-200 flex-1 h-auto rounded-xl">
      {isLoading ? (
        <div className="w-full flex-1 flex items-center justify-center">
          <Loader />
        </div>
      ) : null}

      {content && content?.length > 0 && isTableType ? (
        <>
          <Media lessThan="md">
            <div className="flex flex-wrap gap-3">
              {content?.map((product, i) => (
                <ProductCard fixedWidth key={i} {...product?.product} />
              ))}
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
              className="h-full dark:[&_th]:bg-dsecondary [&_thead]:sticky [&_td]:border-2 [&_th]:border-2 dark:[&_.ant-table-container]:border-dborder dark:[&_th]:!border-dborder dark:[&_td]:!border-dborder [&_thead]:top-[109px] [&_thead]:z-[1]"
            />
          </Media>
        </>
      ) : null}

      {content && content?.length > 0 && !isTableType ? (
        <div className="grid grid-cols-5 gap-3">
          {content?.map((product, i) => <ProductCard key={i} {...product?.product} />)}
          <InView onChange={(val) => val && loadMoreItems()}>
            {({ ref }) => (
              <div ref={ref} className="text-center w-full min-h-[20px] py-4 col-span-full">
                {isFetchingNextPage ? <Loader /> : null}
              </div>
            )}
          </InView>
        </div>
      ) : null}
    </div>
  )
}

export default Favorites
