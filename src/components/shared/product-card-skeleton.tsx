import { Skeleton, Space, Divider } from 'antd'

import type { FC } from 'react'

const ProductCardSkeleton: FC = () => {
  return (
    <div className="p-2 bg-white dark:bg-dsecondary border dark:border-dborder h-full rounded-lg flex flex-col">
      <div
        className={'bg-white dark:bg-dsecondary relative overflow-hidden rounded-t-md h-[200px]'}
      >
        <Skeleton.Input size="large" active className="w-full h-full" />
      </div>

      <Divider style={{ margin: '8px 0' }} />

      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Skeleton.Input active size="small" style={{ width: 150 }} />
        <Skeleton.Input active size="small" style={{ width: '100%' }} />
        <Skeleton.Input active size="small" style={{ width: 100 }} />
      </Space>
    </div>
  )
}

export default ProductCardSkeleton
