import { Typography } from 'antd'
import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'

import { getAuthCurrent } from '@/views/profile/services'
import ProfileInfoBox from '@/components/shared/profile-info'

const { Title, Text } = Typography

const MyOrdersSidebar = () => {
  const { t } = useTranslation()

  const { data } = useQuery({
    queryKey: ['auth-current'],
    queryFn: () => getAuthCurrent(),
  })

  return (
    <div className="bg-white dark:bg-dprimary w-[315px] gap-3 h-[calc(100vh-141px)] sticky top-[125px] rounded-xl flex flex-col overflow-auto p-2">
      <Title className="my-2 pl-3 text-[18px] dark:text-white">{t('common:order-info')}</Title>

      <ProfileInfoBox />

      {data && data.is_address ? (
        <div className="bg-white dark:bg-dsecondary rounded-lg p-3">
          <Text className="block text-xs dark:text-white">
            {t('fields:addresses.label')}: <br /> {data?.addresses[0]?.name}
          </Text>
        </div>
      ) : null}
    </div>
  )
}

export default MyOrdersSidebar
