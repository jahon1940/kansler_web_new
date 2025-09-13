import dayjs from 'dayjs'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Card, Skeleton, Table } from 'antd'
import { InView } from 'react-intersection-observer'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { formatAmount } from '@/utils/format-amount'
import { getCompanyContracts, getCompanyDebts, getCompanyPayment } from '../services'

import CSelect from '@/components/ui/cselect'

import type { IListResponse } from '@/types'
import type { IDebt, IPayment } from '../types'
import type { ColumnsType } from 'antd/es/table'

const PaymentHistory = () => {
  const { t } = useTranslation()
  const { query, pathname, push } = useRouter()

  const { data: contracts } = useQuery({
    queryKey: ['contracts', query.company],
    queryFn: () => getCompanyContracts(query.company as string),
    enabled: Boolean(query.company),
  })

  const { data: debts } = useQuery({
    queryKey: ['debts', query?.company, query?.contract],
    queryFn: () => getCompanyDebts(query?.company, query?.contract),
    enabled: Boolean(query.company && query?.contract),
  })

  const {
    data: payment,
    fetchNextPage,
    // isFetchingNextPage,
    // isLoading,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['payment', query?.company, query?.contract],
    initialPageParam: 1,
    getNextPageParam: (lastPage: IListResponse<IPayment>) => {
      const page = lastPage?.next ? queryString.parseUrl(lastPage?.next)?.query?.page : null

      if (page) {
        return Number(page)
      }

      return null
    },
    queryFn: () => getCompanyPayment(query?.company, query?.contract),
    enabled: Boolean(query.company && query?.contract),
  })

  const historyColumns: ColumnsType<IPayment> = [
    {
      title: t('fields:organization.label2'),
      dataIndex: 'organization',
      key: 'organization',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (val) => val?.name,
    },
    {
      title: t('fields:companyname.label'),
      dataIndex: 'company',
      key: 'company',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (val) => val?.name,
    },
    {
      title: t('fields:number.label'),
      dataIndex: 'number',
      key: 'number',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (value: string, record: IPayment) => {
        if (record.loaderKey === 'loader') {
          return (
            <InView onChange={(val) => val && fetchNextPage()}>
              {({ ref }) => (
                <div ref={ref} className="flex flex-col gap-2">
                  <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
                </div>
              )}
            </InView>
          )
        }

        if (record.loaderKey === 'nothing') {
          return null
        }

        return value
      },
    },
    {
      title: t('fields:date.label'),
      dataIndex: 'date',
      key: 'date',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (value: string, record: IPayment) => {
        if (record.loaderKey === 'loader') {
          return (
            <InView onChange={(val) => val && fetchNextPage()}>
              {({ ref }) => (
                <div ref={ref} className="flex flex-col gap-2">
                  <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
                </div>
              )}
            </InView>
          )
        }

        if (record.loaderKey === 'nothing') {
          return null
        }

        return dayjs(value).format('DD.MM.YYYY')
      },
    },
    {
      title: t('fields:total.label'),
      dataIndex: 'amount',
      key: 'amount',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (value: string, record: IPayment) => {
        if (record.loaderKey === 'loader') {
          return (
            <InView onChange={(val) => val && fetchNextPage()}>
              {({ ref }) => (
                <div ref={ref} className="flex flex-col gap-2">
                  <Skeleton.Input active className="w-full rounded-lg h-[18px]" />
                </div>
              )}
            </InView>
          )
        }

        if (record.loaderKey === 'nothing') {
          return null
        }

        return formatAmount(value) + ` ${t('common:uzs')}`
      },
    },
  ]

  const debtColumns: ColumnsType<IDebt> = [
    {
      title: t('common:debt_15_days'),
      dataIndex: 'debt_15_days',
      key: 'debt_15_days',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (val) => formatAmount(val) + ` ${t('common:uzs')}`,
    },
    {
      title: t('common:debt_16_45_days'),
      dataIndex: 'debt_16_45_days',
      key: 'debt_16_45_days',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (val) => formatAmount(val) + ` ${t('common:uzs')}`,
    },
    {
      title: t('common:debt_46_60_days'),
      dataIndex: 'debt_46_60_days',
      key: 'debt_46_60_days',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (val) => formatAmount(val) + ` ${t('common:uzs')}`,
    },
    {
      title: t('common:debt_61_90_days'),
      dataIndex: 'debt_61_90_days',
      key: 'debt_61_90_days',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (val) => formatAmount(val) + ` ${t('common:uzs')}`,
    },
    {
      title: t('common:debt_91_120_days'),
      dataIndex: 'debt_91_120_days',
      key: 'debt_91_120_days',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (val) => formatAmount(val) + ` ${t('common:uzs')}`,
    },
    {
      title: t('common:debt_over_120_days'),
      dataIndex: 'debt_over_120_days',
      key: 'debt_over_120_days',
      className: 'p-2 text-[12px] dark:text-white dark:bg-dsecondary',
      render: (val) => formatAmount(val) + ` ${t('common:uzs')}`,
    },
  ]

  const activeContract = contracts?.results.find((val) => val.id === Number(query?.contract))
  const content = payment?.pages.flatMap((page) => page?.results)

  return (
    <>
      <Card
        title={t('fields:contract.label')}
        className="border-none mb-2"
        classNames={{
          header:
            'sticky top-[109px] dark:text-white z-[1] bg-white dark:border-dborder dark:bg-dprimary',
          body: 'dark:bg-dprimary',
        }}
      >
        <CSelect
          placeholder={t('fields:contract.placeholder')}
          className="w-[50%] mb-4"
          value={query?.contract ? Number(query?.contract) : undefined}
          allowClear
          options={
            contracts?.results.map((val) => ({
              label: t('fields:contract.number', { value: val?.name }),
              value: val.id,
            })) || []
          }
          onChange={(val) =>
            push({ pathname, query: queryString.stringify({ ...query, contract: val }) })
          }
        />
        {activeContract ? (
          <div className="bg-[#F4F7FD] dark:bg-dsecondary rounded-lg p-4 mb-6">
            <div className="text-gray-800 dark:text-white mb-4">{activeContract?.name}</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-gray-700 dark:text-white">
                    {t('fields:companyname.label')}
                  </span>
                  <span className="mx-2 dark:text-white">:</span>
                  <span className="font-medium dark:text-white">
                    {activeContract?.company?.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-white">
                    {t('fields:organization.label2')}
                  </span>
                  <span className="mx-2 dark:text-white">:</span>
                  <span className="font-medium dark:text-white">
                    {activeContract?.organization?.name}
                  </span>
                </div>
              </div>

              <div>
                <div className="font-medium mb-1 dark:text-white">
                  {t('fields:managername.label')}:
                </div>
                <div className="text-gray-700 dark:text-white">{activeContract?.manager?.name}</div>
                <div className="text-gray-700 dark:text-white mt-2">
                  {t('fields:managerphone.label')}:
                </div>
                <div className="text-gray-700 dark:text-white">
                  {activeContract?.manager?.phone}
                </div>
              </div>

              <div>
                <div className="font-medium mb-1 dark:text-white">
                  {t('fields:agentname.label')}:
                </div>
                <div className="text-gray-700 dark:text-white">{activeContract?.agent?.name}</div>
                <div className="text-gray-700 dark:text-white mt-2">
                  {t('fields:managerphone.label')}:
                </div>
                <div className="text-gray-700 dark:text-white">{activeContract?.agent?.phone}</div>
              </div>
            </div>
          </div>
        ) : null}
      </Card>

      {activeContract ? (
        <>
          <Card
            title={
              <>
                {t('common:debt')}
                <span className="text-xs text-secondary-light font-light ml-3">
                  ({t('common:select-contract')})
                </span>
              </>
            }
            className="border-none mb-2"
            classNames={{
              header:
                'sticky top-[109px] dark:border-dborder z-[1] bg-white dark:bg-dprimary dark:text-white',
              body: 'dark:bg-dprimary',
            }}
          >
            <Table
              bordered
              columns={debtColumns}
              dataSource={debts?.results || []}
              pagination={false}
              locale={{ emptyText: null }}
              className="dark:[&_.ant-table-container]:border-dborder [&_td]:border-2 [&_th]:border-2 dark:[&_.ant-table-placeholder]:bg-dsecondary dark:[&_.ant-table-footer]:bg-dsecondary dark:[&_.ant-table-footer]:border-dborder dark:[&_th]:border-dborder dark:[&_td]:border-dborder"
              footer={() => (
                <div className="text-xs dark:text-white">
                  {t('common:total-debt')}:{' '}
                  <span className="text-red-500 text-base ml-3">
                    {formatAmount(debts?.results?.[0]?.total_debt)} {t('common:uzs')}
                  </span>
                </div>
              )}
            />
          </Card>
          <Card
            title={t('common:payment-history')}
            className="border-none mb-2"
            classNames={{
              header:
                'sticky top-[109px] z-[1] bg-white dark:bg-dprimary dark:text-white dark:border-dborder',
              body: 'dark:bg-dprimary',
            }}
          >
            <Table
              bordered
              locale={{ emptyText: null }}
              columns={historyColumns as any}
              className="h-full [&_td]:border-2 [&_th]:border-2 [&_thead]:sticky dark:[&_.ant-table-placeholder]:bg-dsecondary [&_thead]:top-[156px] [&_thead]:z-[1] dark:[&_.ant-table-container]:border-dborder dark:[&_.ant-table-footer]:bg-dsecondary dark:[&_.ant-table-footer]:border-dborder dark:[&_th]:border-dborder dark:[&_td]:border-dborder"
              dataSource={
                content && content?.length
                  ? [...content, hasNextPage ? { loaderKey: 'loader' } : { loaderKey: 'nothing' }]
                  : []
              }
              pagination={false}
            />
          </Card>
        </>
      ) : null}
    </>
  )
}

export default PaymentHistory
