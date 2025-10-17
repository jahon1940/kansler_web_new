import NoPhoto from '@/assets/nophoto.png'
import { API_HOST, API_HOST_MIREL } from '@/config'

import type { StaticImageData } from 'next/image'

const getImageUrl = ({
  url,
  isContractor,
}: {
  url: string | undefined
  isContractor: boolean
}): string | StaticImageData => {
  if (!url) {
    return NoPhoto
  }

  if (isContractor) {
    return API_HOST_MIREL + url
  }

  return API_HOST + url
}

export default getImageUrl
