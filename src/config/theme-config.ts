import type { ThemeConfig } from 'antd'
import { colors } from '.'

const themeLight: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: colors.primary,
    // controlHeightLG: 48,
    controlHeightLG: 38,
    borderRadiusLG: 8,
    fontFamily: 'var(--inter-font)',
  },

  components: {
    Form: {
      itemMarginBottom: 0,
      labelFontSize: 14,
    },

    Select: {
      // controlItemBgActive: colors.primary,
      controlItemBgHover: colors['primary-light'],
      optionSelectedColor: 'white',
      optionSelectedBg: colors.primary,
    },

    Button: {
      // colorFillTertiary: colors['background-light'],
      fontSizeLG: 14,
      fontWeight: 500,
      defaultShadow: 'none',
      primaryShadow: 'none',
      paddingInlineLG: 26,
    },
    // Input: { controlHeightLG: 50 },

    Input: {
      controlHeightLG: 40,
    },
    Modal: {
      borderRadiusLG: 20,
      motionDurationMid: '0.1s',
      motionDurationSlow: '0.1s',
    },
    Menu: {
      itemMarginInline: 0,
      itemMarginBlock: 10,
      fontSize: 12,
    },
    Table: {
      borderRadiusLG: 0,
      // footerBg: '#F4F7FD',
      // headerBg: '#F4F7FD',
      // borderColor: '#e1e1eb',
    },
  },
}

const themeDark: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: colors.primary,
    // controlHeightLG: 48,
    controlHeightLG: 38,
    borderRadiusLG: 8,
    fontFamily: 'var(--inter-font)',
  },

  components: {
    Form: {
      itemMarginBottom: 0,
      labelFontSize: 14,
      labelColor: colors['secondary-light'],
    },

    Select: {
      controlItemBgActive: colors.primary,
      controlItemBgHover: colors.primary,
      colorTextPlaceholder: '#9ca3af',
      colorBgContainer: colors['dsecondary'], // Dark mode background color
      colorBorder: colors['dborder'], // Dark mode border color
      colorText: '#ffffff', // White text color
      colorBgElevated: colors['dborder'], // Dropdown background color
    },
    InputNumber: {
      colorBgContainer: colors['dprimary'], // Dark mode background color
      colorText: '#ffffff', // White text color
      colorBorder: colors['dborder'], // Dark mode border color
      colorTextPlaceholder: '#9ca3af', // Adjust placeholder color
    },

    Button: {
      // colorFillTertiary: colors['background-light'],
      fontSizeLG: 14,
      fontWeight: 500,
      defaultShadow: 'none',
      primaryShadow: 'none',
      paddingInlineLG: 26,
    },
    // Input: { controlHeightLG: 50 },

    Input: {
      controlHeightLG: 40,
      colorBgContainer: colors['dprimary'], // Dark mode background color
      colorText: '#ffffff', // White text color

      colorBorder: colors['dborder'], // Dark mode border color
      colorTextPlaceholder: '#9ca3af', // Adjust placeholder color
    },
    Modal: {
      borderRadiusLG: 20,
      motionDurationMid: '0.1s',
      motionDurationSlow: '0.1s',
    },
    Menu: {
      itemMarginInline: 0,
      itemMarginBlock: 10,
      fontSize: 12,
    },
    Table: {
      borderRadiusLG: 0,
      // footerBg: '#F4F7FD',
      // headerBg: '#F4F7FD',
      // borderColor: '#e1e1eb',
    },
    Rate: {
      starBg: colors.dprimary,
    },
    DatePicker: {
      colorBgContainer: colors.dprimary,
      colorText: '#ffffff',
      colorBorder: colors.dborder,
      colorTextPlaceholder: '#9ca3af',
      colorBgElevated: colors.dsecondary,
      colorTextDisabled: '#6b7280',
      cellHoverBg: colors.dborder,
      cellActiveWithRangeBg: colors.primary,
      colorIcon: '#ffffff',
    },
  },
}

export { themeLight, themeDark }
