/**
 * Root Layout
 * 앱의 최상위 레이아웃 - NativeWind 및 테마 설정
 */
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// NativeWind 글로벌 CSS 임포트
import '../global.css';

// 웹에서 구글 로그인 팝업이 부모 창으로 인증 상태를 전달하고 닫히도록 필수 설정
WebBrowser.maybeCompleteAuthSession();

import { useColorScheme } from '@/components/useColorScheme';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // (tabs)가 초기 라우트
  initialRouteName: '(tabs)',
};

// 에셋 로딩 완료 전 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    ...Ionicons.font,
  });

  // 폰트 로딩 에러 처리
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // 폰트 로딩 완료 후 스플래시 화면 숨김
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          {/* 메인 탭 내비게이션 */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* 카메라 플로우 (모달) */}
          <Stack.Screen 
            name="(modals)/camera" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="(modals)/preview" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="ootd-detail" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="(modals)/login-modal" 
            options={{ 
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'fade',
            }} 
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
