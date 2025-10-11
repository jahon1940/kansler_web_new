import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'

import { API_HOST } from '@/config'
import useAuthStore from '@/store/auth-store'
import { formatAmount } from '@/utils/format-amount'
import useProductModalStore from '@/store/product-modal-store'

import CImage from '../ui/cimage'
import MadeToOrder from './made-to-order'
import FavoriteButton from './favorite-button'
import CartInputStepper from './cart-input-stepper'
import ProductDetailedModal from './product-detailed-modal'

import type { FC } from 'react'
import type { IProduct } from '@/views/search/types'

import NoPhoto from '@/assets/nophoto.png'

interface IProps extends IProduct {
  small?: boolean
  fixedWidth?: boolean
}

const ProductCard: FC<IProps> = (props) => {
  const { t } = useTranslation()
  const { query } = useRouter()
  const isSignedIn = useAuthStore((state) => state.isSignedIn)
  const { setIsOpen, isOpen } = useProductModalStore((store) => store)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // if (pathname !== '/') {
    //   replace(
    //     {
    //       pathname: pathname,
    //       query: queryString.stringify({ ...query, product: null }, { skipNull: true }),
    //     },
    //     undefined,
    //     { scroll: false }
    //   )
    // }
  }

  const handleClick = () => {
    setIsModalOpen(true)
    // if (pathname !== '/') {
    //   replace({ pathname: pathname, query: { ...query, product: props.id } }, undefined, {
    //     scroll: false,
    //   })
    // }
  }

  useEffect(() => {
    if (query.product === props.id + '' && !isOpen) {
      setIsModalOpen(true)
      setIsOpen(true)
    }
  }, [query.product])

  return (
    <>
      <div
        className={twMerge(
          'p-2 bg-white border shadow-lg cursor-pointer dark:bg-dprimary dark:border-dborder hover:border-primary/50 duration-200 rounded-lg flex flex-col',
          props?.small ? 'h-full' : '',
          props?.fixedWidth ? 'w-[245px]' : ''
        )}
        onClick={handleClick}
      >
        <div
          className={twMerge(
            'bg-white relative overflow-hidden rounded-t-md',
            props.small ? 'h-[180px]' : 'h-[200px] '
          )}
        >
          <CImage
            alt="product image"
            width={150}
            height={150}
            src={
              props?.image_url
                ? props?.image_url?.includes('http')
                  ? props.image_url
                  : API_HOST + props.image_url
                : NoPhoto
            }
            className="h-full w-full object-center object-contain"
            loading="lazy"
          />
          <span className="absolute bottom-1 right-1 dark:bg-dsecondary dark:border-dborder dark:text-white bg-background border rounded px-1.5 py-0.5 text-[10px]">
            {props?.brand?.name}
          </span>
          {/* {props && isSignedIn ? ( */}
          <div className="absolute flex flex-col gap-2 right-0 top-0 z-[1]">
            <FavoriteButton type="text" {...{ ...props, small: undefined }} />
          </div>
          {/* ) : null} */}
        </div>

        <div className="flex flex-1 flex-col mb-2 dark:text-white">
          <span className="text-[12px] font-mono font-thin line-clamp-1">
            {t('fields:vendor_code.label')}: {props?.vendor_code}
          </span>
          <span className="text-[14px] line-clamp-2 mb-2 flex-1">{props?.title}</span>

          <div className="text-[14px] font-bold">
            <span className="text-primary dark:text-white">
              {formatAmount(
                isSignedIn && props?.price_discount !== 0 ? props?.price_discount : props?.price
              )}{' '}
              <span className="text-[12px]">{t('common:uzs')}</span>
            </span>
            {isSignedIn && props?.price_discount !== 0 ? (
              <span className="text-secondary-light ml-2 line-through ">
                {formatAmount(props?.price)} <span className="text-[12px]">{t('common:uzs')}</span>
              </span>
            ) : null}
          </div>
        </div>
        {/* {isSignedIn ? (
          props.max_quantity > 0 ? (
            <CartInputStepper
              productId={props?.id}
              inCart={props?.in_cart}
              minQuantity={props?.min_box_quantity}
              isInStock={props?.max_quantity > 0}
            />
          ) : (
            <MadeToOrder />
          )
        ) : null} */}
        <CartInputStepper
          productId={props?.id}
          inCart={props?.in_cart}
          minQuantity={props?.min_box_quantity}
          isInStock={props?.max_quantity > 0}
        />
      </div>

      <ProductDetailedModal {...props} open={isModalOpen} onCancel={handleCloseModal} />
    </>
  )
}

export default ProductCard
