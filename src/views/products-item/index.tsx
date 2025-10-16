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

  const maxQuantity = data?.stocks.reduce((sum, item) => sum + item.quantity, 0)
  const maxContractorQuantity = data?.contractor?.stocks?.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

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

  const image = data?.contractor?.image_url || data?.image_url
  // src={image ? API_HOST + image : NoPhoto}

  return (
    <div className="custom-container py-6 w-full">
      <div className="flex lg:items-center mb-6 gap-4">
        <Button
          icon={<ArrowLeftOutlineIcon />}
          onClick={handleBack}
          className="dark:bg-dborder shrink-0 dark:text-white dark:border-dborder"
        />
        <h1 className="text-xl lg:text-2xl font-bold dark:text-white">{data?.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="bg-white w-full h-full max-h-[500px] rounded-lg relative flex-col-reverse lg:flex-row flex gap-2">
          {data ? (
            <div className="absolute flex flex-col gap-2 lg:right-4 top-0 right-0 lg:top-4 z-[1]">
              {/* {isSignedIn ? <FavoriteButton {...data} /> : null} */}
              <FavoriteButton {...data} />
              <ShareButtonModal slug={data?.title_slug} title={data?.title} />
            </div>
          ) : null}
          <div className="flex lg:flex-col shrink-0 gap-2 lg:h-full overflow-y-auto">
            <div className="size-[100px] shrink-0 border rounded-xl">
              <CImage
                alt="main image"
                width={300}
                height={300}
                src={image ? API_HOST + image : NoPhoto}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="size-[100px] shrink-0 border rounded-xl">
              <CImage
                alt="main image"
                width={300}
                height={300}
                src={image ? API_HOST + image : NoPhoto}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="size-[100px] shrink-0 border rounded-xl">
              <CImage
                alt="main image"
                width={300}
                height={300}
                src={image ? API_HOST + image : NoPhoto}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="size-[100px] shrink-0 border rounded-xl">
              <CImage
                alt="main image"
                width={300}
                height={300}
                src={image ? API_HOST + image : NoPhoto}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="size-[100px] shrink-0 border rounded-xl">
              <CImage
                alt="main image"
                width={300}
                height={300}
                src={image ? API_HOST + image : NoPhoto}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex-1 shrink-0 h-full rounded-2xl overflow-hidden bg-white border border-secondary-light/20">
            <CImage
              alt="main image"
              width={300}
              height={300}
              src={image ? API_HOST + image : NoPhoto}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-dprimary p-1 lg:p-8 rounded-lg flex flex-col gap-6">
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

            {/* {isSignedIn && data && pathname !== '/' ? (
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
            ) : null} */}
            <CartInputStepper
              longButton
              productId={data?.id}
              inCart={data?.in_cart}
              minQuantity={data?.min_box_quantity}
              // isInStock={data?.max_quantity > 0}
            />
          </div>

          <div className="flex flex-col">
            {user?.is_pos ? (
              <Text className="text-[14px] block mt-2 dark:text-white">
                <span>{t('common:its-remaining', { value: data?.organization?.name })}</span>:{' '}
                <span className="text-primary font-bold dark:text-white text-lg">
                  {formatAmount(maxContractorQuantity || maxQuantity)} {data?.measure}
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
        <div className="bg-white dark:bg-dprimary p-1 lg:p-8 rounded-lg mt-5">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">
            {t('fields:description.label')}:
          </h3>
          <p className="text-black dark:text-white">{data?.description}</p>
        </div>
      ) : null}

      <div className="overflow-hidden mt-5">
        <h3 className="text-xl px-1 lg:p-0 font-semibold m-0 lg:mb-4 dark:text-white">
          {t('common:similar-products')}:
        </h3>

        <SimilarProducts id={data?.category?.parent} />
      </div>
    </div>
  )
}

export default ProductsItemView
