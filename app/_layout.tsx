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
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/utils/supabase';

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

  const login = useAuthStore((state) => state.login);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // 폰트 로딩 에러 처리
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // 🔑 Supabase Auth 상태 변화 리스너 (세션 자동 관리의 핵심!)
  // 이 리스너가 모든 인증 상태를 관리합니다:
  // - INITIAL_SESSION: 앱 시작/새로고침 시 저장된 세션 복원
  // - SIGNED_IN: 로그인 성공 시 (OAuth 리다이렉트 포함)
  // - SIGNED_OUT: 로그아웃 시
  // - TOKEN_REFRESHED: JWT 토큰 자동 갱신 시
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth 상태 변화:', event);
      
      if (session?.user) {
        const user = session.user;
        login({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        });
        console.log('✅ 세션 활성:', user.email);
      } else if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
        clearAuth();
        if (event === 'INITIAL_SESSION') {
          console.log('ℹ️ 저장된 세션 없음');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
