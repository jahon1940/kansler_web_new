import { Typography } from 'antd'
import queryString from 'query-string'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'

import { getAuthCurrent, getCompaniesChildren } from '@/views/profile/services'

import CSelect from '../ui/cselect'

const { Text } = Typography

const ActiveCompanySelect = () => {
  const { t } = useTranslation()
  const { query, pathname, push } = useRouter()
  const { data } = useQuery({
    queryKey: ['auth-current'],
    queryFn: () => getAuthCurrent(),
  })

  const { data: companiesChildren } = useQuery({
    queryKey: ['companies-children'],
    queryFn: () => getCompaniesChildren(),
  })

  const companies: any[] = [
    ...(companiesChildren?.results?.map((val) => ({
      ...val,
      label: val?.name,
      value: val?.id,
    })) || []),
    { ...data, label: data?.name, value: data?.id },
  ]

  const activeCompany = companies?.find((val) => val.value === Number(query?.company))

  return (
    <>
      {data && !data?.is_address ? (
        <CSelect
          placeholder={t('fields:company.placeholder')}
          value={query.company && Number(query.company) ? Number(query.company) : undefined}
          className="w-full"
          rootClassName="[&_.ant-select-item]:px-1"
          popupClassName="bg-primary-light dark:bg-dsecondary"
          options={companies}
          onChange={(val) =>
            push({
              pathname: pathname,
              query: queryString.stringify({ company: val }),
            })
          }
          optionRender={(option) => {
            return (
              <div className="bg-white dark:bg-dsecondary rounded-md p-3">
                <div>
                  <Text className="dark:text-white">
                    {t('fields:companyname.label')}: {option?.data?.name}
                  </Text>
                  <br />
                  <Text className="dark:text-white">
                    {t('fields:tin.label')}: {option?.data?.inn}
                  </Text>
                  <br />
                  <Text className="dark:text-white">
                    {t('fields:managername.label2')}: {option?.data?.manager?.name}
                  </Text>
                  <br />
                  <Text className="dark:text-white">
                    {t('fields:managerphone.label2')}: {option?.data?.manager?.phone}
                  </Text>
                </div>
              </div>
            )
          }}
        />
      ) : null}

      {activeCompany ? (
        <div className="bg-white shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] dark:shadow-none dark:bg-dsecondary rounded-xl p-3">
          <div>
            <Text className="dark:text-white">
              {t('fields:companyname.label')}: {activeCompany?.name}
            </Text>
            <br />
            <Text className="dark:text-white">
              {t('fields:tin.label')}: {activeCompany?.inn}
            </Text>
            <br />
            <Text className="dark:text-white">
              {t('fields:managername.label2')}: {activeCompany?.manager?.name}
            </Text>
            <br />
            <Text className="dark:text-white">
              {t('fields:managerphone.label2')}: {activeCompany?.manager?.phone}
            </Text>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ActiveCompanySelect
