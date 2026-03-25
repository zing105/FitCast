import { Screen } from '@/components/ui/Screen';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function PrivacyScreen() {
  return (
    <Screen className="bg-white" withPadding={false}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: '개인정보 처리방침',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { fontWeight: 'bold' }
      }} />

      <ScrollView className="flex-1 p-6">
        <View className="mb-10">
          <Text className="text-neutral-900 text-headline-sm font-bold mb-6">개인정보 처리방침</Text>
          
          <Text className="text-neutral-800 text-body-md font-bold mb-2">1. 수집하는 개인정보의 항목</Text>
          <Text className="text-neutral-500 text-body-md leading-6 mb-6">
            회사는 회원가입 및 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:{"\n"}
            - 필수항목: 이름, 이메일 주소, 프로필 이미지 (Google 계정 정보){"\n"}
            - 서비스 이용과정에서 생성되는 정보: 의류 사진, 코디 저장 기록, 선호 스타일 데이터
          </Text>

          <Text className="text-neutral-800 text-body-md font-bold mb-2">2. 개인정보의 수집 및 이용 목적</Text>
          <Text className="text-neutral-500 text-body-md leading-6 mb-6">
            - 서비스 제공 및 본인 인증{"\n"}
            - AI 모델 고도화를 위한 익명화된 스타일 데이터 분석{"\n"}
            - 신규 기능 안내 및 마케팅 활용(동의 시)
          </Text>

          <Text className="text-neutral-800 text-body-md font-bold mb-2">3. 개인정보의 보유 및 이용 기간</Text>
          <Text className="text-neutral-500 text-body-md leading-6 mb-6">
            회원 탈퇴 시까지 보유하며, 법령에서 정한 기간이 있는 경우 그에 따릅니다.
          </Text>

          <Text className="text-neutral-400 text-caption italic">최종 업데이트: 2024년 3월 25일</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
