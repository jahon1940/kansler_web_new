import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'
import { Button } from 'antd'
import { useRouter } from 'next/router'

import { Typography } from 'antd'

const { Title } = Typography

const AboutView = () => {
  const { push } = useRouter()

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
            Наша компания
          </Title>
        </div>
        <div className="bg-white rounded-xl p-4">
          Добро пожаловать в KANSLER — надёжного партнёра для вашего бизнеса Мы специализируемся на
          комплексных поставках канцелярских и офисных товаров для организаций любого масштаба: 🏢
          компаний 🏫 образовательных учреждений 🏦 банков 🏭 промышленных предприятий Более 10 лет
          мы помогаем бизнесу работать эффективно, обеспечивая всё необходимое — от бумаги и папок
          до офисной техники и хозяйственных товаров. Почему выбирают KANSLER: ✔️ Широкий
          ассортимент товаров в наличии ✔️ Оперативная доставка по Ташкенту и регионам ✔️
          Индивидуальные условия и цены для постоянных клиентов ✔️ Работа по счёту и с НДС ✔️
          Поддержка на каждом этапе сотрудничества Мы ценим ваше время и доверие. Оформляйте заказ
          онлайн, и наш менеджер свяжется с вами для уточнения всех деталей. KANSLER — ваш
          профессиональный поставщик товаров для офиса.
        </div>
      </div>
    </div>
  )
}

export default AboutView
