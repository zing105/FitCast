import { Screen } from '@/components/ui/Screen';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function TermsScreen() {
  return (
    <Screen className="bg-white" withPadding={false}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: '서비스 이용약관',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { fontWeight: 'bold' }
      }} />

      <ScrollView className="flex-1 p-6">
        <View className="mb-10">
          <Text className="text-neutral-900 text-headline-sm font-bold mb-6">FitCast 서비스 이용약관</Text>
          
          <Text className="text-neutral-800 text-body-md font-bold mb-2">제1조 (목적)</Text>
          <Text className="text-neutral-500 text-body-md leading-6 mb-6">
            이 약관은 FitCast 팀이 제공하는 모바일 앱 및 제반 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </Text>

          <Text className="text-neutral-800 text-body-md font-bold mb-2">제2조 (회원 가입)</Text>
          <Text className="text-neutral-500 text-body-md leading-6 mb-6">
            회원은 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다. 본 서비스는 Google OAuth를 통한 로그인을 지원합니다.
          </Text>

          <Text className="text-neutral-800 text-body-md font-bold mb-2">제3조 (서비스의 제공)</Text>
          <Text className="text-neutral-500 text-body-md leading-6 mb-6">
            FitCast는 회원에게 다음과 같은 서비스를 제공합니다:{"\n"}
            1. 개인 의류 디지털 관리 기능{"\n"}
            2. AI 기반 코디 추천 및 스타일 분석 서비스{"\n"}
            3. 패션 관련 콘텐츠 및 커뮤니티 서비스
          </Text>

          <Text className="text-neutral-400 text-caption italic">최종 업데이트: 2024년 3월 25일</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
