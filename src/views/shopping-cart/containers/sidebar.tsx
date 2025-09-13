import dayjs from 'dayjs'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Button, Input, Modal, Typography } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useCounterStore from '@/store/counter-store'
import { formatAmount } from '@/utils/format-amount'
import { createOrder, getCartTotalAmount } from '../services'
import { getAuthCurrent, getCompaniesChildren } from '@/views/profile/services'

import OrderCheckIcon from '@/components/icons/order-check'
import ProfileInfoBox from '@/components/shared/profile-info'
import ActiveCompanySelect from '@/components/shared/active-company-select'

import type { IOrderResponse } from '../types'

const { Title, Text } = Typography

const ShoppingCartSidebar = () => {
  const { query, push } = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation('common')

  const { setCartCount } = useCounterStore()

  const [textValue, setTextValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successData, setSuccessData] = useState<IOrderResponse | null>(null)

  const { data } = useQuery({
    queryKey: ['auth-current'],
    queryFn: () => getAuthCurrent(),
  })

  const { data: companiesChildren } = useQuery({
    queryKey: ['companies-children'],
    queryFn: () => getCompaniesChildren(),
  })

  const { data: cartTotalAmount } = useQuery({
    queryKey: ['cart-total-amount'],
    queryFn: () => getCartTotalAmount(),
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

  const { mutate: mutateCreateOrder, isPending: isCreatingOrder } = useMutation({
    mutationFn: () =>
      createOrder({
        cart_product: null,
        comment: textValue,
        company_id: data?.is_address ? undefined : activeCompany?.id,
      }),
    onSuccess: (res) => {
      setIsModalOpen(true)
      setSuccessData(res)
    },
  })

  if (!cartTotalAmount?.price) {
    return null
  }

  return (
    <div className="bg-white pb-4 dark:bg-dprimary w-[315px] h-[calc(100vh-141px)] sticky top-[125px] gap-3 rounded-xl flex flex-col overflow-auto p-2">
      <Title className="my-2 pl-3 text-[18px] dark:text-white">{t('common:order-info')}</Title>
      <ProfileInfoBox />

      {data && data.is_address ? (
        <div className="bg-white dark:bg-dsecondary rounded-lg p-3">
          <Text className="block text-xs dark:text-white">
            {t('fields:addresses.label')}: <br /> {data?.addresses[0]?.name}
          </Text>
        </div>
      ) : null}

      <ActiveCompanySelect />

      <div className="flex flex-col flex-1">
        <Title level={5} className="text-sm dark:text-white">
          {t('common:order-comment')}:
        </Title>
        <Input.TextArea
          className="text-sm resize-none dark:bg-dsecondary"
          rows={3}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
      </div>

      <div className="border rounded-xl p-3 bg-white dark:bg-dsecondary dark:border-dborder">
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex flex-col">
            <span className="text-black font-medium dark:text-white">{t('common:amount-due')}</span>

            <div className="flex flex-col">
              {cartTotalAmount?.price_discount !== 0 ? (
                <span className="text-secondary-light text-sm line-through ">
                  {formatAmount(cartTotalAmount?.price)} {t('common:uzs')}
                </span>
              ) : null}
              <span className="text-primary font-semibold text-[20px]">
                {formatAmount(
                  cartTotalAmount?.price_discount !== 0
                    ? cartTotalAmount?.price_discount
                    : cartTotalAmount?.price
                )}{' '}
                <span className="text-black dark:text-white text-xs font-normal">
                  {t('common:uzs')}
                </span>
              </span>
            </div>
          </div>
          <Button
            type="primary"
            className="h-[48px] max-w-[127px] rounded-xl disabled:dark:border-dborder disabled:dark:bg-dborder disabled:dark:text-gray-400"
            disabled={data?.is_address ? !data?.is_address : !activeCompany}
            onClick={() => mutateCreateOrder()}
            loading={isCreatingOrder}
          >
            {t('actions:checkout')}
          </Button>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        closable={false}
        width={700}
        classNames={{
          body: 'dark:bg-dsecondary',
          content: 'dark:bg-dsecondary',
        }}
      >
        <div className="p-6">
          <div className="flex flex-col mb-6 items-center gap-2 text-center">
            <OrderCheckIcon className="text-black mb-6 dark:text-white text-[125px]" />
            <h2 className="text-xl font-medium text-black dark:text-white">
              {t('common:order-created-title')}
            </h2>
            <p className="max-w-[500px] text-black dark:text-gray-400">
              {t('common:order-created-description', { value: successData?.id })}
            </p>
          </div>

          <div className="w-full border border-gray-200 dark:border-dborder rounded-lg p-4 mb-8">
            <div className="flex justify-between py-2">
              <span className="text-gray-700 dark:text-white">{t('fields:date.label')}</span>
              <span className="text-gray-900 dark:text-white">
                {successData?.created_at
                  ? dayjs(successData?.created_at).format('DD.MM.YYYY, HH:mm')
                  : null}
              </span>
            </div>

            <div className="flex justify-between py-2 border-t dark:border-dborder border-gray-100">
              <span className="text-gray-700 dark:text-white">{t('fields:total.label2')}</span>
              <span className="text-gray-900 dark:text-white">
                {formatAmount(successData?.price)} {t('common:uzs')}
              </span>
            </div>

            {/* <div className="flex justify-between py-2 border-t dark:border-dborder border-gray-100">
              <span className="text-gray-700 dark:text-white">
                {t('fields:total_amount.label')}
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatAmount(successData?.price)} {t('common:uzs')}
              </span>
            </div> */}
          </div>

          <Button
            type="primary"
            block
            onClick={() => {
              setIsModalOpen(false)
              queryClient.invalidateQueries({ queryKey: 'cart-products' })
              push('/')
              setSuccessData(null)
              setCartCount(0)
            }}
          >
            {t('actions:continue')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ShoppingCartSidebar
