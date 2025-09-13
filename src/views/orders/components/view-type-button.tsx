import { Button } from 'antd'

import useViewTypeStore from '../store/use-view-type-store'

import Grid2OutlineIcon from '@/components/icons/grid-2-outline'
import SliderVerticalOutline from '@/components/icons/slider-vertical-outline'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const ViewTypeButton: FC<{ white?: boolean }> = ({ white }) => {
  const { setIsTableType, isTableType } = useViewTypeStore((store) => store)

  return (
    <Button
      color="default"
      variant="filled"
      icon={isTableType ? <SliderVerticalOutline /> : <Grid2OutlineIcon />}
      className={twMerge('text-[20px]', white && 'bg-white')}
      onClick={setIsTableType}
    />
  )
}

export default ViewTypeButton
