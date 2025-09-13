import { Button } from 'antd'
import { twMerge } from 'tailwind-merge'

import useViewTypeStore from '@/views/search/store/use-view-type-store'

import Grid2OutlineIcon from '@/components/icons/grid-2-outline'
import SliderVerticalOutline from '@/components/icons/slider-vertical-outline'

import type { FC } from 'react'

const ViewTypeButton: FC<{ white?: boolean }> = ({ white }) => {
  const { setIsTableType, isTableType } = useViewTypeStore((store) => store)

  return (
    <Button
      // color="default"
      // variant="filled"
      icon={isTableType ? <SliderVerticalOutline /> : <Grid2OutlineIcon />}
      className={twMerge(
        'text-[20px] dark:bg-dsecondary dark:text-white dark:border-dborder',
        white && 'bg-white'
      )}
      onClick={setIsTableType}
    />
  )
}

export default ViewTypeButton
