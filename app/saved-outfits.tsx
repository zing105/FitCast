/**
 * Saved Outfits Screen (저장된 코디)
 * 사용자가 저장한 코디 조합들을 리스트 형태로 보여주는 화면
 */
import { Screen } from '@/components/ui/Screen';
import { neutral } from '@/design-tokens';
import { useClosetStore } from '@/store/closetStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SavedOutfitsScreen() {
  const router = useRouter();
  const savedOutfits = useClosetStore((state) => state.savedOutfits);
  const items = useClosetStore((state) => state.items);

  // 아이템 ID들로 실제 아이템 정보 가져오기
  const getOutfitItems = (itemIds: string[]) => {
    return itemIds.map(id => items.find(item => item.id === id)).filter(Boolean);
  };

  return (
    <Screen className="bg-white" withPadding={false}>
      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View className="px-6 pt-6 pb-4 bg-white flex-row items-center border-b border-neutral-100">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-4 p-1"
        >
          <Ionicons name="arrow-back" size={24} color={neutral[900]} />
        </TouchableOpacity>
        <Text className="text-neutral-900 text-title-lg font-bold">저장된 코디</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {savedOutfits.length > 0 ? (
            savedOutfits.map((outfit) => {
              const outfitItems = getOutfitItems(outfit.itemIds);
              return (
                <TouchableOpacity 
                  key={outfit.id}
                  onPress={() => {
                    router.push({
                      pathname: '/ootd-detail',
                      params: { itemIds: outfit.itemIds.join(',') }
                    });
                  }}
                  className="bg-neutral-50 rounded-3xl p-4 mb-4 border border-neutral-100 flex-row items-center"
                >
                  {/* Outfit Preview Thumbnails */}
                  <View className="flex-row items-center mr-4">
                    {outfitItems.slice(0, 3).map((item: any, idx) => (
                      <View 
                        key={item.id} 
                        className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-neutral-100"
                        style={{ marginLeft: idx === 0 ? 0 : -24, zIndex: 10 - idx }}
                      >
                        {item.image ? (
                          <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} className="w-full h-full" resizeMode="cover" />
                        ) : (
                          <View className="w-full h-full items-center justify-center">
                            <Ionicons name="shirt-outline" size={16} color={neutral[300]} />
                          </View>
                        )}
                      </View>
                    ))}
                    {outfitItems.length > 3 && (
                      <View className="w-12 h-12 bg-neutral-200 rounded-lg items-center justify-center -ml-6" style={{ zIndex: 0 }}>
                        <Text className="text-neutral-600 text-caption font-bold">+{outfitItems.length - 3}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-neutral-900 text-label-lg font-bold mb-1">
                      {outfit.name || `코디 #${outfit.id.slice(0, 4)}`}
                    </Text>
                    <Text className="text-neutral-400 text-caption">
                      {new Date(outfit.timestamp).toLocaleDateString()}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={16} color={neutral[300]} />
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="flex-1 items-center justify-center mt-20">
              <View className="w-20 h-20 bg-neutral-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="albums-outline" size={40} color={neutral[200]} />
              </View>
              <Text className="text-neutral-900 text-title-md font-bold mb-2">저장된 코디가 없어요</Text>
              <Text className="text-neutral-400 text-body-sm text-center px-10">
                마음에 드는 추천 코디를 저장하여{"\n"}나만의 아카이브를 만들어보세요!
              </Text>
              
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)')}
                className="mt-8 bg-primary-500 py-3 px-8 rounded-full"
              >
                <Text className="text-white text-label-lg font-bold">코디 추천 받으러 가기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
