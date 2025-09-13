import queryString from 'query-string'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState, useEffect, FC } from 'react'

import { getSubcategoryChildren } from '../services'

import ArrowRightOutlineIcon from '@/components/icons/arrow-right-outline'
import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'

const CategoryChips: FC<{ id?: number }> = (props) => {
  const { query, pathname, push } = useRouter()
  const { data: subcategories } = useQuery({
    queryKey: ['subcategories', query.subcategory, props?.id],
    queryFn: () => getSubcategoryChildren(props?.id || (query.subcategory as string)),
    enabled: Boolean(props?.id || query?.subcategory),
  })

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const clickHandler = (id: string) => () => {
    push({
      pathname: pathname,
      query: queryString.stringify({
        ...query,
        grandcategory: query?.grandcategory === id ? undefined : id,
      }),
    })
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
      console.log('Scrolling right by:', scrollAmount)
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
      console.log('Scroll positions:', { scrollLeft, scrollWidth, clientWidth })
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

  if (!subcategories?.results?.length) {
    return null
  }

  return (
    <div className="w-full bg-[#EEF1F7] dark:bg-dsecondary duration-200 py-4 sticky top-[109px] z-[2]">
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform text-white  -translate-y-1/2 bg-black/50 duration-200 hover:bg-black shadow-md rounded-full p-2 text-[22px] z-[1]"
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
            onClick={clickHandler(val.id + '')}
            className={twMerge(
              'bg-white dark:bg-dprimary dark:text-white hover:bg-primary-light border hover:border-transparent whitespace-nowrap text-sm px-2.5 py-1 rounded-[8px]',
              query.grandcategory === val?.id + ''
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
  )
}

export default CategoryChips
