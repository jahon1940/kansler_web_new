import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Button, Modal, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { API_HOST } from '@/config'
import { getContractor } from '@/services'
import useAuthStore from '@/store/auth-store'
import { formatAmount } from '@/utils/format-amount'
import { getAuthCurrent } from '@/views/profile/services'

import CImage from '../ui/cimage'
import MadeToOrder from './made-to-order'
import FavoriteButton from './favorite-button'
import ShareButtonModal from './share-button-modal'
import CartInputStepper from './cart-input-stepper'
import CloseSquareOutlineIcon from '../icons/close-square-outline'
import NoPhoto from '@/assets/nophoto.png'

import type { FC } from 'react'
import type { IProduct } from '@/views/search/types'

const { Title, Text } = Typography

interface IProps extends IProduct {
  open: boolean
  onCancel: () => void
  quantity?: number
}

const ProductDetailedModal: FC<IProps> = (props) => {
  const { t } = useTranslation()
  const isSignedIn = useAuthStore((state) => state.isSignedIn)

  const { data: contractor } = useQuery({
    queryKey: ['product-contractor', props?.id, isSignedIn, props?.open],
    queryFn: () => getContractor(props?.id as number),
    enabled: Boolean(props?.id && isSignedIn && props?.open),
  })

  const { data: user } = useQuery({
    queryKey: ['auth-current', isSignedIn],
    queryFn: () => getAuthCurrent(),
    enabled: isSignedIn,
  })

  const clickHandler = () => props?.onCancel?.()

  return (
    <Modal
      width="100%"
      style={{ maxWidth: '1240px' }}
      maskClosable={false}
      open={props.open}
      onCancel={clickHandler}
      footer={null}
      centered
      classNames={{
        body: 'max-h-[90vh] overflow-auto dark:bg-dprimary',
        content: 'dark:bg-dprimary',
      }}
      closeIcon={<CloseSquareOutlineIcon className="text-[30px] dark:text-white" />}
    >
      {props && (
        <div className="flex flex-col h-full gap-5">
          <div className="sticky top-0 bg-white dark:bg-dprimary z-10 py-2 pr-8">
            <Title
              level={4}
              className="mb-0 dark:text-white text-base sm:text-lg md:text-xl lg:text-2xl"
            >
              {props?.title}
            </Title>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 flex-1">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                <div className="flex sm:flex-col gap-2 sm:overflow-y-auto sm:max-h-[456px]">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="size-[80px] sm:size-[100px] shrink-0 border rounded-xl">
                      <CImage
                        alt="product thumbnail"
                        width={300}
                        height={300}
                        src={props?.image_url ? API_HOST + props?.image_url : NoPhoto}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex-1 rounded-2xl overflow-hidden bg-white border border-secondary-light/20 relative">
                  <div className="absolute flex flex-col gap-2 right-4 top-4 z-[1]">
                    {/* {isSignedIn && <FavoriteButton {...{ ...props, small: undefined }} />} */}
                    <FavoriteButton {...{ ...props, small: undefined }} />
                    <ShareButtonModal slug={props?.title_slug} title={props?.title} />
                  </div>
                  <CImage
                    alt="main image"
                    width={300}
                    height={300}
                    src={props?.image_url ? API_HOST + props?.image_url : NoPhoto}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-end">
                <div>
                  <Text className="text-[14px] block dark:text-white">
                    <span>{t('fields:price.label')}</span>:{' '}
                    <span className="text-primary text-lg font-bold dark:text-white">
                      {formatAmount(
                        isSignedIn && props?.price_discount !== 0
                          ? props?.price_discount
                          : props?.price
                      )}{' '}
                      <span className="text-[14px]">{t('common:uzs')}</span>
                    </span>
                    {isSignedIn && props?.price_discount !== 0 && (
                      <span className="text-secondary-light ml-2 line-through text-base">
                        {formatAmount(props?.price)}{' '}
                        <span className="text-[14px]">{t('common:uzs')}</span>
                      </span>
                    )}
                  </Text>

                  {isSignedIn && (
                    <Text className="text-[14px] mt-4 block dark:text-white">
                      <span>
                        {t('fields:retailer_price.label')} ({t('common:recommended-for-sale')})
                      </span>
                      :{' '}
                      <span className="text-primary text-lg font-bold dark:text-white">
                        {formatAmount(props?.retailer_price)}{' '}
                        <span className="text-[14px]">{t('common:uzs')}</span>
                      </span>
                    </Text>
                  )}
                </div>

                {/* {isSignedIn &&
                  (props.max_quantity > 0 ? (
                    <CartInputStepper
                      quantity={props?.quantity}
                      productId={props?.id}
                      minQuantity={props?.min_box_quantity}
                      inCart={props?.in_cart}
                      isInStock={props?.max_quantity > 0}
                    />
                  ) : (
                    <MadeToOrder />
                  ))} */}
                <CartInputStepper
                  quantity={props?.quantity}
                  productId={props?.id}
                  minQuantity={props?.min_box_quantity}
                  inCart={props?.in_cart}
                  isInStock={props?.max_quantity > 0}
                />
              </div>

              <div className="flex flex-col gap-1">
                {user?.is_pos && (
                  <Text className="text-[14px] mt-2 dark:text-white">
                    <span>{t('common:its-remaining', { value: props?.organization?.name })}</span>:{' '}
                    <span className="text-primary font-bold text-lg">
                      {formatAmount(props?.max_quantity)} {props?.measure}
                    </span>
                  </Text>
                )}
                {contractor?.contractor && (
                  <Text className="text-[14px] mt-1 dark:text-white">
                    <span>
                      {t('common:your-remaining', {
                        value: contractor?.contractor?.[0]?.stock?.name,
                      })}
                    </span>
                    :{' '}
                    <span className="text-primary font-bold text-lg">
                      {formatAmount(contractor?.contractor?.[0]?.quantity)} {props?.measure}
                    </span>
                  </Text>
                )}
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2 text-[14px] sm:text-[15px] md:text-[16px] dark:text-white">
              <Text className="lg:grid flex grid-cols-[auto_1fr] gap-2">
                <strong>{t('fields:brand.label')}</strong>:
                <span className="px-2 py-0.5 border text-[12px] border-secondary-light dark:border-dborder dark:bg-dsecondary rounded-lg inline-block">
                  {props?.brand?.name}
                </span>
              </Text>

              <Text>
                <strong>{t('fields:category.label')}</strong>: {props?.category?.name}
              </Text>
              <Text>
                <strong>{t('fields:made_in.label')}</strong>: {props?.made_in?.name}
              </Text>
              <Text>
                <strong>{t('fields:vendor_code.label')}</strong>: {props?.vendor_code}
              </Text>
              <Text>
                <strong>{t('fields:classifier_code.label')}</strong>: {props?.classifier_code}
              </Text>
              <Text>
                <strong>{t('fields:classifier_title.label')}</strong>: {props?.classifier_title}
              </Text>
              <Text>
                <strong>{t('fields:measure.label')}</strong>: {props?.measure}
              </Text>

              {props?.packagename && (
                <Text>
                  <strong>{t('fields:packagename.label')}</strong>: {props?.packagename}
                </Text>
              )}
              {props?.packagecode && (
                <Text>
                  <strong>{t('fields:packagecode.label')}</strong>: {props?.packagecode}
                </Text>
              )}
              {props?.quantity_in_box && (
                <Text>
                  <strong>{t('fields:quantity_in_box.label')}</strong>: {props?.quantity_in_box}
                </Text>
              )}

              <Link href={`/products/${props?.title_slug}`} className="mt-4" onClick={clickHandler}>
                <Button className="w-full dark:bg-primary dark:text-white">
                  {t('common:product-details')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ProductDetailedModal
