import { Typography } from 'antd'
import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'

import { getAuthCurrent } from '@/views/profile/services'

const { Title, Text } = Typography

const ProfileInfoBox = () => {
  const { t } = useTranslation()
  const { data } = useQuery({
    queryKey: ['auth-current'],
    queryFn: () => getAuthCurrent(),
  })

  return (
    <div className="bg-white shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] dark:shadow-none dark:bg-dsecondary rounded-xl p-3">
      <Title level={5} className="dark:text-white">
        {data?.full_name}
      </Title>
      <div className="mb-2 grid grid-cols-2 ">
        <Text className="dark:text-white">{t('fields:companyname.label')} </Text>
        <Text className="dark:text-white" strong>
          : {data?.name}
        </Text>

        <Text className="dark:text-white">{t('fields:tin.label')} </Text>
        <Text className="dark:text-white" strong>
          : {data?.inn}
        </Text>

        <Text className="dark:text-white">{t('fields:companytype.label')} </Text>
        <Text className="dark:text-white" strong>
          : {data?.company_type}
        </Text>

        <Text className="dark:text-white">{t('fields:region.label')} </Text>
        <Text className="dark:text-white break-all" strong>
          : {data?.region}
        </Text>
      </div>
      <div className="bg-[#F4F7FD] dark:bg-dprimary p-2 rounded-md">
        <Text className="block text-[11px] mb-2 dark:text-white">
          {t('fields:managername.label')}: <br /> {data?.manager?.name}
        </Text>
        <Text className="block text-[11px] dark:text-white">
          {t('fields:managerphone.label')}: {data?.manager?.phone}
        </Text>
      </div>
    </div>
  )
}

export default ProfileInfoBox
