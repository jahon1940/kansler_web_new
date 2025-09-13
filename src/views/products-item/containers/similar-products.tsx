import { twMerge } from 'tailwind-merge'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useRef, useState, useEffect, FC, useCallback } from 'react'

import ArrowRightOutlineIcon from '@/components/icons/arrow-right-outline'
import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'
import { getSubcategoryChildren } from '@/views/catalog/services'
import ProductCard from '@/components/shared/product-card'
import { InView } from 'react-intersection-observer'
import Loader from '@/components/shared/loader'
import { getProducts } from '@/views/search/services'
import { IListResponse } from '@/types'
import queryString from 'query-string'
import { IProduct } from '@/views/search/types'
import ProductCardSkeleton from '@/components/shared/product-card-skeleton'

const SimilarProducts: FC<{ id?: number }> = (props) => {
  const [category, setCategory] = useState<number | undefined>(undefined)

  const { data: subcategories } = useQuery({
    queryKey: ['subcategories', props?.id],
    queryFn: () => getSubcategoryChildren(props?.id),
    enabled: Boolean(props?.id),
  })

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    if (subcategories?.results?.[0]?.id) {
      setCategory(subcategories?.results?.[0]?.id)
    }
  }, [subcategories?.results?.[0]?.id])

  const clickHandler = (id: number) => () => {
    setCategory(id)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
    }
  }

  useEffect(() => {
    updateScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
    }
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollButtons)
      }
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [subcategories])

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
    queryKey: ['products', category],
    queryFn: ({ pageParam }) =>
      getProducts({
        order_by: 'created_at',
        categories: category + '',
        page_size: 20,
        page: pageParam as number,
      }),

    enabled: Boolean(category),
  })

  const content = products?.pages.flatMap((page) => page?.results)

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (!subcategories?.results?.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full relative rounded-lg duration-200 bg-white dark:bg-dprimary py-4 pl-2">
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform text-white -translate-y-1/2 bg-black/50 duration-200 hover:bg-black shadow-md rounded-full p-2 text-[22px] z-[1]"
          >
            <ArrowLeftOutlineIcon />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 w-full overflow-x-auto scroll-smooth no-scrollbar"
        >
          {subcategories?.results.map((val, i) => (
            <button
              type="button"
              key={i}
              onClick={clickHandler(val.id)}
              className={twMerge(
                'bg-white dark:bg-dsecondary dark:text-white hover:bg-primary-light border hover:border-transparent whitespace-nowrap text-sm px-2.5 py-1 rounded-[8px]',
                category === val?.id
                  ? 'bg-primary-dark dark:bg-primary border-transparent hover:bg-primary-dark hover:border-transparent text-white'
                  : 'border-secondary-light/50 dark:border-dborder'
              )}
            >
              {val.name}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform text-white -translate-y-1/2 bg-black/50 duration-200 hover:bg-black shadow-md rounded-full p-2 text-[22px] z-[1]"
          >
            <ArrowRightOutlineIcon />
          </button>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4 w-full">
        {isLoading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : null}
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
  )
}

export default SimilarProducts
