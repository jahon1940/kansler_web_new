import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input, Typography } from 'antd'

import { login } from './services'
import useAuthStore from '@/store/auth-store'

import EyeBoldIcon from '@/components/icons/eye-bold'
import LockBoldIcon from '@/components/icons/lock-bold'
import UserBoldIcon from '@/components/icons/user-bold'
import EyeSlashBoldIcon from '@/components/icons/eye-slash-bold'

import type { ILoginResponse } from './types'

const { Title } = Typography

export default function LoginView() {
  const { push } = useRouter()
  const { t } = useTranslation()
  const setAuthToken = useAuthStore((state) => state.setAuthToken)

  const { mutate, isPending } = useMutation({
    mutationFn: (values: { password: string; username: string }) =>
      login({
        password: values?.password,
        username: values?.username,
        fcm_token: 'null',
        device: {
          info: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
          name: 'chrome',
          type: 3,
          imei: 'Mozilla',
          app_version:
            '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        },
      }),
    onSuccess: (res: ILoginResponse) => {
      setAuthToken(res.auth_token)
      push('/profile')
    },
  })

  return (
    <main
      className="
        flex w-full flex-1 items-center justify-end p-4
        custom-container
        md:justify-end
        sm:justify-center sm:p-6
        min-h-[90vh]
      "
    >
      <div
        className="
          w-full max-w-md
          sm:max-w-sm
          md:max-w-md
          flex flex-col
          bg-transparent
        "
      >
        <div className="mb-8 text-center">
          <Title
            level={4}
            className="text-gray-500 dark:text-white font-normal text-[18px] sm:text-[20px]"
          >
            {t('common:login_page.title')}
          </Title>
        </div>

        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={mutate}
          layout="vertical"
          className="flex flex-col gap-4 mb-6"
        >
          {/* Username */}
          <Form.Item
            name="username"
            rules={[
              { required: true, message: t('fields:username.required') },
              { min: 4, message: t('fields:username.min') },
            ]}
            validateDebounce={1000}
          >
            <Input
              prefix={<UserBoldIcon className="text-gray-400 dark:text-white" />}
              placeholder={t('fields:username.placeholder')}
              className="h-[48px] text-[15px]"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: t('fields:password.required') },
              { min: 8, message: t('fields:password.min') },
            ]}
            validateDebounce={1000}
          >
            <Input.Password
              prefix={<LockBoldIcon className="text-gray-400 dark:text-white" />}
              placeholder={t('fields:password.placeholder')}
              iconRender={(visible) =>
                visible ? (
                  <EyeBoldIcon className="text-gray-400 dark:text-white" />
                ) : (
                  <EyeSlashBoldIcon className="text-gray-400 dark:text-white" />
                )
              }
              className="h-[48px] text-[15px]"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-[48px] text-[16px]"
              loading={isPending}
            >
              {t('actions:login')}
            </Button>
          </Form.Item>
        </Form>

        {/* Footer (contacts) */}
        <ul
          className="
            flex flex-col justify-center items-center
            text-black dark:text-white
            text-[14px] sm:text-[15px]
            leading-relaxed
          "
        >
          <li>{t('common:join_community.title')}</li>
          <li className="mb-5">{t('common:join_community.subtitle')}:</li>
          <li>OOO "SIGNUM"</li>
          <li className="mb-2">+998 78 129 00 44</li>
          <li>OOO "DELI TORG"</li>
          <li className="mb-2">+998 78 129 00 88</li>
          <li>OOO "GRAND TRADING"</li>
          <li>+998 78 148 00 44</li>
        </ul>
      </div>
    </main>
  )
}
