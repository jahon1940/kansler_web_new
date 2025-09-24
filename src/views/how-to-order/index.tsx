import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'
import { Button } from 'antd'
import { useRouter } from 'next/router'

import { Typography } from 'antd'

import OrderImage from './assets/order.png'
import AgreementImage from './assets/agreement.png'
import DeliverImage from './assets/deliver.png'
import CImage from '@/components/ui/cimage'

const { Title } = Typography

const items = [
  {
    image: OrderImage,
    label: 'Вы формируете заказ (онлайн, по телефону или ТГ)',
  },
  {
    image: AgreementImage,
    label: 'Мы заключим электронный договор',
  },
  {
    image: DeliverImage,
    label: 'Мы доставим товар до ваших дверей',
  },
]

const HowToOrderView = () => {
  const { push } = useRouter()

  return (
    <div className="min-h-screen">
      <div className="custom-container">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              icon={<ArrowLeftOutlineIcon />}
              className="dark:bg-dprimary hover:dark:bg-dprimary/70 dark:text-white dark:border-dborder text-[20px]"
              onClick={() => push('/')}
            />
            <Title level={3} className="m-0">
              Как легко это работает?
            </Title>
          </div>
          <ul className="bg-white rounded-xl px-12 py-24 flex items-start justify-around">
            {items.map((item, i) => (
              <li key={i} className="flex items-center flex-col gap-4 justify-center">
                <div className="size-[100px]">
                  <CImage
                    width={200}
                    height={200}
                    alt="123"
                    src={item.image}
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>
                <span className="font-medium text-[18px] max-w-[200px] text-center">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HowToOrderView
