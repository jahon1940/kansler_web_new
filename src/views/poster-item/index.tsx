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

  const { data: poster } = useQuery({
    queryKey: ['poster', query.posterId],
    queryFn: () => getPostersItem(query.posterId as string),
  })

  const {
    data: products,
    fetchNextPage,
    isFetchingNextPage,
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
    queryKey: ['poster-products', query.posterId, query.page, query.page_size],
    queryFn: ({ pageParam }: any) =>
      getPostersItemProducts({
        id: query.posterId,
        page_size: 20,
        ...query,
        page: pageParam as number,
      }),
    enabled: Boolean(queryString.stringify(query).length),
  })

  const content = products?.pages.flatMap((page) => page?.results)

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <main className="custom-container w-full p-4 relative">
      <Button
        icon={<ArrowLeftOutlineIcon />}
        className="absolute left-[10px] dark:bg-dprimary hover:dark:bg-dprimary/70 dark:text-white dark:border-dborder text-[20px] top-4"
        onClick={() => push('/')}
      />
      <div className="max-w-[1240px] w-full mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="h-[400px] rounded-2xl overflow-hidden">
              {poster?.img_web ? (
                <Image
                  width={1240}
                  height={500}
                  src={API_HOST + poster?.img_web}
                  alt="banner image"
                  className="w-full h-full object-fill"
                />
              ) : (
                <Skeleton.Input className="w-full h-[400px]" active />
              )}
            </div>
            <h1 className="font-semibold text-[32px] dark:text-white">
              {poster?.notification?.title}
            </h1>
            <div className="p-4 bg-white dark:bg-dprimary dark:border-dborder dark:text-white rounded-xl border">
              {poster?.notification?.body}
            </div>
          </div>

          <div className="grid overflow-auto max-[1100px]:grid-cols-4 max-[1200px]:grid-cols-4 grid-cols-5 gap-3">
            {content?.map((product, i) => <ProductCard key={i} {...product} />)}
            <InView onChange={(val) => val && loadMoreItems()}>
              {({ ref }) => (
                <div ref={ref} className="text-center min-h-[20px] py-4 col-span-full">
                  {isFetchingNextPage ? <Loader /> : null}
                </div>
              )}
            </InView>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PosterItemPage
