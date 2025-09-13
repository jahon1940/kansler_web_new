import Link from 'next/link'
import { Skeleton } from 'antd'
import Carousel from 'react-multi-carousel'
import { useTranslation } from 'next-i18next'
import { useQueries } from '@tanstack/react-query'

import { getBestsellers, getNewArrivals, getPopular, getPromotions } from '../services'

import ProductCard from '@/components/shared/product-card'
import ArrowRightOutlineIcon from '@/components/icons/arrow-right-outline'
import ProductCardSkeleton from '@/components/shared/product-card-skeleton'

// const responsive = {
//   largeDesktop: {
//     breakpoint: { max: 4000, min: 1241 },
//     items: 5,
//     partialVisibilityGutter: 0,
//     slidesToSlide: 4,
//   },
//   desktop: {
//     breakpoint: { max: 1240, min: 1051 },
//     items: 4.6,
//     slidesToSlide: 3,
//   },
//   largeTablet: {
//     breakpoint: { max: 1050, min: 901 },
//     items: 4,
//     slidesToSlide: 3,
//   },
//   tablet: {
//     breakpoint: { max: 900, min: 781 },
//     items: 3.5,
//     slidesToSlide: 2,
//   },
//   largeMobile: {
//     breakpoint: { max: 780, min: 701 },
//     items: 3,
//     slidesToSlide: 2,
//   },
//   mediumMobile: {
//     breakpoint: { max: 700, min: 610 },
//     items: 2.5,
//     slidesToSlide: 1,
//   },
//   smallMobile: {
//     breakpoint: { max: 609, min: 521 },
//     items: 2.2,
//     slidesToSlide: 1,
//   },
//   extraSmallMobile: {
//     breakpoint: { max: 520, min: 431 },
//     items: 2,
//     slidesToSlide: 1,
//   },
//   tinyMobile: {
//     breakpoint: { max: 430, min: 0 },
//     items: 1.5,
//     slidesToSlide: 1,
//   },
// }

const responsive = {
  largeDesktop: {
    breakpoint: { max: 4000, min: 1241 },
    items: 5,
    partialVisibilityGutter: 0,
    slidesToSlide: 4,
  },
  desktop: {
    breakpoint: { max: 1240, min: 1051 },
    items: 4.6,
    slidesToSlide: 3,
  },
  largeTablet: {
    breakpoint: { max: 1050, min: 0 },
    items: 4,
    slidesToSlide: 3,
  },
  // tablet: {
  //   breakpoint: { max: 900, min: 781 },
  //   items: 3.5,
  //   slidesToSlide: 2,
  // },
  // largeMobile: {
  //   breakpoint: { max: 780, min: 701 },
  //   items: 3,
  //   slidesToSlide: 2,
  // },
  // mediumMobile: {
  //   breakpoint: { max: 700, min: 610 },
  //   items: 2.5,
  //   slidesToSlide: 1,
  // },
  // smallMobile: {
  //   breakpoint: { max: 609, min: 521 },
  //   items: 2.2,
  //   slidesToSlide: 1,
  // },
  // extraSmallMobile: {
  //   breakpoint: { max: 520, min: 431 },
  //   items: 2,
  //   slidesToSlide: 1,
  // },
  // tinyMobile: {
  //   breakpoint: { max: 430, min: 0 },
  //   items: 1.5,
  //   slidesToSlide: 1,
  // },
}

const Products = () => {
  const { t } = useTranslation()

  const carouselData = useQueries({
    queries: [
      { queryKey: ['promotions'], queryFn: () => getPromotions({ page: 1, page_size: 20 }) },
      { queryKey: ['bestsellers'], queryFn: () => getBestsellers({ page: 1, page_size: 20 }) },
      { queryKey: ['new-arrivals'], queryFn: () => getNewArrivals({ page: 1, page_size: 20 }) },
      { queryKey: ['popular'], queryFn: () => getPopular({ page: 1, page_size: 20 }) },
    ],
  })

  const titles = [
    { label: t('common:promotions'), order: 'discount' },
    { label: t('common:bestsellers'), order: 'promotion' },
    { label: t('common:new-arrivals'), order: 'new' },
    { label: t('common:popular'), order: 'bestseller' },
  ]

  return (
    <div className="flex flex-col gap-10 mb-10">
      {carouselData?.map((val, pI) => (
        <div key={'carousels-' + pI} className="flex flex-col gap-4">
          {val.data ? (
            <>
              <div className="flex items-center px-2.5 justify-between">
                <Link href={`/search?order_by=${titles?.[pI]?.order}&page=1`}>
                  <h4 className=" font-semibold text-black dark:text-white text-[20px] inline-flex duration-200 hover:gap-3 gap-1 items-center">
                    {titles?.[pI]?.label} <ArrowRightOutlineIcon />
                  </h4>
                </Link>
                <Link
                  href={`/search?order_by=${titles?.[pI]?.order}&page=1`}
                  className="text-primary"
                >
                  {t('common:all-products')}
                </Link>
              </div>
              <Carousel
                responsive={responsive}
                swipeable={false}
                draggable={false}
                ssr={true}
                itemClass="px-2"
                autoPlaySpeed={1000}
                keyBoardControl={true}
                transitionDuration={500}
                removeArrowOnDeviceType={['mobile']}
              >
                {val?.data?.results?.map((product, cI) => (
                  <ProductCard small key={pI + '-items-' + cI} {...product} />
                ))}
              </Carousel>
            </>
          ) : (
            <div className="flex flex-col gap-[18px]">
              <Skeleton.Input active size="small" style={{ width: 170 }} />
              <div className="min-h-[325px] w-full grid grid-cols-5 gap-4">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Products
