import Image from 'next/image'
import Link from 'next/link'

import Logo from '@/assets/mirel.png'
import AppstoreImage from '../../../public/app-store.svg'
import GooglePlayImage from '../../../public/google-play.svg'

export default function MobileDownload() {
  return (
    <div className="h-screen flex flex-col relative items-center justify-center p-4">
      <div className="size-[50px] mb-3">
        <Image width={50} height={50} alt="logo" src={Logo} className="rounded-xl" />
      </div>

      <div className="text-center space-y-2 leading-[14px] mb-3">
        <p className="text-primary font-bold text-[14px]">Сайт предназначен</p>
        <p className="text-primary font-bold text-[14px]">только для полноформатного Веб-сайта</p>
      </div>

      <div className="text-center text-black dark:text-white text-[14px] leading-[20px] mb-7">
        <p>Для мобильной версии скачайте</p>
        <p>Мобильное приложение Mirel</p>
      </div>

      <div className="flex flex-col space-y-3 w-full max-w-[155px]">
        <Link
          href="https://play.google.com/store/apps/details?id=uz.test.mirel"
          className="transition-opacity hover:opacity-80"
        >
          <Image
            src={GooglePlayImage}
            alt="Get it on Google Play"
            width={200}
            height={59}
            className="w-full"
          />
        </Link>
        <Link
          href="https://apps.apple.com/ru/app/mirel/id6504733464?l=en-GB"
          className="transition-opacity hover:opacity-80"
        >
          <Image
            src={AppstoreImage}
            alt="Download on the App Store"
            width={200}
            height={59}
            className="w-full"
          />
        </Link>
      </div>
    </div>
  )
}
