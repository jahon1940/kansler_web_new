import Image from 'next/image'
import { useCallback } from 'react'
import queryString from 'query-string'
import { Button, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { InView } from 'react-intersection-observer'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { API_HOST } from '@/config'
import { getPostersItem, getPostersItemProducts } from './services'

import Loader from '@/components/shared/loader'
import ProductCard from '@/components/shared/product-card'
import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'
import type { IListResponse } from '@/types'
import type { IProduct } from '../search/types'

const PosterItemPage = () => {
  const { query, push } = useRouter()
  const posterId = query.posterId as string

  const { data: poster, isLoading: isPosterLoading } = useQuery({
    queryKey: ['poster', posterId],
    queryFn: () => getPostersItem(posterId),
    enabled: !!posterId,
  })

  const {
    data: products,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['poster-products', posterId],
    enabled: !!posterId,
    getNextPageParam: (lastPage: IListResponse<IProduct>) => {
      const page = lastPage?.next ? queryString.parseUrl(lastPage.next)?.query?.page : null
      return page ? Number(page) : undefined
    },
    queryFn: ({ pageParam }) =>
      getPostersItemProducts({
        id: posterId,
        page_size: 20,
        page: pageParam,
      }),
  })

  const content = products?.pages.flatMap((page) => page.results) ?? []

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <main className="custom-container w-full p-4 relative">
      <Button
        icon={<ArrowLeftOutlineIcon />}
        className="lg:absolute lg:left-3 mb-4 lg:m-0 lg:top-4 sticky dark:bg-dprimary hover:dark:bg-dprimary/70 dark:text-white dark:border-dborder text-lg"
        onClick={() => push('/')}
      />

      <div className="max-w-[1240px] mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div
            className="lg:h-[400px]
                md:h-[350px]
                sm:h-[280px]
                h-[220px] rounded-2xl overflow-hidden relative"
          >
            {isPosterLoading ? (
              <Skeleton.Input className="w-full h-[400px]" active />
            ) : (
              <Image
                src={API_HOST + poster?.img_web}
                alt={poster?.notification?.title || 'Poster banner'}
                width={1240}
                height={500}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <h1 className="font-semibold text-xl lg:text-3xl dark:text-white">
            {poster?.notification?.title}
          </h1>

          {poster?.notification?.body && (
            <div className="p-4 bg-white dark:bg-dprimary dark:border-dborder dark:text-white rounded-xl border">
              {poster.notification.body}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {content.map((product, i) => (
            <ProductCard key={product.id || i} {...product} />
          ))}

          <InView onChange={(inView) => inView && loadMoreItems()}>
            {({ ref }) => (
              <div ref={ref} className="text-center min-h-[20px] py-4 col-span-full">
                {isFetchingNextPage && <Loader />}
              </div>
            )}
          </InView>
        </div>
      </div>
    </main>
  )
}

export default PosterItemPage
