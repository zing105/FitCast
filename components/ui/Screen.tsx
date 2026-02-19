/**
 * Screen Component
 * 화면 래퍼 컴포넌트 - SafeAreaView, 공통 패딩/배경색 적용
 */
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  /** SafeArea 적용 여부 (기본값: true) */
  safeArea?: boolean;
  /** 수평 패딩 적용 여부 (기본값: false, 개별 화면에서 제어) */
  withPadding?: boolean;
  /** 배경색 커스텀 클래스 */
  backgroundClassName?: string;
  /** 자식 컴포넌트 */
  children: React.ReactNode;
}

export function Screen({ 
  safeArea = true,
  withPadding = false,
  backgroundClassName = 'bg-white',
  children,
  className,
  style,
  ...props 
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  
  const baseClassName = `flex-1 ${backgroundClassName}`;
  const paddingClassName = withPadding ? 'px-4' : '';
  const combinedClassName = `${baseClassName} ${paddingClassName} ${className || ''}`.trim();

  // SafeArea 적용 시 패딩 계산
  const safeAreaStyle = safeArea ? {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  } : {};

  return (
    <View 
      className={combinedClassName} 
      style={[safeAreaStyle, style]} 
      {...props}
    >
      {children}
    </View>
  );
}

export default Screen;
