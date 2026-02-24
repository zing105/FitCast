/**
 * Button Component
 * 다양한 변형을 지원하는 버튼 컴포넌트
 * Primary, Secondary, Outline, Text 스타일 지원
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';

// 버튼 변형 타입
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  /** 버튼 텍스트 */
  title: string;
  /** 버튼 변형 스타일 */
  variant?: ButtonVariant;
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 좌측 아이콘 */
  leftIcon?: React.ComponentProps<typeof Ionicons>['name'];
  /** 우측 아이콘 */
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 클릭 핸들러 */
  onPress?: () => void;
  /** 추가 스타일 클래스 */
  className?: string;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 * 
 * @example
 * // Primary 버튼
 * <Button title="확인" onPress={handleSubmit} />
 * 
 * @example
 * // 아이콘이 있는 버튼
 * <Button 
 *   title="촬영하기" 
 *   leftIcon="camera" 
 *   variant="primary" 
 * />
 * 
 * @example
 * // 텍스트 버튼
 * <Button title="취소" variant="text" />
 */
export function Button({
  title,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  loading = false,
  onPress,
  className = '',
}: ButtonProps) {
  // 크기별 스타일
  const sizeStyles: Record<ButtonSize, { container: string; text: string; icon: number }> = {
    sm: { container: 'h-8 px-3', text: 'text-label-md', icon: 16 },
    md: { container: 'h-10 px-4', text: 'text-label-lg', icon: 20 },
    lg: { container: 'h-12 px-6', text: 'text-body-lg', icon: 24 },
  };

  // 변형별 스타일
  const variantStyles: Record<ButtonVariant, { 
    container: string; 
    text: string;
    iconColor: string;
  }> = {
    primary: { 
      container: 'bg-primary-500', 
      text: 'text-white font-medium',
      iconColor: '#FFFFFF',
    },
    secondary: { 
      container: 'bg-secondary-500', 
      text: 'text-white font-medium',
      iconColor: '#FFFFFF',
    },
    outline: { 
      container: 'bg-transparent border-2 border-primary-500', 
      text: 'text-primary-500 font-medium',
      iconColor: '#2196F3',
    },
    text: { 
      container: 'bg-transparent', 
      text: 'text-primary-500 font-medium',
      iconColor: '#2196F3',
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  // 컨테이너 클래스
  const containerClasses = `flex-row items-center justify-center rounded-xl ${currentSize.container} ${currentVariant.container} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50' : ''} ${className}`.trim();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      className={containerClasses}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? '#fff' : '#2196F3'} 
        />
      ) : (
        <>
          {leftIcon && (
            <Ionicons 
              name={leftIcon} 
              size={currentSize.icon} 
              color={currentVariant.iconColor}
              style={{ marginRight: 8 }}
            />
          )}
          <Text className={`${currentSize.text} ${currentVariant.text}`}>
            {title}
          </Text>
          {rightIcon && (
            <Ionicons 
              name={rightIcon} 
              size={currentSize.icon} 
              color={currentVariant.iconColor}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

export default Button;
