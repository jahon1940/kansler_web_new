import React from 'react'

const Footer = () => {
  return (
    <div className="bg-card-dark">
      <div className="custom-container">
        <div className="grid grid-cols-5 gap-10 py-[75px] text-white">
          <div className="flex flex-col gap-3">
            <div className="text-[18px] font-medium">Kansler</div>
            <ul className="text-[16px] flex flex-col gap-2">
              <li>О нас</li>
              <li>Условия оплаты и доставки</li>
              <li>Контакты</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[18px] font-medium">Покупателям</div>
            <ul className="text-[16px] flex flex-col gap-2">
              <li>Как сделать заказ</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[18px] font-medium">Каталог</div>
            <ul className="text-[16px] flex flex-col gap-2">
              <li>По рубрикам</li>
              <li>По брендам</li>
              <li>Хиты дня</li>
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
