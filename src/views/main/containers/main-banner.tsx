import Link from 'next/link'
import Image from 'next/image'
import { Button, Skeleton } from 'antd'
import Carousel from 'react-multi-carousel'
import { useQuery } from '@tanstack/react-query'

import { API_HOST } from '@/config'
import { getPosters } from '../services'

const responsive = {
  desktop: {
    breakpoint: { max: 4000, min: 1280 },
    items: 1,
  },
  laptop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
  },
}

const MainBanner = () => {
  const { data: posters } = useQuery({
    queryKey: ['posters'],
    queryFn: () => getPosters(),
  })

  return (
    <div className="mb-4 lg:mb-10 overflow-hidden lg:rounded-2xl">
      {posters ? (
        <Carousel
          responsive={responsive}
          swipeable
          draggable
          ssr
          autoPlaySpeed={4000}
          autoPlay
          showDots
          infinite
          keyBoardControl
          transitionDuration={600}
          removeArrowOnDeviceType={['tablet', 'mobile']}
        >
          {posters?.results?.map((poster) => (
            <Link
              href={`/posters/${poster?.id}`}
              key={`poster-${poster?.id}`}
              className="
                relative block bg-secondary-light
                lg:h-[400px]
                md:h-[350px]
                sm:h-[280px]
                h-[220px]
              "
            >
              {poster?.img_web ? (
                <Image
                  draggable={false}
                  fill
                  alt="poster image"
                  src={API_HOST + poster?.img_web}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 1024px) 100vw,
                         1240px"
                />
              ) : null}
              <Button
                type="primary"
                className="
                  absolute right-10 bottom-10
                  sm:right-5 sm:bottom-5
                  text-sm sm:text-xs
                "
              >
                Подробно
              </Button>
            </Link>
          ))}
        </Carousel>
      ) : (
        <Skeleton.Input
          className="w-full  lg:h-[400px]
                md:h-[350px]
                sm:h-[280px]
                h-[220px]"
          active
        />
      )}
    </div>
  )
}

export default MainBanner
