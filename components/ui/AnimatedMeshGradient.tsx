/**
 * AnimatedMeshGradient Component
 * 배경에 은은하게 움직이는 파스텔톤 그라데이션을 제공합니다.
 * 웹 호환성을 위해 useAnimatedStyle 대신 일반 Animated.Value + style 사용
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

// 동기적으로 초기 크기 확보 (useWindowDimensions는 첫 렌더에 0을 반환할 수 있음)
const SCREEN = Dimensions.get('window');

interface AnimatedMeshGradientProps {
  variant?: 'home' | 'ai';
}

const VARIANTS = {
  home: {
    baseBg: '#FFFFFF',
    overlay: 'transparent',
    colors: [
      'rgba(0, 100, 255, 0.7)',    // Toss Blue - bold
      'rgba(50, 130, 255, 0.65)',  // Light Blue - bold
      'rgba(0, 210, 255, 0.6)',    // Sky Blue - bold
      'rgba(100, 180, 255, 0.6)',  // Soft Blue - bold
    ],
    durations: [20000, 28000, 24000, 32000],
  },
  ai: {
    baseBg: '#F8F9FF',
    overlay: 'rgba(255, 255, 255, 0.15)',
    colors: [
      'rgba(108, 92, 231, 0.55)',    // Deep Magic Purple
      'rgba(0, 206, 201, 0.50)',     // Magic Turquoise
      'rgba(255, 118, 117, 0.45)',   // Magic Coral
      'rgba(162, 155, 254, 0.50)',   // Soft Magic Purple
    ],
    durations: [12000, 15000, 18000, 20000],
  }
};

export const AnimatedMeshGradient = ({ variant = 'home' }: AnimatedMeshGradientProps) => {
  const config = VARIANTS[variant];
  const W = SCREEN.width || 400;  // 폴백값 400
  const H = SCREEN.height || 800; // 폴백값 800

  // React Native 기본 Animated.Value 사용 (웹 100% 호환)
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  const anim4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false, // transform on web needs false
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
    };

    const animations = [
      createLoop(anim1, config.durations[0]),
      createLoop(anim2, config.durations[1]),
      createLoop(anim3, config.durations[2]),
      createLoop(anim4, config.durations[3]),
    ];

    Animated.parallel(animations).start();

    return () => {
      animations.forEach(a => a.stop());
    };
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: config.baseBg }]} />

      {/* Blob 1 */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: config.colors[0],
            width: W * 1.5,
            height: W * 1.5,
            top: -W * 0.4,
            left: -W * 0.3,
            transform: [
              {
                translateX: anim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-W * 0.3, W * 0.4],
                }),
              },
              {
                translateY: anim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-H * 0.1, H * 0.3],
                }),
              },
              {
                scale: anim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5],
                }),
              },
            ],
          },
        ]}
      />

      {/* Blob 2 */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: config.colors[1],
            width: W * 1.8,
            height: W * 1.8,
            top: H * 0.1,
            left: 0,
            transform: [
              {
                translateX: anim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [W * 0.6, -W * 0.2],
                }),
              },
              {
                translateY: anim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [H * 0.1, H * 0.5],
                }),
              },
              {
                scale: anim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.3, 0.7],
                }),
              },
            ],
          },
        ]}
      />

      {/* Blob 3 */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: config.colors[2],
            width: W * 1.6,
            height: W * 1.6,
            bottom: -W * 0.3,
            left: 0,
            transform: [
              {
                translateX: anim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [W * 0.1, -W * 0.3],
                }),
              },
              {
                translateY: anim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [H * 0.8, H * 0.4],
                }),
              },
            ],
          },
        ]}
      />

      {/* Blob 4 */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: config.colors[3],
            width: W * 1.4,
            height: W * 1.4,
            top: H * 0.3,
            left: 0,
            transform: [
              {
                translateX: anim4.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-W * 0.2, W * 0.5],
                }),
              },
              {
                translateY: anim4.interpolate({
                  inputRange: [0, 1],
                  outputRange: [H * 0.3, H * 0.7],
                }),
              },
              {
                scale: anim4.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />

      {/* Soft overlay */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: config.overlay }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 1,
  },
});
