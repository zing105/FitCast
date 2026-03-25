import { Screen } from '@/components/ui/Screen';
import { neutral, primary, secondary, tertiary } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNotificationStore } from '@/store/notificationStore';

const TYPE_CONFIG = {
  wash: {
    icon: 'water',
    color: '#FF5722',
    bgColor: '#FFF3E0',
  },
  weather: {
    icon: 'rainy',
    color: '#009688',
    bgColor: '#E0F2F1',
  },
  recommendation: {
    icon: 'sparkles',
    color: primary[500],
    bgColor: primary[50],
  },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  return (
    <Screen className="bg-white" withPadding={false}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View className="px-6 pt-6 pb-4 bg-white flex-row items-center border-b border-neutral-100">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-4 p-1"
        >
          <Ionicons name="arrow-back" size={24} color={neutral[900]} />
        </TouchableOpacity>
        <Text className="flex-1 text-neutral-900 text-title-lg font-bold">알림 센터</Text>
        
        {notifications.some(n => !n.isRead) && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-primary-500 text-label-md font-bold">모두 읽음</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-2">
          {notifications.length > 0 ? (
            notifications.map((item) => {
              const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.recommendation;
              return (
                <TouchableOpacity 
                  key={item.id}
                  onPress={() => markAsRead(item.id)}
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

