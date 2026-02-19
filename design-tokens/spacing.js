/**
 * Design Tokens - Spacing
 * 8px 기반 간격 시스템 (4px 세분화 포함)
 * Material Design 3 레이아웃 가이드라인 준수
 */

// 기본 간격 단위 (8px 기반)
export const spacing = {
  0: 0,
  0.5: 2,   // 2px - 매우 작은 간격
  1: 4,     // 4px - 아이콘 내부 등
  1.5: 6,   // 6px
  2: 8,     // 8px - 기본 단위
  2.5: 10,  // 10px
  3: 12,    // 12px
  3.5: 14,  // 14px
  4: 16,    // 16px - 표준 패딩
  5: 20,    // 20px
  6: 24,    // 24px
  7: 28,    // 28px
  8: 32,    // 32px
  9: 36,    // 36px
  10: 40,   // 40px
  11: 44,   // 44px
  12: 48,   // 48px - 큰 요소 간격
  14: 56,   // 56px - FAB 크기
  16: 64,   // 64px
  20: 80,   // 80px
  24: 96,   // 96px
  28: 112,  // 112px
  32: 128,  // 128px
};

// 시맨틱 간격 (사용 목적별)
export const semanticSpacing = {
  // 컴포넌트 내부 패딩
  componentPaddingXs: spacing[2],    // 8px
  componentPaddingSm: spacing[3],    // 12px
  componentPaddingMd: spacing[4],    // 16px
  componentPaddingLg: spacing[6],    // 24px
  componentPaddingXl: spacing[8],    // 32px
  
  // 화면 레이아웃 패딩
  screenPaddingHorizontal: spacing[4],  // 16px
  screenPaddingVertical: spacing[6],    // 24px
  
  // 요소 간 간격
  itemGapXs: spacing[1],   // 4px
  itemGapSm: spacing[2],   // 8px
  itemGapMd: spacing[3],   // 12px
  itemGapLg: spacing[4],   // 16px
  itemGapXl: spacing[6],   // 24px
  
  // 섹션 간 간격
  sectionGapSm: spacing[6],   // 24px
  sectionGapMd: spacing[8],   // 32px
  sectionGapLg: spacing[12],  // 48px
  
  // 아이콘 크기
  iconXs: spacing[4],    // 16px
  iconSm: spacing[5],    // 20px
  iconMd: spacing[6],    // 24px
  iconLg: spacing[8],    // 32px
  iconXl: spacing[12],   // 48px
  
  // 버튼 높이
  buttonHeightSm: spacing[8],   // 32px
  buttonHeightMd: spacing[10],  // 40px
  buttonHeightLg: spacing[12],  // 48px
  buttonHeightXl: spacing[14],  // 56px (FAB)
  
  // 입력 필드 높이
  inputHeight: spacing[14],  // 56px
  
  // 카드
  cardPadding: spacing[4],    // 16px
  cardRadius: spacing[3],     // 12px
  cardRadiusLg: spacing[4],   // 16px
  
  // 바텀 내비게이션
  bottomNavHeight: spacing[10] + spacing[6],  // 64px (40 + 24)
  
  // 상태 바 / 노치 영역
  statusBarHeight: spacing[6],  // 24px (기본값, 실제는 safe area 사용)
};

// 테두리 반경 (Border Radius)
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999, // 완전한 원형
};

// 그림자/엘리베이션 (M3 Elevation 시스템)
export const elevation = {
  0: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
};

export default {
  spacing,
  semanticSpacing,
  borderRadius,
  elevation,
};
