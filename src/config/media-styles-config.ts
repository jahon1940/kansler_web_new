import { createMedia } from '@artsy/fresnel'

const AppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 767,
    md: 1100,
    lg: 1400,
  },
})

export const mediaStyles = AppMedia.createMediaStyle()

export const { Media, MediaContextProvider } = AppMedia
