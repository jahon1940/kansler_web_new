import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { useState, type FC } from 'react'
import type { ImageProps } from 'next/image'

const CImage: FC<ImageProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Image
      {...props}
      alt={props.alt}
      className={twMerge('select-none', isLoading ? 'cblur' : 'remove-blur', props.className)}
      onLoad={() => setIsLoading(false)}
      draggable={false}
    />
  )
}

export default CImage
