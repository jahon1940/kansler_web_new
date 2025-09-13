import { useState } from 'react'
import { Button, Rate } from 'antd'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { rateOrgOrder } from '../services'
import { formatAmount } from '@/utils/format-amount'

import ArrowRightOutlineIcon from '@/components/icons/arrow-right-outline'

import type { FC } from 'react'
import type { IOrganizationOrder } from '../types'

const OrgOrderCard: FC<IOrganizationOrder> = (props) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { query, pathname, push } = useRouter()
  const [rate, setRate] = useState(props?.rating)

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      rateOrgOrder({
        id: query?.orderId as string,
        organization_order_id: props?.id,
        rating: rate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', query.orderId] })
    },
  })

  return (
    <div className="bg-white border dark:border-dborder dark:bg-dsecondary rounded-xl p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="m-0 text-[14px] dark:text-white font-semibold">
          {props?.organization?.name}
        </span>
        <span className="text-primary text-xs">{props?.status}</span>
      </div>
      <div className="text-xs dark:text-white mb-4">
        <span>{t('fields:total.label')}:</span>{' '}
        <span>
          {formatAmount(props?.price)} {t('common:uzs')}
        </span>
      </div>
      <Button
        type={query.org_order === props.id + '' ? 'primary' : undefined}
        className="px-4 w-full mb-4 inline-flex justify-between items-center"
        onClick={() => {
          push({ pathname, query: queryString.stringify({ ...query, org_order: props.id }) })
        }}
      >
        <span className="text-xs font-normal">{t('common:order-products')}</span>
        <ArrowRightOutlineIcon className="text-[18px]" />
      </Button>
      <div className="text-xs mb-4 dark:text-white line-clamp-1">
        <span>{t('fields:managername.label')}:</span> <span>{props?.address?.manager?.name}</span>
      </div>
      {props?.rating ? (
        <div className="text-xs text-center mb-6 text-black dark:text-white">
          {t('fields:rating.label')}
        </div>
      ) : (
        <div className="bg-[#F4F7FD] dark:bg-dprimary dark:text-white p-2 mb-6 rounded-md text-xs leading-5">
          {t('common:rate-service')}
        </div>
      )}
      <div className="flex flex-col items-center">
        <Rate
          disabled={Boolean(props?.rating)}
          allowHalf
          value={rate}
          className="text-[36px] mb-4"
          onChange={(val) => setRate(val)}
        />
        {props?.rating ? null : (
          <Button
            className="w-full dark:disabled:text-gray-400 dark:disabled:bg-dprimary dark:border-dborder"
            disabled={!Boolean(rate)}
            loading={isPending}
            onClick={() => mutate()}
          >
            {t('actions:submit-rating')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default OrgOrderCard
