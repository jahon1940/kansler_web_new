import { Select } from 'antd'

import ArrowDownBoldIcon from '../icons/arrow-down-bold'

import type { FC } from 'react'
import type { SelectProps } from 'antd'
import { twMerge } from 'tailwind-merge'

const CSelect: FC<SelectProps> = (props) => (
  <Select
    {...props}
    className={twMerge('', props.className)}
    suffixIcon={<ArrowDownBoldIcon className="text-[16px] text-black dark:text-white" />}
  />
)

export default CSelect
