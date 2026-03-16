import { Screen } from '@/components/ui/Screen';
import { neutral, primary } from '@/design-tokens';
import { useAuthStore } from '@/store/authStore';
import { useClosetStore } from '@/store/closetStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ScrapDetailModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { styleScraps, removeScrap } = useClosetStore();
  
  const scrap = styleScraps.find((s) => s.id === id);

  if (!scrap) {
    return (
      <Screen className="bg-white flex-1 items-center justify-center">
        <Text>데이터를 찾을 수 없습니다.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary-500">돌아가기</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  const handleDelete = () => {
    if (!user) return;
    Alert.alert(
      '영감 삭제',
      '이 스타일 영감을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive', 
          onPress: async () => {
             await removeScrap(scrap.id, user.id);
             router.back();
          } 
        }
      ]
    );
  };

  return (
    <Screen className="bg-white" withPadding={false}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-neutral-100">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="close" size={28} color={neutral[900]} />
        </TouchableOpacity>
        <Text className="text-neutral-900 text-title-md font-bold">스타일 상세</Text>
        <TouchableOpacity onPress={handleDelete} className="p-1">
          <Ionicons name="trash-outline" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View className="w-full aspect-[3/4] bg-neutral-100">
          <Image 
            source={scrap.image} 
            className="w-full h-full" 
            resizeMode="cover" 
          />
        </View>

        {/* Content Section */}
        <View className="p-6">
          <View className="flex-row flex-wrap gap-2 mb-4">
            {scrap.tags.map((tag, idx) => (
              <View key={idx} className="bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                <Text className="text-primary-700 text-label-md font-bold">{tag}</Text>
              </View>
            ))}
          </View>
          
          <Text className="text-neutral-900 text-title-md font-bold mb-3">AI 스타일 분석</Text>
          <View className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <Text className="text-neutral-800 text-body-md leading-relaxed">
              {scrap.description}
            </Text>
          </View>

          <View className="mt-10 mb-20">
             <TouchableOpacity 
               onPress={handleDelete}
               className="bg-neutral-50 border border-neutral-200 py-4 rounded-2xl items-center"
             >
               <Text className="text-[#FF5252] font-bold">이 영감 삭제하기</Text>
             </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
