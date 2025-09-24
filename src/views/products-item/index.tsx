import { useRouter } from 'next/router'
import { Button, Typography } from 'antd'
import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'

import { API_HOST } from '@/config'
import { getContractor } from '@/services'
import useAuthStore from '@/store/auth-store'
import { getProduct } from '../search/services'
import { getAuthCurrent } from '../profile/services'
import { formatAmount } from '@/utils/format-amount'

import CImage from '@/components/ui/cimage'

import MadeToOrder from '@/components/shared/made-to-order'
import FavoriteButton from '@/components/shared/favorite-button'
import ShareButtonModal from '@/components/shared/share-button-modal'
import CartInputStepper from '@/components/shared/cart-input-stepper'
import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'

import NoPhoto from '@/assets/nophoto.png'
import SimilarProducts from './containers/similar-products'

const { Text } = Typography

const ProductsItemView = () => {
  const { t } = useTranslation()
  // const [quantity, setQuantity] = useState(1)
  const { push, query, pathname, back } = useRouter()
  const isSignedIn = useAuthStore((state) => state.isSignedIn)

  const { data } = useQuery({
    queryKey: ['products-item', query.productSlug],
    queryFn: () => getProduct(query.productSlug as string),
    enabled: Boolean(query.productSlug),
  })

  const { data: user } = useQuery({
    queryKey: ['auth-current', isSignedIn],
    queryFn: () => getAuthCurrent(),
    enabled: isSignedIn,
  })

  const { data: contractor } = useQuery({
    queryKey: ['product-contractor', data?.id, isSignedIn],
    queryFn: () => getContractor(data?.id as number),
    enabled: Boolean(data?.id && isSignedIn),
  })

  const handleBack = () => {
    if (window.history.length > 2) {
      back()
    } else {
      push('/')
    }
  }

  const fields = [
    { value: data?.organization.name, label: t('fields:organization.label2') },
    { value: data?.brand.name, label: t('fields:brand.label'), isBrand: true },
    { value: data?.category.name, label: t('fields:category.label') },
    { value: data?.made_in.name, label: t('fields:made_in.label') },
    { value: data?.vendor_code, label: t('fields:vendor_code.label') },
    { value: data?.classifier_code, label: t('fields:classifier_code.label') },
    { value: data?.classifier_title, label: t('fields:classifier_title.label') },
    { value: data?.measure, label: t('fields:measure.label') },
    {
      value: data?.packagename,
      label: t('fields:packagename.label'),
      available: Boolean(data?.packagename),
    },
    {
      value: data?.packagecode,
      label: t('fields:packagecode.label'),
      available: Boolean(data?.packagecode),
    },
    {
      value: data?.quantity_in_box,
      label: t('fields:quantity_in_box.label'),
      available: Boolean(data?.quantity_in_box),
    },
  ]

  return (
    <div className="custom-container py-6 w-full">
      <div className="flex items-center mb-6 gap-4">
        <Button
          icon={<ArrowLeftOutlineIcon />}
          onClick={handleBack}
          className="dark:bg-dborder dark:text-white dark:border-dborder"
        />
        <h1 className="text-2xl font-bold dark:text-white">{data?.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="bg-white p-8 rounded-lg relative">
          {data ? (
            <div className="absolute flex flex-col gap-2 right-4 top-4 z-[1]">
              {isSignedIn ? <FavoriteButton {...data} /> : null}
              <ShareButtonModal slug={data?.title_slug} title={data?.title} />
            </div>
          ) : null}
          <div className="flex justify-center max-h-[500px]">
            <CImage
              src={data?.image_url ? API_HOST + data?.image_url : NoPhoto}
              alt="Буквы на магните"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-dprimary p-8 rounded-lg flex flex-col gap-6">
          <div className="flex flex-col border-[8px] gap-4 rounded-xl p-4 dark:border-dborder ">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold dark:text-white">
                {data ? (
                  <span>
                    {formatAmount(
                      isSignedIn && data?.price_discount !== 0 ? data?.price_discount : data?.price
                    )}{' '}
                    <span className="text-[20px]">{t('common:uzs')}</span>
                  </span>
                ) : null}
                {isSignedIn && data && data?.price_discount !== 0 ? (
                  <span className="text-secondary-light font-semibold ml-2 text-[18px] line-through">
                    {formatAmount(data?.price)} <span>{t('common:uzs')}</span>
                  </span>
                ) : null}
              </h2>

              {isSignedIn ? (
                <Text className="text-[14px] mb-4 block dark:text-white">
                  <span>
                    {t('fields:retailer_price.label')} ({t('common:recommended-for-sale')})
                  </span>
                  :{' '}
                  <span className="text-primary text-lg font-bold dark:text-white">
                    {formatAmount(data?.retailer_price)}{' '}
                    <span className="text-[14px]">{t('common:uzs')}</span>
                  </span>
                </Text>
              ) : null}
            </div>

            {isSignedIn && data && pathname !== '/' ? (
              data?.max_quantity > 0 ? (
                <CartInputStepper
                  longButton
                  productId={data?.id}
                  inCart={data?.in_cart}
                  minQuantity={data?.min_box_quantity}
                  isInStock={data?.max_quantity > 0}
                />
              ) : (
                <MadeToOrder />
              )
            ) : null}
          </div>

          <div className="flex flex-col">
            {user?.is_pos ? (
              <Text className="text-[14px] block mt-2 dark:text-white">
                <span>{t('common:its-remaining', { value: data?.organization?.name })}</span>:{' '}
                <span className="text-primary font-bold dark:text-white text-lg">
                  {formatAmount(data?.max_quantity)} {data?.measure}
                </span>
              </Text>
            ) : null}

            {contractor?.contractor ? (
              <Text className="text-[14px] block mt-2 dark:text-white">
                <span>
                  {t('common:your-remaining', {
                    value: contractor?.contractor?.[0]?.stock?.name,
                  })}
                </span>
                :{' '}
                <span className="text-primary font-bold dark:text-white text-lg">
                  {formatAmount(contractor?.contractor?.[0]?.quantity)} {data?.measure}
                </span>
              </Text>
            ) : null}
          </div>

          <div className="mt-2 flex flex-col gap-2">
            {fields.map((field, i) => {
              if (field?.available === false) {
                return null
              }

              return (
                <Text key={field?.label + i} className="grid grid-cols-2 w-full dark:text-white">
                  <strong>{field?.label}</strong>
                  <span>
                    :{' '}
                    {field.isBrand ? (
                      <span className="px-2 ml-2 text-[12px] py-0.5 border border-secondary-light dark:bg-dsecondary dark:border-dborder rounded-lg">
                        {field?.value}
                      </span>
                    ) : (
                      field?.value
                    )}
                  </span>
                </Text>
              )
            })}
          </div>
        </div>
      </div>

      {data?.description ? (
        <div className="bg-white dark:bg-dprimary p-8 rounded-lg mt-5">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">
            {t('fields:description.label')}:
          </h3>
          <p className="text-black dark:text-white">{data?.description}</p>
        </div>
      ) : null}

      <div className="rounded-lg overflow-hidden mt-5">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          {t('common:similar-products')}:
        </h3>

        <SimilarProducts id={data?.category?.parent} />
      </div>
    </div>
  )
}

export default ProductsItemView
