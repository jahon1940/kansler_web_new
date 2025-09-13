import { Select } from 'antd'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'
import { useTranslation } from 'next-i18next'

import RussiaFlagCircleIcon from '../icons/russia'
import UzbekistanFlagCircleIcon from '../icons/uzbekistan'

const locales = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
]

const LocaleSwitcher = () => {
  const router = useRouter()
  const { i18n } = useTranslation()

  const handleChange = (value: string) => {
    router.push(router.pathname, router.asPath, { locale: value })
    setCookie('NEXT_LOCALE', value)
  }

  return (
    <Select
      size="small"
      defaultValue={i18n.language}
      popupClassName="w-[160px] dark:bg-dsecondary [&_*]:dark:text-white"
      value={i18n.language}
      className="w-fit"
      variant="borderless"
      onChange={handleChange}
      options={locales}
      suffixIcon={null}
      dropdownAlign={{
        points: ['tr', 'br'],
      }}
      optionRender={(val) => (
        <span className="flex items-center gap-2">
          {val?.value === 'uz' ? (
            <UzbekistanFlagCircleIcon className="text-[18px]" />
          ) : (
            <RussiaFlagCircleIcon className="text-[18px]" />
          )}{' '}
          {val.label}
        </span>
      )}
      labelRender={(val) => (
        <span className="flex justify-end dark:text-white items-center gap-2">
          {val?.value === 'uz' ? (
            <UzbekistanFlagCircleIcon className="text-[18px]" />
          ) : (
            <RussiaFlagCircleIcon className="text-[18px]" />
          )}{' '}
          {val.label}
        </span>
      )}
    />
  )
}

export default LocaleSwitcher
