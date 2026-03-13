/**
 * Animated Splash Screen Component
 * 앱 초기 진입 시 보여주는 브랜드 애니메이션 화면
 */
import { primary } from '@/design-tokens';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { 
  interpolate, 
  runOnJS, 
  useAnimatedStyle, 
  useSharedValue, 
  withDelay, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Props {
  onAnimationFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<Props> = ({ onAnimationFinish }) => {
  // Shared Values for Animation
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Logo Fade In & Scale Up
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 12, stiffness: 90 });

    // 2. Wait 2 seconds, then Fade Out Container
    const timeout = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(onAnimationFinish)();
        }
      });
    }, 2200);

    return () => clearTimeout(timeout);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        <Animated.Image
          source={require('../assets/images/icon.png')}
          style={[styles.logo, logoStyle]}
          resizeMode="contain"
        />
        <Animated.Text style={[styles.title, logoStyle]}>
          FitCast
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, logoStyle]}>
          오늘의 날씨와 완벽한 코디
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#171717',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#737373',
    marginTop: 8,
    fontFamily: 'SpaceMono',
  },
});
