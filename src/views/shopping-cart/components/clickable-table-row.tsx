// import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
// import { useEffect, useState } from 'react'
import { useState } from 'react'

import ProductDetailedModal from '@/components/shared/product-detailed-modal'

const ClickableTableRow = (props: any) => {
  // const { query } = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const firstChild = props?.children?.[0]
  const id = props?.children?.[0]?.props?.record?.product
    ? props?.children?.[0]?.props?.record?.product?.id
    : props?.children?.[0]?.props?.record?.id

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // replace(
    //   {
    //     pathname,
    //     query: queryString.stringify({ ...query, product: undefined }),
    //   },
    //   undefined,
    //   { scroll: false }
    // )
  }

  const handleClick = () => {
    if (id) {
      setIsModalOpen(true)
      // replace({ pathname, query: queryString.stringify({ ...query, product: id }) }, undefined, {
      //   scroll: false,
      // })
    }
  }

  // useEffect(() => {
  //   if (query.product === String(id)) {
  //     setIsModalOpen(true)
  //   }
  // }, [query.product, id])

  return (
    <>
      <tr
        {...props}
        onClick={handleClick}
        className={twMerge(
          ' dark:bg-dprimary [&_td]:p-1 cursor-pointer',
          firstChild?.props?.record?.quantity > firstChild?.props?.record?.product?.max_quantity
            ? 'dark:[&_td]:border-red-500 [&_td]:border-red-500'
            : 'hover:bg-black/20 dark:hover:bg-dprimary/95 dark:[&_td]:border-dborder'
          // props?.children?.[0]?.props?.record?.barcode?.length
          //   ? 'dark:hover:bg-dprimary cursor-default'
          //   : ''
        )}
      />
      {id && (
        <ProductDetailedModal
          {...(firstChild?.props?.record?.product || firstChild?.props?.record)}
          quantity={firstChild?.props?.record?.quantity}
          open={isModalOpen}
          onCancel={handleCloseModal}
        />
      )}
    </>
  )
}

export default ClickableTableRow
