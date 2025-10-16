import { IProduct } from '@/views/shopping-cart/types'
import type { FC } from 'react'

const MeasureTableRow: FC<IProduct> = (props) => {
  return (
    <div className="flex flex-col gap-1 text-center">
      <span>{props?.quantity_in_box}</span>
      <span>{props?.measure}</span>
    </div>
  )
}

export default MeasureTableRow
