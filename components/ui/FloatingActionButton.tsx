/**
 * Floating Action Button (FAB) Component
 * Material Design 3 스타일의 플로팅 액션 버튼
 * 새 의류 추가 진입점
 */
import { primary } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface FloatingActionButtonProps {
  /** FAB 아이콘 (기본값: 'add') */
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  /** 버튼 눌림 시 실행할 함수 (기본값: 카메라 화면으로 이동) */
  onPress?: () => void;
  /** 커스텀 배경색 */
  backgroundColor?: string;
  /** 커스텀 아이콘 색상 */
  iconColor?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * M3 스타일 플로팅 액션 버튼
 * 우측 하단에 고정되며, 누르면 부드러운 스케일 애니메이션이 적용됩니다.
 * 
 * @example
 * // 기본 사용 (카메라 화면으로 이동)
 * <FloatingActionButton />
 * 
 * @example
 * // 커스텀 동작
 * <FloatingActionButton 
 *   icon="camera" 
 *   onPress={() => console.log('Custom action')} 
 * />
 */
export function FloatingActionButton({
  icon = 'add',
  onPress,
  backgroundColor = primary[500],
  iconColor = '#FFFFFF',
}: FloatingActionButtonProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const elevation = useSharedValue(6);

  // 버튼 눌림 효과
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: elevation.value * 0.02,
    shadowRadius: elevation.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    elevation.value = withTiming(3, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    elevation.value = withTiming(6, { duration: 100 });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // 기본 동작: 카메라 모달로 이동
      router.push('/(modals)/camera');
    }
  };

  return (
    <AnimatedTouchable
      style={[
        styles.fab,
        { backgroundColor },
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View className="items-center justify-center">
        <Ionicons name={icon} size={28} color={iconColor} />
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 16, // M3 FAB는 라운드 사각형
    alignItems: 'center',
    justifyContent: 'center',
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    // Android 엘리베이션
    elevation: 6,
  },
});

export default FloatingActionButton;
