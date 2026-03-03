/**
 * Animated FitCast Logo
 * 앱 헤더에 사용되는 프리미엄 애니메이션 텍스트 로고
 * react-native-reanimated를 활용한 글자별 등장 + 반짝임 효과
 */
import { primary, secondary } from '@/design-tokens';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const LOGO_TEXT = 'FitCast';

// 각 글자별 색상 그라디언트
const LETTER_COLORS = [
  primary[600],   // F - 브랜드 프라이머리
  primary[500],   // i
  primary[400],   // t
  secondary[500], // C - 세컨더리 전환
  secondary[400], // a
  primary[500],   // s
  primary[600],   // t
];

interface AnimatedLetterProps {
  letter: string;
  index: number;
  color: string;
}

function AnimatedLetter({ letter, index, color }: AnimatedLetterProps) {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    const delay = index * 80; // 글자별 80ms 딜레이

    // 등장 애니메이션
    translateY.value = withDelay(delay, withSpring(0, { 
      damping: 8, 
      stiffness: 120,
      mass: 0.8,
    }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    scale.value = withDelay(delay, withSpring(1, { 
      damping: 6, 
      stiffness: 100,
    }));

    // 루프 반짝임 (등장 후 시작)
    shimmer.value = withDelay(
      1000 + index * 150,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1, // 무한 반복
        true,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => {
    const animatedColor = interpolateColor(
      shimmer.value,
      [0, 1],
      [color, '#FFFFFF'],
    );
    return {
      color: animatedColor,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Animated.Text
        style={[
          {
            fontSize: 22,
            fontWeight: '800',
            letterSpacing: letter === 'C' ? 1 : 0.5, // C 앞에 살짝 간격
          },
          textStyle,
        ]}
      >
        {letter}
      </Animated.Text>
    </Animated.View>
  );
}

export function AnimatedLogo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {LOGO_TEXT.split('').map((letter, index) => (
        <AnimatedLetter
          key={index}
          letter={letter}
          index={index}
          color={LETTER_COLORS[index]}
        />
      ))}
    </View>
  );
}

export default AnimatedLogo;
