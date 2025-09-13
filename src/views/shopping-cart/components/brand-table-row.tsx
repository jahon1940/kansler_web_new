import type { FC } from 'react'
import type { IProduct } from '../types'

const BrandTableRow: FC<IProduct> = (props) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="bg-[#F5F5F5] dark:bg-dsecondary px-1.5 w-fit py-0.5 text-[10px] rounded">
        {props?.organization?.name}
      </span>
      <span className="text-[10px] bg-white dark:bg-dsecondary dark:border-dborder px-1.5 py-0.5 line-clamp-1 rounded border w-fit">
        {props?.brand?.name}
      </span>
    </div>
  )
}

export default BrandTableRow
