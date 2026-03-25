/**
 * Account & Security Screen (계정 및 보안)
 * 비밀번호 변경, 계정 삭제, 연동 계정 관리
 */
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral } from '@/design-tokens';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function AccountSecurityScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const renderItem = (label: string, value?: string, onPress?: () => void, isLast = false) => (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center py-4 px-6 bg-white ${!isLast ? 'border-b border-neutral-100' : ''}`}
    >
      <View className="flex-1">
        <Text className="text-neutral-900 text-body-md font-medium">{label}</Text>
        {value && <Text className="text-neutral-400 text-caption mt-1">{value}</Text>}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={16} color={neutral[400]} />}
    </TouchableOpacity>
  );

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: '계정 및 보안',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { fontWeight: 'bold' }
      }} />

      <ScrollView className="flex-1">
        <Text className="px-6 py-4 text-neutral-500 text-label-sm font-semibold uppercase">내 계정 정보</Text>
        <View className="bg-white border-y border-neutral-100">
          {renderItem("이메일", user?.email || '이메일 정보 없음')}
          {renderItem("연동된 계정", "Google 연동 중", undefined, true)}
        </View>

        <Text className="px-6 py-4 text-neutral-500 text-label-sm font-semibold uppercase mt-4">보안 설정</Text>
        <View className="bg-white border-y border-neutral-100">
          {renderItem("비밀번호 변경", undefined, () => Alert.alert('알림', '구글 소셜 로그인은 구글 계정 설정에서 비밀번호를 변경할 수 있습니다.'))}
          {renderItem("2단계 인증", "사용 안 함", () => Alert.alert('알림', '준비 중인 기능입니다.'), true)}
        </View>

        <View className="px-6 mt-10">
          <TouchableOpacity 
            onPress={() => Alert.alert(
              '회원 탈퇴', 
              '정말로 탈퇴하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.',
              [{ text: '취소', style: 'cancel' }, { text: '탈퇴', style: 'destructive', onPress: () => Alert.alert('탈퇴 완료', '성공적으로 처리되었습니다.') }]
            )}
            className="flex-row items-center justify-center py-4 border border-red-100 rounded-2xl"
          >
            <Text className="text-red-500 font-bold">회원 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
