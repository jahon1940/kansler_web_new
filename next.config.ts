import type { NextConfig } from 'next'

const { i18n } = require('./next-i18next.config')

const nextConfig: NextConfig = {
  reactStrictMode: true,

  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  transpilePackages: [
    'antd',
    '@ant-design',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-table',
    'rc-input',
  ],
}

export default nextConfig
