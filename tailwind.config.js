/**
 * Tailwind CSS / NativeWind Configuration
 * 디자인 토큰을 NativeWind에 연동
 */

const { primary, secondary, tertiary, neutral, surface, semantic, categoryColors } = require('./design-tokens/colors');
const { fontSize, lineHeight } = require('./design-tokens/typography');
const { spacing, borderRadius } = require('./design-tokens/spacing');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 설정
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 색상 확장 - 디자인 토큰 연동
      colors: {
        // Primary 색상
        primary: {
          50: primary[50],
          100: primary[100],
          200: primary[200],
          300: primary[300],
          400: primary[400],
          500: primary[500],
          600: primary[600],
          700: primary[700],
          800: primary[800],
          900: primary[900],
          DEFAULT: primary[500],
        },
        // Secondary 색상
        secondary: {
          50: secondary[50],
          100: secondary[100],
          200: secondary[200],
          300: secondary[300],
          400: secondary[400],
          500: secondary[500],
          600: secondary[600],
          700: secondary[700],
          800: secondary[800],
          900: secondary[900],
          DEFAULT: secondary[500],
        },
        // Tertiary 색상
        tertiary: {
          50: tertiary[50],
          100: tertiary[100],
          200: tertiary[200],
          300: tertiary[300],
          400: tertiary[400],
          500: tertiary[500],
          600: tertiary[600],
          700: tertiary[700],
          800: tertiary[800],
          900: tertiary[900],
          DEFAULT: tertiary[500],
        },
        // Neutral (Gray) 색상
        neutral: {
          50: neutral[50],
          100: neutral[100],
          200: neutral[200],
          300: neutral[300],
          400: neutral[400],
          500: neutral[500],
          600: neutral[600],
          700: neutral[700],
          800: neutral[800],
          900: neutral[900],
        },
        // Surface 색상 (Light 모드 기본)
        surface: {
          background: surface.light.background,
          DEFAULT: surface.light.surface,
          variant: surface.light.surfaceVariant,
        },
        // Semantic 색상
        error: semantic.error.main,
        'error-container': semantic.error.container,
        success: semantic.success.main,
        'success-container': semantic.success.container,
        warning: semantic.warning.main,
        'warning-container': semantic.warning.container,
        info: semantic.info.main,
        'info-container': semantic.info.container,
        // 의류 카테고리 색상
        'category-top': categoryColors.top,
        'category-bottom': categoryColors.bottom,
        'category-outer': categoryColors.outer,
        'category-shoes': categoryColors.shoes,
        'category-accessory': categoryColors.accessory,
        'category-bag': categoryColors.bag,
      },
      // 간격 확장 - 8px 베이스 시스템
      spacing: {
        '0.5': `${spacing[0.5]}px`,
        '1': `${spacing[1]}px`,
        '1.5': `${spacing[1.5]}px`,
        '2': `${spacing[2]}px`,
        '2.5': `${spacing[2.5]}px`,
        '3': `${spacing[3]}px`,
        '3.5': `${spacing[3.5]}px`,
        '4': `${spacing[4]}px`,
        '5': `${spacing[5]}px`,
        '6': `${spacing[6]}px`,
        '7': `${spacing[7]}px`,
        '8': `${spacing[8]}px`,
        '9': `${spacing[9]}px`,
        '10': `${spacing[10]}px`,
        '11': `${spacing[11]}px`,
        '12': `${spacing[12]}px`,
        '14': `${spacing[14]}px`,
        '16': `${spacing[16]}px`,
        '20': `${spacing[20]}px`,
        '24': `${spacing[24]}px`,
        '28': `${spacing[28]}px`,
        '32': `${spacing[32]}px`,
      },
      // 테두리 반경 확장
      borderRadius: {
        'none': `${borderRadius.none}px`,
        'xs': `${borderRadius.xs}px`,
        'sm': `${borderRadius.sm}px`,
        'md': `${borderRadius.md}px`,
        'lg': `${borderRadius.lg}px`,
        'xl': `${borderRadius.xl}px`,
        '2xl': `${borderRadius['2xl']}px`,
        '3xl': `${borderRadius['3xl']}px`,
        'full': `${borderRadius.full}px`,
      },
      // 폰트 크기 확장 - M3 Type Scale
      fontSize: {
        'display-lg': [`${fontSize.displayLarge}px`, { lineHeight: `${lineHeight.displayLarge}px` }],
        'display-md': [`${fontSize.displayMedium}px`, { lineHeight: `${lineHeight.displayMedium}px` }],
        'display-sm': [`${fontSize.displaySmall}px`, { lineHeight: `${lineHeight.displaySmall}px` }],
        'headline-lg': [`${fontSize.headlineLarge}px`, { lineHeight: `${lineHeight.headlineLarge}px` }],
        'headline-md': [`${fontSize.headlineMedium}px`, { lineHeight: `${lineHeight.headlineMedium}px` }],
        'headline-sm': [`${fontSize.headlineSmall}px`, { lineHeight: `${lineHeight.headlineSmall}px` }],
        'title-lg': [`${fontSize.titleLarge}px`, { lineHeight: `${lineHeight.titleLarge}px` }],
        'title-md': [`${fontSize.titleMedium}px`, { lineHeight: `${lineHeight.titleMedium}px` }],
        'title-sm': [`${fontSize.titleSmall}px`, { lineHeight: `${lineHeight.titleSmall}px` }],
        'body-lg': [`${fontSize.bodyLarge}px`, { lineHeight: `${lineHeight.bodyLarge}px` }],
        'body-md': [`${fontSize.bodyMedium}px`, { lineHeight: `${lineHeight.bodyMedium}px` }],
        'body-sm': [`${fontSize.bodySmall}px`, { lineHeight: `${lineHeight.bodySmall}px` }],
        'label-lg': [`${fontSize.labelLarge}px`, { lineHeight: `${lineHeight.labelLarge}px` }],
        'label-md': [`${fontSize.labelMedium}px`, { lineHeight: `${lineHeight.labelMedium}px` }],
        'label-sm': [`${fontSize.labelSmall}px`, { lineHeight: `${lineHeight.labelSmall}px` }],
      },
    },
  },
  plugins: [],
};
