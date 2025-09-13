import { Card, Table } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'

import { formatAmount } from '@/utils/format-amount'
import { getCompanyBonuses, getCompanyLimits } from '../services'

import type { IBonus, ILimit } from '../types'
import type { ColumnsType } from 'antd/es/table'

const LimitBonuses = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const { data: limits } = useQuery({
    queryKey: ['limits', query.company],
    queryFn: () => getCompanyLimits(query.company as string),
    enabled: Boolean(query.company),
  })

  const { data: bonuses } = useQuery({
    queryKey: ['bonuses', query.company],
    queryFn: () => getCompanyBonuses(query.company as string),
    enabled: Boolean(query.company),
  })

  const bonusCols: ColumnsType<IBonus> = [
    {
      width: 500,
      title: t('fields:organization.label2'),
      dataIndex: 'organization',
      key: 'organization',
      className: 'p-2 text-[12px] dark:bg-dsecondary dark:text-white',
      render: (val) => val?.name,
    },
    {
      width: 500,
      title: t('fields:companyname.label'),
      dataIndex: 'company',
      key: 'company',
      className: 'p-2 text-[12px] dark:bg-dsecondary dark:text-white',
      render: (val) => val?.name,
    },
    {
      width: 500,
      title: t('fields:total.label'),
      dataIndex: 'total_bonus',
      key: 'total_bonus',
      className: 'p-2 text-[12px] dark:bg-dsecondary dark:text-white',
      render: (val) => `${formatAmount(val || 0)} ${t('common:uzs')}`,
    },
  ]

  const limitCols: ColumnsType<ILimit> = [
    {
      width: 500,
      title: t('fields:organization.label2'),
      dataIndex: 'organization',
      key: 'organization',
      className: 'p-2 text-[12px] dark:bg-dsecondary dark:text-white',
      render: (val) => val?.name,
    },
    {
      width: 500,
      title: t('fields:companyname.label'),
      dataIndex: 'company',
      key: 'company',
      className: 'p-2 text-[12px] dark:bg-dsecondary dark:text-white',
      render: (val) => val?.name,
    },
    {
      width: 500,
      title: t('fields:total.label'),
      dataIndex: 'total_limit',
      key: 'total_limit',
      className: 'p-2 text-[12px] dark:bg-dsecondary dark:text-white',
      render: (val) => `${formatAmount(val || 0)} ${t('common:uzs')}`,
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      {limits ? (
        <Card
          title={t('fields:limit.label')}
          className="border-none dark:[&_.ant-table-container]:border-dborder dark:[&_th]:!border-dborder dark:[&_td]:!border-dborder"
          classNames={{
            header: 'dark:bg-dprimary dark:text-white',
            body: 'dark:bg-dprimary',
          }}
        >
          <Table
            bordered
            columns={limitCols}
            dataSource={limits?.results || []}
            pagination={false}
            rowKey="limit"
            className="[&_td]:border-2 [&_th]:border-2"
          />
        </Card>
      ) : null}
      {bonuses ? (
        <Card
          title={t('fields:bonus.label')}
          className="border-none dark:[&_.ant-table-container]:border-dborder dark:[&_th]:!border-dborder dark:[&_td]:!border-dborder"
          classNames={{ header: 'dark:bg-dprimary dark:text-white', body: 'dark:bg-dprimary' }}
        >
          <Table
            bordered
            columns={bonusCols}
            dataSource={bonuses?.results || []}
            pagination={false}
            rowKey="organization"
            className="[&_td]:border-2 [&_th]:border-2"
          />
        </Card>
      ) : null}
    </div>
  )
}

export default LimitBonuses
