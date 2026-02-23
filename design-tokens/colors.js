/**
 * Design Tokens - Colors
 * Material Design 3 기반 색상 팔레트
 * 한국형 UI 감성을 반영한 세련된 색상 시스템
 */

// Primary - 메인 브랜드 색상 (진한 네이비 블루 톤)
export const primary = {
  50: '#E3F2FD',
  100: '#BBDEFB',
  200: '#90CAF9',
  300: '#64B5F6',
  400: '#42A5F5',
  500: '#2196F3', // 메인 Primary
  600: '#1E88E5',
  700: '#1976D2',
  800: '#1565C0',
  900: '#0D47A1'
};

// Secondary - 보조 색상 (웜 톤의 테라코타/코랄)
export const secondary = {
  50: '#FBE9E7',
  100: '#FFCCBC',
  200: '#FFAB91',
  300: '#FF8A65',
  400: '#FF7043',
  500: '#FF5722', // 메인 Secondary
  600: '#F4511E',
  700: '#E64A19',
  800: '#D84315',
  900: '#BF360C',
};

// Tertiary - 액센트 색상 (민트/틸 계열)
export const tertiary = {
  50: '#E0F2F1',
  100: '#B2DFDB',
  200: '#80CBC4',
  300: '#4DB6AC',
  400: '#26A69A',
  500: '#009688', // 메인 Tertiary
  600: '#00897B',
  700: '#00796B',
  800: '#00695C',
  900: '#004D40',
};

// Neutral - 그레이 스케일
export const neutral = {
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#EEEEEE',
  300: '#E0E0E0',
  400: '#BDBDBD',
  500: '#9E9E9E',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

// Surface - 표면 색상
export const surface = {
  light: {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    surfaceVariant: '#F5F5F5',
    onBackground: '#1C1B1F',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
  },
  dark: {
    background: '#1C1B1F',
    surface: '#2B2930',
    surfaceVariant: '#49454F',
    onBackground: '#E6E1E5',
    onSurface: '#E6E1E5',
    onSurfaceVariant: '#CAC4D0',
  },
};

// Semantic - 의미론적 색상
export const semantic = {
  error: {
    main: '#B3261E',
    container: '#F9DEDC',
    onContainer: '#410E0B',
  },
  success: {
    main: '#2E7D32',
    container: '#C8E6C9',
    onContainer: '#1B5E20',
  },
  warning: {
    main: '#ED6C02',
    container: '#FFE0B2',
    onContainer: '#E65100',
  },
  info: {
    main: '#0288D1',
    container: '#B3E5FC',
    onContainer: '#01579B',
  },
};

// 앱 특화 색상 - 의류 카테고리
export const categoryColors = {
  top: '#5C6BC0',      // 상의 - 인디고
  bottom: '#26A69A',   // 하의 - 틸
  outer: '#7E57C2',    // 아우터 - 퍼플
  shoes: '#8D6E63',    // 신발 - 브라운
  accessory: '#EC407A', // 액세서리 - 핑크
  bag: '#FFA726',      // 가방 - 오렌지
};

export default {
  primary,
  secondary,
  tertiary,
  neutral,
  surface,
  semantic,
  categoryColors,
};
