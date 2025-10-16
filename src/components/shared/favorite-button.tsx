import { Button } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAuthStore from '@/store/auth-store'
import { addToFav, removeFromFav } from '@/services'
import useCounterStore from '@/store/counter-store'

import HeartBoldIcon from '../icons/heart-bold'
import HeartOutlineIcon from '../icons/heart-outline'

import type { FC, MouseEvent } from 'react'
import type { IProduct } from '@/views/shopping-cart/types'
import { ROUTES } from '@/constants'

interface IProps extends IProduct {
  small?: boolean
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed' | undefined
}

const FavoriteButton: FC<IProps> = (props) => {
  const { push } = useRouter()
  const queryClient = useQueryClient()

  const [isFav, setIsFav] = useState(false)
  const isSignedIn = useAuthStore((state) => state.isSignedIn)
  const { incrementFavorites, decrementFavorites } = useCounterStore()

  useEffect(() => {
    setIsFav(props.in_fav)
  }, [props.id, props.in_fav])

  const { mutate: mutateAddToFav, isPending: isAdding } = useMutation({
    mutationFn: () => addToFav({ product_id: props.id }),
    onSuccess: () => {
      setIsFav(true)
      incrementFavorites()
      queryClient.invalidateQueries()
    },
  })

  const { mutate: mutateRemoveFromFav, isPending: isRemoving } = useMutation({
    mutationFn: () => removeFromFav(props.id),
    onSuccess: () => {
      setIsFav(false)
      decrementFavorites()
      queryClient.invalidateQueries()
    },
  })

  const clickHandler = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()

    // if (isSignedIn) {
    //   if (isFav) {
    //     mutateRemoveFromFav()
    //   } else {
    //     mutateAddToFav()
    //   }
    // } else {
    //   push(ROUTES.LOGIN)
    // }

    if (isFav) {
      mutateRemoveFromFav()
    } else {
      mutateAddToFav()
    }
  }

  return (
    <Button
      size={props?.small ? 'small' : undefined}
      type={props?.type ? props?.type : props?.small ? 'text' : undefined}
      icon={
        isFav ? (
          <HeartBoldIcon className="text-xl text-error" />
        ) : (
          <HeartOutlineIcon className="text-xl" />
        )
      }
      onClick={clickHandler}
      loading={isAdding || isRemoving}
    />
  )
}

export default FavoriteButton
