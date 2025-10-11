import { useTranslation } from 'next-i18next'

import { API_HOST } from '@/config'

import CImage from '@/components/ui/cimage'
import useAuthStore from '@/store/auth-store'

import NoPhoto from '@/assets/nophoto.png'
import FavoriteButton from '@/components/shared/favorite-button'

import type { FC } from 'react'
import type { IProduct } from '../types'

const ProductsTableCard: FC<IProduct> = (props) => {
  const { t } = useTranslation()
  const isSignedIn = useAuthStore((state) => state.isSignedIn)

  return (
    <div className="flex items-center gap-3">
      <div className="size-[75px] relative outline-none shrink-0 bg-background-light rounded-lg overflow-hidden">
        <CImage
          src={props?.image_url ? API_HOST + props?.image_url : NoPhoto}
          alt={props?.title}
          width={50}
          height={50}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        <div className="absolute flex flex-col gap-2 right-0.5 top-0.5 z-0">
          {/* {isSignedIn && props?.id ? <FavoriteButton small {...props} /> : null} */}
          <FavoriteButton small {...props} />
        </div>
      </div>
      <div className="flex flex-col">
        <small className="text-[12px] font-mono font-thin line-clamp-1">
          {t('fields:vendor_code.label')}: {props?.vendor_code}
        </small>
        <div className="line-clamp-2 font-medium break-all dark:text-white text-[14px] text-black text-start">
          {props?.title}
        </div>
      </div>
    </div>
  )
}

export default ProductsTableCard
