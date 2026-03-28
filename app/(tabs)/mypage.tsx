/**
 * My Page Screen (마이페이지)
 * 사용자 프로필 및 설정 관리
 */
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral } from '@/design-tokens';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { usePWAStore } from '@/store/pwaStore';
import { PWAInstallModal } from '@/components/ui/PWAInstallModal';
import { Platform } from 'react-native';

export default function MyPageScreen() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const promptInstall = usePWAStore((state) => state.promptInstall);
  const isStandalone = usePWAStore((state) => state.isStandalone);
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const handleLogin = () => {
    router.push('/(modals)/login-modal' as any);
  };
  
  const renderMenuItem = (
    icon: React.ComponentProps<typeof Ionicons>['name'], 
    label: string, 
    onPress?: () => void,
    isLast = false, 
    badge?: string
  ) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center py-4 px-4 bg-white ${!isLast ? 'border-b border-neutral-100' : ''}`}
    >
      <View className="w-8 h-8 bg-neutral-50 rounded-lg items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color={neutral[600]} />
      </View>
      <Text className="flex-1 text-neutral-900 text-body-md font-medium">{label}</Text>
      {badge && (
        <View className="bg-primary-500 px-2 py-0.5 rounded-full mr-2">
            <Text className="text-white text-[10px] font-bold">{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={16} color={neutral[400]} />
    </TouchableOpacity>
  );

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-neutral-100">
        <Text className="text-neutral-900 text-title-lg font-bold">마이페이지</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Profile Section */}
        <View className="bg-white pb-8 pt-4 items-center mb-2">
            {isLoggedIn ? (
              // Logged In State
              <>
                <View className="w-24 h-24 bg-neutral-200 rounded-full mb-4 border-4 border-white shadow-sm overflow-hidden items-center justify-center">
                  {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} className="w-full h-full" />
                  ) : (
                    <Ionicons name="person" size={48} color={neutral[400]} />
                  )}
                </View>
                <Text className="text-headline-xs font-bold text-neutral-900 mb-1">{user?.name || '사용자'}</Text>
                <Text className="text-body-sm text-neutral-500 mb-4">{user?.email || ''}</Text>
              </>
            ) : (
              // Guest State
              <>
                <View className="w-24 h-24 bg-neutral-200 rounded-full mb-4 border-4 border-white shadow-sm overflow-hidden items-center justify-center">
                  <Ionicons name="person-outline" size={48} color={neutral[400]} />
                </View>
                <Text className="text-headline-xs font-bold text-neutral-900 mb-1">게스트</Text>
                <Text className="text-body-sm text-neutral-500 mb-4">로그인하고 더 많은 기능을 이용하세요</Text>
              </>
            )}
        </View>

        {/* Menu Groups */}
        <View className="mb-6">
            <Text className="px-6 py-2 text-neutral-500 text-label-sm font-semibold mt-4 mb-1">나의 활동</Text>
            <View className="bg-white border-y border-neutral-100">
                {renderMenuItem("heart-outline", "찜한 코디", () => router.push('/saved-outfits' as any))}
                {renderMenuItem("bookmark-outline", "스타일 스크랩", () => router.push('/style-scrap' as any), true)}
            </View>

            <Text className="px-6 py-2 text-neutral-500 text-label-sm font-semibold mt-6 mb-1">설정</Text>
            <View className="bg-white border-y border-neutral-100">
                {renderMenuItem("settings-outline", "앱 설정", () => router.push('/settings' as any))}
                {renderMenuItem("notifications-outline", "알림 설정", () => router.push('/settings' as any))}
                {renderMenuItem("shield-checkmark-outline", "계정 및 보안", () => router.push('/account-security' as any), true)}
            </View>

            <Text className="px-6 py-2 text-neutral-500 text-label-sm font-semibold mt-6 mb-1">지원</Text>
            <View className="bg-white border-y border-neutral-100">
                {renderMenuItem("help-circle-outline", "도움말", () => router.push('/help' as any))}
                {renderMenuItem("chatbubble-ellipses-outline", "피드백 보내기", () => router.push('/feedback' as any))}
                {renderMenuItem("document-text-outline", "서비스 이용약관", () => router.push('/terms' as any))}
                {renderMenuItem("lock-closed-outline", "개인정보 처리방침", () => router.push('/privacy' as any), Platform.OS !== 'web' || isStandalone)}
                {(Platform.OS === 'web' && !isStandalone) && (
                  renderMenuItem("download-outline", "홈 화면에 앱 추가", () => promptInstall(), true)
                )}
            </View>
        </View>
        
        <View className="px-6 mb-12">
            {isLoggedIn ? (
              <Button 
                  title="로그아웃" 
                  variant="text" 
                  className="mb-2"
                  onPress={handleLogout}
              />
            ) : (
              <Button 
                  title="로그인" 
                  variant="primary" 
                  className="mb-2"
                  onPress={handleLogin}
              />
            )}
            <Text className="text-center text-neutral-400 text-caption">버전 1.0.0</Text>
        </View>

      </ScrollView>
      
      {/* iOS가 PWA를 웹에서 사용할 때 보여줄 모달 */}
      <PWAInstallModal />
    </Screen>
  );
}
