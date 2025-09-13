import { useTranslation } from 'next-i18next'

import type { FC } from 'react'
import type { IAddress } from '../types'

const TradingPointsCard: FC<IAddress> = (props) => {
  const { t } = useTranslation()

  return (
    <div className="mb-2 rounded-xl p-6 bg-[#F4F7FD] dark:bg-dsecondary">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex">
            <div className="w-28 text-gray-700 dark:text-white">{t('fields:name.label')}</div>
            <div className="text-gray-700 dark:text-white">:</div>
            <div className="ml-2 dark:text-white">{props?.name}</div>
          </div>
          <div className="flex">
            <div className="w-28 text-gray-700 dark:text-white">{t('fields:phone.label')}</div>
            <div className="text-gray-700 dark:text-white">:</div>
            <div className="ml-2 dark:text-white">{props?.phone_numbers}</div>
          </div>
          <div className="flex">
            <div className="w-28 text-gray-700 dark:text-white">{t('fields:region.label')}</div>
            <div className="text-gray-700 dark:text-white">:</div>
            <div className="ml-2 dark:text-white">{props?.region}</div>
          </div>
          <div className="flex">
            <div className="w-28 text-gray-700 dark:text-white">
              {t('fields:organization.label')}
            </div>
            <div className="text-gray-700 dark:text-white">:</div>
            <div className="ml-2 dark:text-white">{props?.organization?.name}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-gray-700 dark:text-white mb-1">
              {t('fields:managername.label')} : {props?.manager?.name}
            </div>
            <div className="text-gray-700 dark:text-white text-sm">
              {t('fields:managerphone.label')} : {props?.manager?.phone}
            </div>
          </div>
          <div>
            <div className="text-gray-700 dark:text-white mb-1">
              {t('fields:agentname.label')} : {props?.agent?.name}
            </div>
            <div className="text-gray-700 dark:text-white text-sm">
              {t('fields:managerphone.label')} : {props?.agent?.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradingPointsCard
