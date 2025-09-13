import { Card } from 'antd'
import { useCallback } from 'react'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { InView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getCompanyAddresses } from '../services'

import Loader from '@/components/shared/loader'
import TradingPointsCard from '../components/trading-points-card'

import type { IAddress } from '../types'
import type { IListResponse } from '@/types'

export default function TradingPoints() {
  const { query } = useRouter()
  const { t } = useTranslation()

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage: IListResponse<IAddress>) => {
      const page = lastPage?.next ? queryString.parseUrl(lastPage?.next)?.query?.page : null

      if (page) {
        return Number(page)
      }

      return null
    },
    queryKey: ['addresses', query.company],
    queryFn: () => getCompanyAddresses(query.company as string),
    enabled: Boolean(query.company),
  })

  const content = data?.pages.flatMap((page) => page?.results)

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <Card
      title={t('common:trading-points')}
      className="border-none"
      classNames={{
        header: 'sticky top-[100px] bg-white dark:bg-dprimary dark:text-white dark:border-dborder',
        body: 'dark:bg-dprimary',
      }}
    >
      {content?.map((address, i) => <TradingPointsCard {...address} key={`trading-points-${i}`} />)}

      <InView onChange={(val) => val && loadMoreItems()}>
        {({ ref }) => (
          <div ref={ref} className="text-center min-h-[20px] py-4 col-span-full">
            {isFetchingNextPage ? <Loader /> : null}
          </div>
        )}
      </InView>
    </Card>
  )
}
