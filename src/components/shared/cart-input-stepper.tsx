import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, InputNumber, Space } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useCounterStore from '@/store/counter-store'
import { formatAmount } from '@/utils/format-amount'
import { addToCart, deleteFromCart } from '@/views/shopping-cart/services'

import AddOutlineIcon from '../icons/add-outline'
import MadeToOrder from './made-to-order'
import MinusOutlineIcon from '../icons/minus-outline'
import ShoppingCartOutlineIcon from '../icons/shopping-cart-outline'

import type { FC, MouseEvent } from 'react'

interface IProps {
  quantity?: number
  productId?: number
  inCart?: boolean
  minQuantity?: number
  longButton?: boolean
  isInStock?: boolean
}

const CartInputStepper: FC<IProps> = ({
  productId,
  quantity = 0,
  inCart = false,
  minQuantity,
  longButton,
  isInStock,
}) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  const queryClient = useQueryClient()

  const [value, setValue] = useState<number>(quantity)
  const [isInCart, setIsInCart] = useState<boolean>(false)
  const { decrementCart, incrementCart } = useCounterStore()

  const { mutate: mutateAdd, isPending: isAdding } = useMutation({
    mutationFn: () => addToCart({ quantity: value, product_id: productId as number }),
    onSuccess: () => {
      queryClient.invalidateQueries()

      setIsInCart(true)

      if (!inCart) {
        incrementCart()
      }
    },
    onError: () => {
      setValue((prev) => (prev ? prev - 1 : 0))
    },
  })

  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteFromCart(productId as number),
    onSuccess: () => {
      queryClient.invalidateQueries()
      decrementCart()

      setValue(0)
      setIsInCart(false)
    },
  })

  const handleStopPropagation = (e: MouseEvent) => {
    e.stopPropagation()
  }

  // const handleIncrement = () =>
  //   setValue((prev) => Math.min(prev + (minQuantity ? minQuantity : 1), 100000))
  // const handleDecrement = () =>
  //   setValue((prev) => Math.max(prev - (minQuantity ? minQuantity : 1), 0))

  const handleIncrement = () => {
    setValue((prev) => Math.min(prev + 1, 100000))
  }
  const handleDecrement = () => {
    setValue((prev) => Math.max(prev - 1, 0))
  }
  const handleChange = (val: number | null) => {
    setValue(val ?? 0)
  }

  useEffect(() => {
    setIsInCart(inCart)
  }, [productId, inCart])

  return (
    <div className="flex flex-col gap-1 z-[1]">
      <div
        className={twMerge(
          'flex relative items-center gap-2',
          longButton && !isInCart ? 'justify-between' : 'justify-end'
        )}
      >
        {/* {!isInStock || (isInCart && pathname !== '/shopping-cart') ? null : ( */}
        {isInCart && pathname !== '/shopping-cart' ? null : (
          <Space.Compact className={longButton ? '' : 'flex-1'}>
            <Button
              size="middle"
              type="primary"
              className={twMerge(
                'text-[16px]',
                Boolean(value < 1) ? 'border-primary/20 bg-primary/60 text-white' : ''
              )}
              icon={<MinusOutlineIcon />}
              onClick={(e) => {
                handleStopPropagation(e)
                handleDecrement()

                if (pathname.includes('shopping-cart')) {
                  // if (value === (minQuantity === 0 ? 1 : minQuantity)) {
                  if (value === 1) {
                    mutateDelete()
                  } else {
                    mutateAdd()
                  }
                }
              }}
              disabled={Boolean(value < 1)}
            />
            <InputNumber
              key={productId}
              size="middle"
              variant="filled"
              controls={false}
              // min={minQuantity || 1}
              min={1}
              max={100000}
              maxLength={7}
              formatter={formatAmount}
              parser={(val) =>
                (val ? (Number(val?.replace(/\s/g, '')) as 0 | 100000) : undefined) as any
              }
              className={twMerge(
                '[&_input]:text-center flex-1 bg-white dark:bg-dsecondary [&_input]:dark:text-white border-t-primary border-b-primary',
                longButton ? 'w-[120px]' : 'w-auto'
              )}
              onClick={handleStopPropagation}
              value={value || undefined}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isAdding) {
                  mutateAdd()
                }
              }}
            />

            <Button
              size="middle"
              type="primary"
              icon={<AddOutlineIcon />}
              className={twMerge(
                'text-[16px]',
                Boolean(value > 99999) ? 'border-primary/20 bg-primary/60 text-white' : ''
              )}
              onClick={(e) => {
                handleStopPropagation(e)
                handleIncrement()
                if (pathname.includes('shopping-cart')) {
                  mutateAdd()
                }

                // mutateAdd()
              }}
              disabled={Boolean(value > 99999)}
            />
          </Space.Compact>
        )}

        {/* {!isInStock ? <MadeToOrder /> : null} */}

        {isInCart ? (
          longButton ? (
            <Button
              size="middle"
              variant="solid"
              color="red"
              className="flex items-center font-normal"
              loading={isDeleting}
              onClick={(e) => {
                e.stopPropagation()
                if (productId) {
                  mutateDelete()
                }
              }}
            >
              <span className="text-[12px]">{t('actions:remove-from-cart')}</span>{' '}
              <ShoppingCartOutlineIcon className="text-[16px]" />
            </Button>
          ) : (
            <Button
              size="middle"
              variant="solid"
              color="red"
              icon={<ShoppingCartOutlineIcon />}
              className="text-[16px]"
              loading={isDeleting}
              onClick={(e) => {
                e.stopPropagation()
                if (productId) {
                  mutateDelete()
                }
              }}
            />
          )
        ) : longButton ? (
          <Button
            size="middle"
            type="primary"
            className="flex items-center font-normal"
            loading={isAdding}
            onClick={(e) => {
              e.stopPropagation()
              if (value && productId) {
                mutateAdd()
              }
            }}
          >
            <span className="text-[12px]">{t('actions:add-to-cart')}</span>{' '}
            <ShoppingCartOutlineIcon className="text-[16px]" />
          </Button>
        ) : (
          <Button
            size="middle"
            type="primary"
            icon={<ShoppingCartOutlineIcon />}
            className="text-[16px] shrink-0"
            loading={isAdding}
            onClick={(e) => {
              e.stopPropagation()
              if (value && productId) {
                mutateAdd()
              }
            }}
          />
        )}
      </div>

      {/* {typeof minQuantity === 'number' && minQuantity >= 0 ? (
        <span className="text-primary dark:text-white text-[10px]">
          {t('common:min-order-quantity')}: {formatAmount(minQuantity || 1)}
        </span>
      ) : null} */}
    </div>
  )
}

export default CartInputStepper
