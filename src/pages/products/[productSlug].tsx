import Head from 'next/head'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { API_HOST, defaultLocale } from '@/config'
import { getProduct } from '@/views/search/services'

import dynamic from 'next/dynamic'

const ProductsItemView = dynamic(() => import('@/views/products-item'), { ssr: false })

// import HeartOutlineIcon from '@/components/icons/heart-outline'
import NoPhoto from '@/assets/nophoto.png'

import type { GetServerSideProps } from 'next'
import { IProduct } from '@/views/shopping-cart/types'

export const getServerSideProps: GetServerSideProps = async ({ locale, params, req }) => {
  const cookies = req.headers.cookie || ''
  const tokenMatch = cookies.match(/auth_token=([^;]*)/)

  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null

  const queryClient = new QueryClient()

  try {
    const seo = await queryClient.fetchQuery({
      queryKey: ['products-item', params?.productSlug],
      queryFn: () => getProduct(params?.productSlug as string, token as string),
    })

    return {
      props: {
        ...(await serverSideTranslations(locale ?? defaultLocale, ['common', 'fields', 'actions'])),
        dehydratedState: dehydrate(queryClient),
        seo: seo || null,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

const Page = ({ seo }: { seo: IProduct }) => {
  const url = `${API_HOST}/${seo?.title_slug}`

  return (
    <>
      {seo ? (
        <Head>
          {seo?.title && <title>{seo.title}</title>}
          {seo?.description && <meta name="description" content={seo.description} />}
          {seo?.title && <meta property="og:title" content={seo.title} />}
          <meta property="og:type" content="product" />
          {url && <meta property="og:url" content={url} />}
          {seo?.description && <meta property="og:description" content={seo.description} />}
          <meta
            property="og:image"
            content={seo?.image_url ? API_HOST + seo.image_url : NoPhoto.src}
          />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="315" />
          <meta property="og:site_name" content="Kansler.uz" />
        </Head>
      ) : null}

      <ProductsItemView />
    </>
  )
}

export default Page
