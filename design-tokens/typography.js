/**
 * Design Tokens - Typography
 * Material Design 3 Type Scale
 * 한국어 최적화를 고려한 타이포그래피 시스템
 */

// 폰트 패밀리 (시스템 폰트 활용)
export const fontFamily = {
  // iOS: San Francisco, Android: Roboto 자동 적용
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
};

// M3 Type Scale - 폰트 크기 (단위: px)
export const fontSize = {
  // Display - 대형 헤드라인
  displayLarge: 57,
  displayMedium: 45,
  displaySmall: 36,
  
  // Headline - 섹션 헤드라인
  headlineLarge: 32,
  headlineMedium: 28,
  headlineSmall: 24,
  
  // Title - 서브 헤드라인
  titleLarge: 22,
  titleMedium: 16,
  titleSmall: 14,
  
  // Body - 본문 텍스트
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  
  // Label - 버튼, 레이블 등
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
};

// Line Height (단위: px)
export const lineHeight = {
  displayLarge: 64,
  displayMedium: 52,
  displaySmall: 44,
  
  headlineLarge: 40,
  headlineMedium: 36,
  headlineSmall: 32,
  
  titleLarge: 28,
  titleMedium: 24,
  titleSmall: 20,
  
  bodyLarge: 24,
  bodyMedium: 20,
  bodySmall: 16,
  
  labelLarge: 20,
  labelMedium: 16,
  labelSmall: 16,
};

// Letter Spacing (단위: px, 한국어는 일반적으로 0 또는 약간 음수)
export const letterSpacing = {
  displayLarge: -0.25,
  displayMedium: 0,
  displaySmall: 0,
  
  headlineLarge: 0,
  headlineMedium: 0,
  headlineSmall: 0,
  
  titleLarge: 0,
  titleMedium: 0.15,
  titleSmall: 0.1,
  
  bodyLarge: 0.5,
  bodyMedium: 0.25,
  bodySmall: 0.4,
  
  labelLarge: 0.1,
  labelMedium: 0.5,
  labelSmall: 0.5,
};

// Font Weights
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// 미리 정의된 텍스트 스타일 (React Native StyleSheet 호환)
export const textStyles = {
  displayLarge: {
    fontSize: fontSize.displayLarge,
    lineHeight: lineHeight.displayLarge,
    letterSpacing: letterSpacing.displayLarge,
    fontWeight: fontWeight.regular,
  },
  displayMedium: {
    fontSize: fontSize.displayMedium,
    lineHeight: lineHeight.displayMedium,
    letterSpacing: letterSpacing.displayMedium,
    fontWeight: fontWeight.regular,
  },
  displaySmall: {
    fontSize: fontSize.displaySmall,
    lineHeight: lineHeight.displaySmall,
    letterSpacing: letterSpacing.displaySmall,
    fontWeight: fontWeight.regular,
  },
  headlineLarge: {
    fontSize: fontSize.headlineLarge,
    lineHeight: lineHeight.headlineLarge,
    letterSpacing: letterSpacing.headlineLarge,
    fontWeight: fontWeight.regular,
  },
  headlineMedium: {
    fontSize: fontSize.headlineMedium,
    lineHeight: lineHeight.headlineMedium,
    letterSpacing: letterSpacing.headlineMedium,
    fontWeight: fontWeight.regular,
  },
  headlineSmall: {
    fontSize: fontSize.headlineSmall,
    lineHeight: lineHeight.headlineSmall,
    letterSpacing: letterSpacing.headlineSmall,
    fontWeight: fontWeight.regular,
  },
  titleLarge: {
    fontSize: fontSize.titleLarge,
    lineHeight: lineHeight.titleLarge,
    letterSpacing: letterSpacing.titleLarge,
    fontWeight: fontWeight.medium,
  },
  titleMedium: {
    fontSize: fontSize.titleMedium,
    lineHeight: lineHeight.titleMedium,
    letterSpacing: letterSpacing.titleMedium,
    fontWeight: fontWeight.medium,
  },
  titleSmall: {
    fontSize: fontSize.titleSmall,
    lineHeight: lineHeight.titleSmall,
    letterSpacing: letterSpacing.titleSmall,
    fontWeight: fontWeight.medium,
  },
  bodyLarge: {
    fontSize: fontSize.bodyLarge,
    lineHeight: lineHeight.bodyLarge,
    letterSpacing: letterSpacing.bodyLarge,
    fontWeight: fontWeight.regular,
  },
  bodyMedium: {
    fontSize: fontSize.bodyMedium,
    lineHeight: lineHeight.bodyMedium,
    letterSpacing: letterSpacing.bodyMedium,
    fontWeight: fontWeight.regular,
  },
  bodySmall: {
    fontSize: fontSize.bodySmall,
    lineHeight: lineHeight.bodySmall,
    letterSpacing: letterSpacing.bodySmall,
    fontWeight: fontWeight.regular,
  },
  labelLarge: {
    fontSize: fontSize.labelLarge,
    lineHeight: lineHeight.labelLarge,
    letterSpacing: letterSpacing.labelLarge,
    fontWeight: fontWeight.medium,
  },
  labelMedium: {
    fontSize: fontSize.labelMedium,
    lineHeight: lineHeight.labelMedium,
    letterSpacing: letterSpacing.labelMedium,
    fontWeight: fontWeight.medium,
  },
  labelSmall: {
    fontSize: fontSize.labelSmall,
    lineHeight: lineHeight.labelSmall,
    letterSpacing: letterSpacing.labelSmall,
    fontWeight: fontWeight.medium,
  },
};

export default {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight,
  textStyles,
};
