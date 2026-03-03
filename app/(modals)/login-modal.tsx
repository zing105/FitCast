/**
 * Login Modal (로그인 유도 모달)
 * 특정 기능을 사용할 때 로그인이 필요함을 알리고 구글 로그인을 유도하는 화면
 */
import { AnimatedMeshGradient } from '@/components/ui/AnimatedMeshGradient';
import { Screen } from '@/components/ui/Screen';
import { primary } from '@/design-tokens';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/utils/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// 각 플랫폼별 클라이언트 ID
const GOOGLE_CLIENT_IDS = {
  web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // Web OAuth Client
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // iOS OAuth Client
};

export default function LoginModalScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  // 리디렉트 URI 설정 (Standard)
  // Web: window.location.origin (localhost)
  // Native (Dev Build): scheme based URI (e.g. reactnative://...)
  const redirectUri = AuthSession.makeRedirectUri();

  const finalRedirectUri = Platform.OS === 'web' 
    ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081') 
    : redirectUri;
  
  console.log('🔗 Redirect URI:', finalRedirectUri);
  
  // Google 인증 요청 훅 설정
  const config = {
    webClientId: GOOGLE_CLIENT_IDS.web,
    iosClientId: GOOGLE_CLIENT_IDS.ios, // Native App/Dev Build에서는 Native ID 사용
    androidClientId: GOOGLE_CLIENT_IDS.web, // Android ID 없으므로 Web으로 유지 (필요시 추가)
    scopes: ['profile', 'email', 'openid'],
    // redirectUri는 플랫폼에 따라 자동 처리되거나 finalRedirectUri 사용
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  // 인증 결과 응답 처리
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      
      console.log('🔍 Auth Response type: success');
      
      // id_token이 있으면 Supabase Auth 연동 (세션 유지 + RLS 통과)
      if (authentication?.idToken) {
        handleSignInWithGoogle(authentication.idToken);
      } else if (authentication?.accessToken) {
        // id_token이 없는 경우 accessToken으로 사용자 정보만 가져오기 (폴백)
        handleFallbackLogin(authentication.accessToken);
      } else {
        alert('인증 토큰을 받지 못했습니다.');
      }
    } else if (response?.type === 'error' || response?.type === 'cancel') {
       console.log('❌ Auth Error:', response);
    }
  }, [response]);

  // ✅ Supabase Auth와 Google ID Token 연동 (핵심!)
  const handleSignInWithGoogle = async (idToken: string) => {
    try {
      console.log('🚀 Supabase signInWithIdToken 시작');
      
      // Google ID Token을 Supabase Auth에 전달 → JWT 세션 발급
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;

      if (data.user) {
        login({
          id: data.user.id, // Supabase Auth의 UUID (RLS에서 auth.uid()로 사용됨)
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || 'User',
          avatar: data.user.user_metadata?.avatar_url,
        });
        console.log('✅ Supabase Auth 로그인 성공:', data.user.email);
        console.log('🔑 세션 토큰 발급 완료 (RLS 통과 가능)');
        router.back();
      }
    } catch (error: any) {
      console.error('❌ Supabase Auth Error:', error);
      alert(`로그인 오류: ${error.message}`);
    }
  };

  // 📌 폴백: id_token 없을 때 Access Token으로 사용자 정보만 가져오기
  const handleFallbackLogin = async (accessToken: string) => {
    try {
      console.log('⚠️ id_token 없음, Access Token으로 폴백 로그인');
      
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const userInfo = await userInfoResponse.json();
      
      if (userInfo && userInfo.email) {
        login({
          id: userInfo.id || 'google-user',
          email: userInfo.email || '',
          name: userInfo.name || 'User',
          avatar: userInfo.picture,
        });
        console.log('✅ 폴백 로그인 성공 (세션 유지/RLS 미지원):', userInfo.email);
        router.back();
      } else {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }
    } catch (error: any) {
      console.error('❌ Fallback Login Error:', error);
      alert(`로그인 오류: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    if (Platform.OS === 'web') {
      // 🌐 웹에서는 Supabase OAuth 플로우 사용 (세션 자동 관리)
      // Google 로그인 → 리다이렉트 → 세션 자동 저장 → onAuthStateChange가 감지
      console.log('🌐 웹: Supabase OAuth 리다이렉트 시작');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        console.error('❌ Supabase OAuth Error:', error);
        alert(`로그인 오류: ${error.message}`);
      }
    } else {
      // 📱 네이티브에서는 expo-auth-session 사용
      promptAsync();
    }
  };

  return (
    <Screen className="bg-transparent" withPadding={false}>
      {/* 프리미엄 배경 */}
      <AnimatedMeshGradient />
      
      <View className="flex-1 justify-center px-8">
        <View className="bg-white/80 border border-white/50 rounded-[40px] p-10 items-center shadow-2xl overflow-hidden">
          {/* Logo / Icon */}
          <View className="w-20 h-20 bg-primary-100 rounded-3xl items-center justify-center mb-8 shadow-sm">
             <Ionicons name="sparkles" size={40} color={primary[500]} />
          </View>

          {/* Text Content */}
          <Text className="text-neutral-900 text-title-lg font-bold text-center mb-3">
            더 똑똑한 옷장을{'\n'}만들어볼까요? 🚀
          </Text>
          <Text className="text-neutral-500 text-body-md text-center mb-10 leading-6">
            심도 있는 AI 분석과 개인 맞춤형 추천을{'\n'}받기 위해 구글 로그인이 필요합니다.
          </Text>

          {/* Google Login Button */}
          <TouchableOpacity 
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
            className="w-full bg-white border border-neutral-200 h-14 rounded-2xl flex-row items-center justify-center shadow-sm"
          >
            <View className="mr-3">
               {/* 임시 구글 아이콘 (나중에 SVG 에셋으로 교체 가능) */}
               <Ionicons name="logo-google" size={20} color="#4285F4" />
            </View>
            <Text className="text-neutral-700 text-body-md font-bold">Google 계정으로 계속하기</Text>
          </TouchableOpacity>

          {/* Debug: Redirect URI 표시 (테스트용) */}
          {request && (
            <View className="mt-4 p-2 bg-gray-100 rounded w-full">
              <Text className="text-[10px] text-gray-500 text-center">
                Redirect URI: {request.redirectUri}
              </Text>
            </View>
          )}

          {/* Skip / Close */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-6"
          >
            <Text className="text-label-md text-neutral-400">나중에 할게요</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
