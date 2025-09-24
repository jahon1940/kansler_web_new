import { ROUTES } from '@/constants'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="bg-card-dark">
      <div className="custom-container">
        <div className="grid grid-cols-5 gap-10 py-[75px] text-white">
          <div className="flex flex-col gap-3">
            <div className="text-[18px] font-medium">Kansler</div>
            <ul className="text-[16px] flex flex-col gap-2">
              <li>
                <Link href={ROUTES.ABOUT} className="text-white hover:underline">
                  О нас
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PAYMENT_AND_DELIVERY} className="text-white hover:underline">
                  Условия оплаты и доставки
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CONTACTS} className="text-white hover:underline">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[18px] font-medium">Покупателям</div>
            <ul className="text-[16px] flex flex-col gap-2">
              <li>
                <Link href={ROUTES.HOW_TO_ORDER} className="text-white hover:underline">
                  Как сделать заказ
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[18px] font-medium">Каталог</div>
            <ul className="text-[16px] flex flex-col gap-2">
              <li>
                <Link href={ROUTES.POSTERS} className="text-white hover:underline">
                  По рубрикам
                </Link>
              </li>
              <li>По брендам</li>
              <li>
                <Link
                  href={ROUTES.SEARCH + '?order_by=promotion&page=1'}
                  className="text-white hover:underline"
                >
                  Хиты дня
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[18px] font-medium">Контакты</div>
            <ul className="text-[16px] flex flex-col gap-2">
              <li>+998 (78) 148-44-44</li>
              <li>г. Ташкент, Мирабадский район, ул. Авлиё Ота, д. 7</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[18px] font-medium">Мы в соцсетях</div>
            <ul className="text-[16px] flex flex-col gap-2">
              <li>instagram</li>
              <li>telegram</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
