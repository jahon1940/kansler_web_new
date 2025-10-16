import { Skeleton, Table } from 'antd'
import queryString from 'query-string'
import { useTranslation } from 'next-i18next'
import { InView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getCartProducts } from '../services'
import useAuthStore from '@/store/auth-store'
import { formatAmount } from '@/utils/format-amount'

import Loader from '@/components/shared/loader'
import BrandTableRow from '../components/brand-table-row'
import OutOfStock from '@/components/shared/made-to-order'
import NoProductsFound from '../components/no-products-found'
import MeasureTableRow from '../components/measure-table-row'
import ClickableTableRow from '../components/clickable-table-row'
import ProductsTableCard from '../components/products-table-card'
import CartInputStepper from '@/components/shared/cart-input-stepper'
// import CartInputStepper from '@/components/shared/cart-input-stepper'

import type { ICartProduct } from '../types'
import type { IListResponse } from '@/types'
import type { ColumnsType } from 'antd/es/table'
import ProductCard from '@/components/shared/product-card'
import { useCallback } from 'react'

const ProductsList = () => {
  const { t } = useTranslation('common')
  const isSignedIn = useAuthStore((state) => state.isSignedIn)

  const {
    data: products,
    fetchNextPage,
    isFetchingNextPage,
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
    queryKey: ['products', 'cart-products'],
    queryFn: ({ pageParam }) =>
      getCartProducts({
        page_size: 20,
        page: pageParam as number,
      }),
    // enabled: Boolean(queryString.stringify(query).length),
  })

  const content = products?.pages.flatMap((page) => page?.results)

  const columns: ColumnsType<ICartProduct> = [
    {
      title: t('fields:title.label'),
      dataIndex: 'title',
      key: 'title',
      className: 'text-[12px] p-2 dark:text-white border-e-2',
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

        return <ProductsTableCard {...record?.product} />
      },
    },
    {
      title: `${t('fields:organization.label')} / ${t('fields:brand.label')}`,
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
      className: 'text-[12px] p-2 dark:text-white border-e-2',
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
      key: 'measure',
      dataIndex: 'measure',
      className: 'text-[12px] p-2 dark:text-white border-e-2',
      title: `${t('fields:quantity_in_box.label')} / ${t('fields:measure.label')}`,
      render: (_: string, record: ICartProduct) => {
        if (record.loaderKey === 'loader') {
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
      width: 100,
      key: 'quantity',
      dataIndex: 'quantity',
      className: 'text-[12px] p-2 text-center dark:text-white',
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

        return (
          <div className="flex flex-col">
            {record?.product?.max_quantity === 0 ? (
              <>
                <span className="whitespace-nowrap ">
                  {t('common:added')}: {formatAmount(record?.quantity)}
                </span>
                <span className="whitespace-nowrap text-red-500">
                  {t('common:remaining')}: {formatAmount(record?.product?.max_quantity)}
                </span>
              </>
            ) : record?.quantity > record?.product?.max_quantity ? (
              <>
                <span className="whitespace-nowrap ">
                  {t('common:added')}: {formatAmount(record?.quantity)}
                </span>
                <span className="whitespace-nowrap text-red-500">
                  {t('common:in-the-cart')}: {formatAmount(record?.product?.max_quantity)}
                </span>
              </>
            ) : record?.product?.max_quantity > 0 ? (
              <span>{formatAmount(record?.quantity) + ` ` + record?.product?.measure}</span>
            ) : null}
          </div>
        )
      },
    },
    {
      width: 120,
      key: 'price',
      dataIndex: 'price',
      className: 'text-[12px] p-2 text-center dark:text-white',
      title: t('fields:price.label'),
      render: (_, record: ICartProduct) => {
        if (record.loaderKey === 'loader') {
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

            <span className="text-black text-[16px] dark:text-white">
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
      width: 120,
      key: 'total_price',
      dataIndex: 'total_price',
      className: 'text-[12px] p-2 text-center dark:text-white',
      title: t('fields:total.label'),
      render: (_, record: ICartProduct) => {
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

            <span className="text-black text-[16px] dark:text-white">
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
      width: 160,
      key: 'action',
      title: t('actions:action'),
      className: 'text-[12px] p-2 dark:text-white border-e-2',
      render: (_, record) => {
        if (record.loaderKey === 'loader') {
          return <Skeleton.Input active className="max-w-[210px] w-full rounded-lg h-[38px]" />
        }

        // if (isSignedIn) {
        //   return (
        //     <CartInputStepper
        //       key={record.id}
        //       quantity={record?.quantity}
        //       productId={record?.product?.id}
        //       inCart={record?.product?.in_cart}
        //       minQuantity={record?.product?.min_box_quantity}
        //       isInStock={record?.product?.max_quantity > 0}
        //     />
        //   )
        // }

        return (
          <CartInputStepper
            key={record.id}
            quantity={record?.quantity}
            productId={record?.product?.id}
            inCart={record?.product?.in_cart}
            minQuantity={record?.product?.min_box_quantity}
            isInStock={record?.product?.max_quantity > 0}
          />
        )
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
          className="h-full hidden lg:block dark:[&_th]:bg-dsecondary [&_td]:border-2 [&_th]:border-2 [&_thead]:sticky dark:[&_.ant-table-container]:border-dborder dark:[&_th]:border-dborder [&_thead]:top-[109px] [&_thead]:z-[1]"
        />
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:hidden">
        {content?.map((product, i) => <ProductCard key={product.id || i} {...product?.product} />)}

        <InView onChange={(inView) => inView && loadMoreItems()}>
          {({ ref }) => (
            <div ref={ref} className="text-center min-h-[20px] py-4 col-span-full">
              {isFetchingNextPage && <Loader />}
            </div>
          )}
        </InView>
      </div>
    </div>
  )
}

export default ProductsList
