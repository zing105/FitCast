/**
 * AnimatedMeshGradient Component
 * 배경에 은은하게 움직이는 파스텔톤 그라데이션을 제공합니다.
 */
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface AnimatedMeshGradientProps {
  variant?: 'home' | 'ai';
}

const VARIANTS = {
  home: {
    baseBg: '#FFFFFF',
    overlay: 'transparent', // 오버레이 완전 제거하여 색상 가림 방지
    colors: [
      'rgba(0, 100, 255, 1.0)',   // Pure Toss Blue (No Transparency)
      'rgba(0, 80, 230, 0.9)',    // Deep Solid Blue
      'rgba(20, 140, 255, 0.9)',  // Vibrant Bright Blue
      'rgba(0, 180, 255, 0.85)',  // Cyan Blue
    ],
    durations: [20000, 28000, 24000, 32000],
  },
  ai: {
    baseBg: '#F8F9FF',
    overlay: 'rgba(255, 255, 255, 0.15)',
    colors: [
      'rgba(108, 92, 231, 0.35)',    // Deep Magic Purple
      'rgba(0, 206, 201, 0.30)',     // Magic Turquoise
      'rgba(255, 118, 117, 0.25)',   // Magic Coral
      'rgba(162, 155, 254, 0.30)',   // Soft Magic Purple
    ],
    durations: [12000, 15000, 18000, 20000],
  }
};

export const AnimatedMeshGradient = ({ variant = 'home' }: AnimatedMeshGradientProps) => {
  const config = VARIANTS[variant];
  const BLOB_COLORS = config.colors;
  // 각 블롭의 애니메이션 값 (0 ~ 1)
  const anim1 = useSharedValue(0);
  const anim2 = useSharedValue(0);
  const anim3 = useSharedValue(0);
  const anim4 = useSharedValue(0);

  useEffect(() => {
    // 매우 느리고 부드러운 무한 반복 애니메이션 (서로 다른 주기로 더 자연스럽게)
    // Very smooth, slow infinite loops
    anim1.value = withRepeat(
      withTiming(1, { duration: config.durations[0], easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim2.value = withRepeat(
      withTiming(1, { duration: config.durations[1], easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim3.value = withRepeat(
      withTiming(1, { duration: config.durations[2], easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim4.value = withRepeat(
      withTiming(1, { duration: config.durations[3], easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const blobStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(anim1.value, [0, 1], [-width * 0.3, width * 0.4]) },
      { translateY: interpolate(anim1.value, [0, 1], [-height * 0.1, height * 0.3]) },
      { scale: interpolate(anim1.value, [0, 1], [1, 1.5]) },
    ],
  }));

  const blobStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(anim2.value, [0, 1], [width * 0.6, -width * 0.2]) },
      { translateY: interpolate(anim2.value, [0, 1], [height * 0.1, height * 0.5]) },
      { scale: interpolate(anim2.value, [0, 1], [1.3, 0.7]) },
    ],
  }));

  const blobStyle3 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(anim3.value, [0, 1], [width * 0.1, -width * 0.3]) },
      { translateY: interpolate(anim3.value, [0, 1], [height * 0.8, height * 0.4]) },
    ],
  }));

  const blobStyle4 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(anim4.value, [0, 1], [-width * 0.2, width * 0.5]) },
      { translateY: interpolate(anim4.value, [0, 1], [height * 0.3, height * 0.7]) },
      { scale: interpolate(anim4.value, [0, 1], [0.8, 1.2]) },
    ],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 0 }]} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: config.baseBg }]} />
      
      {/* Blob 1 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[0], width: width * 1.5, height: width * 1.5, top: -width * 0.4 },
          blobStyle1
        ]} 
      />
      
      {/* Blob 2 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[1], width: width * 1.8, height: width * 1.8, top: height * 0.1 },
          blobStyle2
        ]} 
      />
      
      {/* Blob 3 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[2], width: width * 1.6, height: width * 1.6, bottom: -width * 0.3 },
          blobStyle3
        ]} 
      />

      {/* Blob 4 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[3], width: width * 1.4, height: width * 1.4, top: height * 0.3 },
          blobStyle4
        ]} 
      />
      
      {/* Soft overlay to blend colors */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: config.overlay }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.8,
  },
});
