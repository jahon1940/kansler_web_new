import queryString from 'query-string'
import { useRouter } from 'next/router'
import { Button, Typography } from 'antd'
import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'
import { LogoutOutlined } from '@ant-design/icons'

import useAuthStore from '@/store/auth-store'
import { getAuthCurrent } from '../services'

import ArrowRightOutlineIcon from '@/components/icons/arrow-right-outline'
import ProfileInfoBox from '@/components/shared/profile-info'
import ActiveCompanySelect from '@/components/shared/active-company-select'
import { ROUTES } from '@/constants'

const { Text } = Typography

const ProfileSidebar = () => {
  const { t } = useTranslation()
  const { push, query, pathname } = useRouter()
  const logout = useAuthStore((store) => store.logout)

  const { data } = useQuery({
    queryKey: ['auth-current'],
    queryFn: () => getAuthCurrent(),
  })

  const handleClick = (categoryName: string) => {
    push({
      pathname: pathname,
      query: queryString.stringify({ company: query?.company, category: categoryName }),
    })
  }

  const isActive = (categoryName: string) => query?.category === categoryName

  return (
    <div className="bg-white pb-8 dark:bg-dprimary w-[315px] gap-3 h-[calc(100vh-141px)] sticky top-[125px] rounded-xl flex flex-col overflow-auto p-2">
      <ProfileInfoBox />

      {data && data.is_address ? (
        <div className="bg-white dark:bg-dsecondary rounded-lg p-3">
          <Text className="block text-xs dark:text-white">
            {t('fields:addresses.label')}: <br /> {data?.addresses?.[0]?.name}
          </Text>
        </div>
      ) : null}

      <ActiveCompanySelect />

      {query.company && data && !data?.is_address ? (
        <div className="flex flex-col gap-3">
          <Button
            className={`border-none dark:bg-dsecondary dark:text-white text-start flex justify-between px-4 ${
              isActive('limit-bonuses')
                ? 'bg-blue-100 dark:bg-primary dark:text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => handleClick('limit-bonuses')}
          >
            {t('common:limit-bonuses')} <ArrowRightOutlineIcon className="text-[18px]" />
          </Button>
          <Button
            className={`border-none dark:bg-dsecondary dark:text-white text-start flex justify-between px-4 ${
              isActive('debt-history')
                ? 'bg-blue-100 dark:bg-primary dark:text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => handleClick('debt-history')}
          >
            {t('common:debt-history')} <ArrowRightOutlineIcon className="text-[18px]" />
          </Button>
          <Button
            className={`border-none dark:bg-dsecondary dark:text-white text-start flex justify-between px-4 ${
              isActive('trading-points')
                ? 'bg-blue-100 dark:bg-primary dark:text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => handleClick('trading-points')}
          >
            {t('common:trading-points')} <ArrowRightOutlineIcon className="text-[18px]" />
          </Button>
        </div>
      ) : null}

      <Button
        type="primary"
        danger
        className="flex flex-shrink-0 items-center justify-between w-full mt-2"
        onClick={() => {
          logout()
          push(ROUTES.LOGIN)
        }}
      >
        {t('actions:logout')} <LogoutOutlined />
      </Button>
    </div>
  )
}

export default ProfileSidebar
