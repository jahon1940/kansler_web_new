import type { FC } from 'react'
import type { IProduct } from '@/views/search/types'

const MeasureTableRow: FC<IProduct> = (props) => {
  return (
    <div className="flex flex-col gap-1 text-center">
      <span>{props?.quantity_in_box}</span>
      <span>{props?.measure}</span>
    </div>
  )
}

export default MeasureTableRow
