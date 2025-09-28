import Link from 'next/link'
import { Skeleton } from 'antd'
import { useTranslation } from 'next-i18next'
import { useQueries } from '@tanstack/react-query'

import { getBestsellers, getNewArrivals, getPopular, getPromotions } from '../services'

import ProductCard from '@/components/shared/product-card'
import ArrowRightOutlineIcon from '@/components/icons/arrow-right-outline'
import ProductCardSkeleton from '@/components/shared/product-card-skeleton'

const colors = [
  '#DBF0FF',
  '#C7F0E9',
  '#EBE6FF',
  '#F2DCED',
  '#EEFFE7',
  '#FBFFC7',
  '#F2EFF5',
  '#ECF5F9',
]
const Products = () => {
  const { t } = useTranslation()

  const carouselData = useQueries({
    queries: [
      { queryKey: ['promotions'], queryFn: () => getPromotions({ page: 1, page_size: 10 }) },
      { queryKey: ['bestsellers'], queryFn: () => getBestsellers({ page: 1, page_size: 10 }) },
      { queryKey: ['new-arrivals'], queryFn: () => getNewArrivals({ page: 1, page_size: 10 }) },
      { queryKey: ['popular'], queryFn: () => getPopular({ page: 1, page_size: 10 }) },
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
        <div
          key={'carousels-' + pI}
          className="flex flex-col gap-4 p-8 rounded-3xl"
          style={{ backgroundColor: colors[pI] }}
        >
          {val.data ? (
            <>
              <div className="flex items-center justify-between">
                <Link href={`/search?order_by=${titles?.[pI]?.order}&page=1`}>
                  <h4 className="font-semibold text-black dark:text-white text-[26px]">
                    {titles?.[pI]?.label}
                  </h4>
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {val?.data?.results?.map((product, cI) => (
                  <ProductCard small key={pI + '-items-' + cI} {...product} />
                ))}
              </div>
              <Link
                href={`/search?order_by=${titles?.[pI]?.order}&page=1`}
                className="text-primary bg-white px-6 text-[18px] font-medium py-4 rounded-xl flex items-center gap-1 duration-150 transition-all justify-center shadow-lg hover:gap-3"
              >
                {t('common:all-products')} <ArrowRightOutlineIcon />
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-[18px]">
              <Skeleton.Input active size="small" style={{ width: 170 }} />
              <div className="w-full grid grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ProductCardSkeleton key={'carousels-skeletons-' + pI + i} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Products
