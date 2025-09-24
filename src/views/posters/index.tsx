import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'
import { Button } from 'antd'
import { useRouter } from 'next/router'

import { Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getPosters } from '../main/services'
import CImage from '@/components/ui/cimage'
import { API_HOST } from '@/config'
import Link from 'next/link'
import { ROUTES } from '@/constants'

const { Title } = Typography

const PostersView = () => {
  const { push } = useRouter()

  const { data: posters } = useQuery({
    queryKey: ['posters'],
    queryFn: () => getPosters(),
  })

  return (
    <div className="min-h-screen py-6">
      <div className="custom-container">
        <div className="flex items-center gap-4 mb-6">
          <Button
            icon={<ArrowLeftOutlineIcon />}
            className="dark:bg-dprimary hover:dark:bg-dprimary/70 dark:text-white dark:border-dborder text-[20px]"
            onClick={() => push('/')}
          />
          <Title level={3} className="m-0">
            Постеры
          </Title>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {posters?.results.map((item, i) => (
            <Link key={`posters-${i}`} href={ROUTES.POSTERS + '/' + item.id} className="flex">
              <div className="bg-white rounded-xl p-4 flex justify-between gap-4 w-full">
                <div className="text-secondary-dark line-clamp-3 break-all">
                  {item.notification.title}
                </div>
                <CImage
                  width={200}
                  height={200}
                  alt={item.notification.title}
                  src={API_HOST + item.img_web}
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostersView
