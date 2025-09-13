import Link from 'next/link'
import Image from 'next/image'
import { Button, Skeleton } from 'antd'
import Carousel from 'react-multi-carousel'
import { useQuery } from '@tanstack/react-query'

import { API_HOST } from '@/config'
import { getPosters } from '../services'

const responsive = {
  tinyMobile: {
    breakpoint: { max: 4000, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
}

const MainBanner = () => {
  const { data: posters } = useQuery({
    queryKey: ['posters'],
    queryFn: () => getPosters(),
  })

  return (
    <div className="mb-10 overflow-hidden rounded-2xl">
      {posters ? (
        <Carousel
          responsive={responsive}
          swipeable={false}
          draggable={false}
          ssr={true}
          autoPlaySpeed={3000}
          autoPlay
          showDots
          infinite
          keyBoardControl={true}
          transitionDuration={500}
          removeArrowOnDeviceType={['mobile']}
        >
          {posters?.results?.map((poster) => (
            <Link
              href={`/posters/${poster?.id}`}
              key={`poster-${poster?.id}`}
              className="bg-secondary-light relative h-[400px] block"
            >
              {poster?.img_web ? (
                <Image
                  draggable={false}
                  width={1240}
                  height={400}
                  alt="poster image"
                  src={API_HOST + poster?.img_web}
                  className="w-full h-full object-fill"
                />
              ) : null}
              <Button type="primary" className="absolute right-10 bottom-10">
                Подробно
              </Button>
            </Link>
          ))}
        </Carousel>
      ) : (
        <Skeleton.Input className="w-full h-[400px]" active />
      )}
    </div>
  )
}

export default MainBanner
