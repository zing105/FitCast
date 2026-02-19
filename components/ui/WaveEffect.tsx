/**
 * WaveEffect Component (Banana SVG Version)
 * 나노 바나나가 출렁이며 차오르는 효과
 */
import { primary } from '@/design-tokens';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface WaveEffectProps {
  progress: SharedValue<number>; // 1 (바닥) -> 0 (90% 지점)
  isActive: boolean;
  cardHeight: number; // 카드의 실제 높이
}

// 바나나 SVG 모양 정의 (Path data)
const BANANA_PATH = "M12 2c1.1 0 2 .9 2 2v1c0 .4-.1.8-.3 1.1l-1.3 1.3c-.3.3-.7.3-1 0L10.1 6.1c-.2-.3-.3-.7-.3-1.1V4c0-1.1.9-2 2-2zm-6.1 7.2c-.3-.4-.3-1 0-1.4 1.7-1.7 4-2.8 6.1-2.8s4.4 1.1 6.1 2.8c.3.4.3 1 0 1.4L16 11.3c-.4.4-1 .4-1.4 0-1.1-1.1-2.5-1.7-4-1.7s-2.9.6-4 1.7c-.4.4-1 .4-1.4 0l-2.1-2.1z";

export const WaveEffect: React.FC<WaveEffectProps> = ({ progress, isActive, cardHeight }) => {
  const wavePhase = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      wavePhase.value = withRepeat(
        withTiming(Math.PI * 2, { duration: 2500, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [isActive]);

  // SVG는 bottom: 0으로 정렬되어 있으므로, y=400이 카드의 바닥입니다.
  const animatedProps = useAnimatedProps(() => {
    const amplitude = 6; // 진동 폭을 더 줄여서 깔끔하게
    const frequency = 0.02;
    
    // progress 1.0(바닥) -> 0.0(기준점)
    // 20% 여백을 남기기 위해 stopY를 카드 상단에서 20% 내린 지점으로 설정
    const cardTop = 400 - cardHeight;
    const stopY = cardTop + (cardHeight * 0.2); 
    const startY = 400; // 바닥
    
    const height = (progress.value * (startY - stopY)) + stopY;
    
    let path = `M 0 ${height}`;
    for (let x = 0; x <= screenWidth; x += 15) {
      const y = height + Math.sin(x * frequency + wavePhase.value) * amplitude;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${screenWidth} 400 L 0 400 Z`;
    
    return { d: path };
  });

  const animatedProps2 = useAnimatedProps(() => {
    const amplitude = 4;
    const frequency = 0.025;
    
    const cardTop = 400 - cardHeight;
    const stopY = cardTop + (cardHeight * 0.2) + 10;
    const startY = 410;
    
    const height = (progress.value * (startY - stopY)) + stopY;
    
    let path = `M 0 ${height}`;
    for (let x = 0; x <= screenWidth; x += 15) {
      const y = height + Math.sin(x * frequency + wavePhase.value + 1.2) * amplitude;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${screenWidth} 400 L 0 400 Z`;
    
    return { d: path };
  });

  // 바나나 아이콘들이 둥둥 떠다니는 효과
  const renderFloatingBananas = () => {
    const bananas = [
      { x: screenWidth * 0.15, offset: 0 },
      { x: screenWidth * 0.5, offset: 0.5 },
      { x: screenWidth * 0.85, offset: 1.0 }
    ];

    return bananas.map((b, i) => (
      <FloatingBanana 
        key={i} 
        x={b.x} 
        wavePhase={wavePhase} 
        progress={progress} 
        phaseOffset={b.offset}
        cardHeight={cardHeight}
      />
    ));
  };

  if (!isActive || cardHeight === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={screenWidth} height="400" viewBox={`0 0 ${screenWidth} 400`} style={styles.svg}>
        {/* 뒤쪽 파도 */}
        <AnimatedPath 
          animatedProps={animatedProps2} 
          fill={primary[200]} 
          opacity={0.3} 
        />
        {/* 앞쪽 파도 (메인) */}
        <AnimatedPath 
          animatedProps={animatedProps} 
          fill={primary[100]} 
        />
        {/* 떠다니는 바나나들 */}
        {renderFloatingBananas()}
      </Svg>
    </View>
  );
};

// 둥둥 떠다니는 바나나 컴포넌트
const FloatingBanana = ({ x, wavePhase, progress, phaseOffset, cardHeight }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const frequency = 0.02;
    const amplitude = 8;
    
    const cardTop = 400 - cardHeight;
    const stopY = cardTop + (cardHeight * 0.2);
    const startY = 400;
    
    const height = (progress.value * (startY - stopY)) + stopY;
    const y = height + Math.sin(x * frequency + wavePhase.value + phaseOffset) * amplitude - 15;
    
    return {
      transform: [
        { translateX: x - 12 },
        { translateY: y },
        { rotate: `${Math.sin(wavePhase.value * 0.5 + phaseOffset) * 15}deg` }
      ],
      opacity: progress.value > 0.98 ? 0 : 1
    };
  });

  return (
    <Animated.View style={[styles.bananaContainer, animatedStyle]}>
      <Svg width="24" height="24" viewBox="0 0 24 24">
        <Path d={BANANA_PATH} fill={primary[500]} />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    bottom: -5, // 끝부분 틈새 방지
  },
  bananaContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
  }
});
