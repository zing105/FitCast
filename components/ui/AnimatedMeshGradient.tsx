/**
 * AnimatedMeshGradient Component
 * 배경에 은은하게 움직이는 파스텔톤 그라데이션을 제공합니다.
 */
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const BLOB_COLORS = [
  'rgba(255, 214, 0, 0.4)',   // Bright Banana Yellow
  'rgba(41, 121, 255, 0.3)',  // Bright Gemini Blue
  'rgba(170, 0, 255, 0.25)',  // Bright Purple
  'rgba(0, 230, 118, 0.25)',  // Bright Green
];

export const AnimatedMeshGradient = () => {
  // 각 블롭의 애니메이션 값 (0 ~ 1)
  const anim1 = useSharedValue(0);
  const anim2 = useSharedValue(0);
  const anim3 = useSharedValue(0);
  const anim4 = useSharedValue(0);

  useEffect(() => {
    // 매우 느리고 부드러운 무한 반복 애니메이션 (서로 다른 주기로 더 자연스럽게)
    // Faster animations for better visibility of movement
    anim1.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim2.value = withRepeat(
      withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim3.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim4.value = withRepeat(
      withTiming(1, { duration: 20000, easing: Easing.inOut(Easing.sin) }),
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
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]} />
      
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
          { backgroundColor: BLOB_COLORS[1], width: width * 1.6, height: width * 1.6, top: height * 0.1 },
          blobStyle2
        ]} 
      />
      
      {/* Blob 3 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[2], width: width * 1.4, height: width * 1.4, bottom: -width * 0.2 },
          blobStyle3
        ]} 
      />

      {/* Blob 4 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[3], width: width * 1.3, height: width * 1.3, top: height * 0.4 },
          blobStyle4
        ]} 
      />
      
      {/* Reduced overlay opacity to let shapes pop */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} />
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
