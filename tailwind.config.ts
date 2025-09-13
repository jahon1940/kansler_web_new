const { colors } = require('./src/config')

import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  important: true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors,
      container: { center: true },
    },
  },
  plugins: [],
} satisfies Config
