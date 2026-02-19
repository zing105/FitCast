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
  'rgba(255, 235, 59, 0.12)', // Soft Yellow (Banana)
  'rgba(33, 150, 243, 0.10)',  // Soft Blue (Gemini)
  'rgba(156, 39, 176, 0.06)',  // Soft Purple
  'rgba(76, 175, 80, 0.06)',   // Soft Green
];

export const AnimatedMeshGradient = () => {
  // 각 블롭의 애니메이션 값 (0 ~ 1)
  const anim1 = useSharedValue(0);
  const anim2 = useSharedValue(0);
  const anim3 = useSharedValue(0);
  const anim4 = useSharedValue(0);

  useEffect(() => {
    // 매우 느리고 부드러운 무한 반복 애니메이션 (서로 다른 주기로 더 자연스럽게)
    anim1.value = withRepeat(
      withTiming(1, { duration: 25000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim2.value = withRepeat(
      withTiming(1, { duration: 32000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim3.value = withRepeat(
      withTiming(1, { duration: 28000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    anim4.value = withRepeat(
      withTiming(1, { duration: 35000, easing: Easing.inOut(Easing.sin) }),
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
          { backgroundColor: BLOB_COLORS[0], width: width * 1.2, height: width * 1.2, top: -width * 0.2 },
          blobStyle1
        ]} 
      />
      
      {/* Blob 2 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[1], width: width * 1.3, height: width * 1.3, top: height * 0.2 },
          blobStyle2
        ]} 
      />
      
      {/* Blob 3 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[2], width: width * 1.1, height: width * 1.1, bottom: -width * 0.1 },
          blobStyle3
        ]} 
      />

      {/* Blob 4 */}
      <Animated.View 
        style={[
          styles.blob, 
          { backgroundColor: BLOB_COLORS[3], width: width * 1.0, height: width * 1.0, top: height * 0.4 },
          blobStyle4
        ]} 
      />
      
      {/* Overlay for ultra softness */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.45)' }]} />
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
