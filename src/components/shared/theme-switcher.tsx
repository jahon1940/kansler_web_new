import { Select } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'

import { useThemeStore } from '@/store/theme-store'

const ThemeSwitcher = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useThemeStore()
  const { reload } = useRouter()

  const handler = (val: 'light' | 'dark') => {
    setTheme(val)
    reload()
  }

  return (
    <Select
      size="small"
      value={theme}
      suffixIcon={null}
      popupClassName="w-[160px] dark:bg-dsecondary"
      className="w-fit"
      variant="borderless"
      onChange={handler}
      optionLabelProp="label"
      options={[
        {
          value: 'light',
          label: (
            <span className="flex items-center dark:text-white gap-2">
              <SunOutlined className="text-[18px]" />
              {t('common:theme.light')}
            </span>
          ),
        },
        {
          value: 'dark',
          label: (
            <span className="flex items-center dark:text-white gap-2">
              <MoonOutlined className="text-[18px]" />
              {t('common:theme.dark')}
            </span>
          ),
        },
      ]}
    />
  )
}

export default ThemeSwitcher
