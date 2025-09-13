import { useTranslation } from 'next-i18next'

import { API_HOST } from '@/config'
import CImage from '@/components/ui/cimage'

import NoPhoto from '@/assets/nophoto.png'

import type { FC } from 'react'
import type { IProduct } from '@/views/search/types'

const ProductsTableCard: FC<IProduct> = (props) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="size-[50px] outline-none shrink-0 bg-background-light rounded-lg overflow-hidden"
      >
        <CImage
          src={props?.image_url ? API_HOST + props?.image_url : NoPhoto}
          alt={props?.title}
          width={50}
          height={50}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </button>
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
