/**
 * Notifications Screen (알림 센터)
 * 앱의 주요 알림(세탁, 날씨, 추천)을 리스트 형태로 보여주는 화면
 */
import { Screen } from '@/components/ui/Screen';
import { neutral, primary, secondary, tertiary } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// 알림 데이터 타입
interface Notification {
  id: string;
  type: 'wash' | 'weather' | 'recommendation';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

// Mock 데이터
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'wash',
    title: '세탁 알림',
    message: '흰색 면 티셔츠를 입은 지 3일이 지났어요. 세탁이 필요할 것 같습니다!',
    time: '2시간 전',
    isRead: false,
  },
  {
    id: '2',
    type: 'weather',
    title: '날씨 조언',
    message: '오후 3시경 소나기 소식이 있습니다. 우산을 챙기거나 아우터를 준비하세요.',
    time: '5시간 전',
    isRead: false,
  },
  {
    id: '3',
    type: 'recommendation',
    title: '새로운 코디 추천',
    message: '하림님의 취향과 내일 날씨를 분석한 새로운 코디 조합이 등록되었습니다.',
    time: '어제',
    isRead: true,
  },
  {
    id: '4',
    type: 'wash',
    title: '세탁 완료 알림',
    message: '등록하셨던 드라이클리닝 아이템들의 세탁 주기가 완료되었습니다.',
    time: '2일 전',
    isRead: true,
  },
];

const TYPE_CONFIG = {
  wash: {
    icon: 'water',
    color: secondary[500] || '#FF5722',
    bgColor: secondary[50] || '#FFF3E0',
  },
  weather: {
    icon: 'rainy',
    color: tertiary[500] || '#009688',
    bgColor: tertiary[50] || '#E0F2F1',
  },
  recommendation: {
    icon: 'sparkles',
    color: primary[500],
    bgColor: primary[50],
  },
};

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <Screen className="bg-white" withPadding={false}>
      {/* Custom Header */}
      <View className="px-6 pt-6 pb-4 bg-white flex-row items-center border-b border-neutral-100">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-4 p-1"
        >
          <Ionicons name="arrow-back" size={24} color={neutral[900]} />
        </TouchableOpacity>
        <Text className="text-neutral-900 text-title-lg font-bold">알림 센터</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map((item) => {
              const config = TYPE_CONFIG[item.type];
              return (
                <TouchableOpacity 
                  key={item.id}
                  className={`px-6 py-4 flex-row items-start border-b border-neutral-50 ${item.isRead ? '' : 'bg-primary-50/30'}`}
                >
                  <View 
                    style={{ backgroundColor: config.bgColor }}
                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  >
                    <Ionicons name={config.icon as any} size={20} color={config.color} />
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-neutral-900 text-label-lg font-bold">{item.title}</Text>
                      <Text className="text-neutral-400 text-caption">{item.time}</Text>
                    </View>
                    <Text className="text-neutral-600 text-body-sm leading-5">
                      {item.message}
                    </Text>
                  </View>

                  {!item.isRead && (
                    <View className="w-2 h-2 bg-primary-500 rounded-full mt-2 ml-2" />
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="flex-1 items-center justify-center mt-20">
              <Ionicons name="notifications-off-outline" size={60} color={neutral[200]} />
              <Text className="text-neutral-400 text-body-md mt-4">최근 알림이 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
