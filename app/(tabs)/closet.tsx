/**
 * Closet Screen (옷장 화면)
 * 보유한 의류 목록을 관리하고 필터링하는 화면
 */
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { Screen } from '@/components/ui/Screen';
import { neutral } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock Data Categories
const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'top', label: '상의' },
  { id: 'bottom', label: '하의' },
  { id: 'outer', label: '아우터' },
  { id: 'shoes', label: '신발' },
  { id: 'bag', label: '가방' },
  { id: 'acc', label: '액세서리' },
];

/**
 * 임시 Mock Data 타입 정의
 */
import { useAuthStore } from '@/store/authStore';
import { ClothItem, useClosetStore } from '@/store/closetStore';

// ... (imports remain)

// ... (CATEGORIES remain)

export default function ClosetScreen() {
  const router = useRouter();
  const items = useClosetStore((state: any) => state.items); // Real Data from Store
  const { isLoggedIn } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 카테고리 + 검색어 복합 필터링
  const filteredItems = items.filter((item: ClothItem) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subCategory?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      false;
    
    return matchesCategory && matchesSearch;
  });

  const renderItem = ({ item }: { item: ClothItem }) => (
    <View className="flex-1 m-1.5 mb-4">
      <View className="aspect-[3/4] bg-neutral-100 rounded-2xl mb-2 overflow-hidden items-center justify-center relative">
         {item.image ? (
           <Image source={item.image} className="w-full h-full" resizeMode="cover" />
         ) : (
           <Ionicons name="shirt-outline" size={40} color={neutral[400]} />
         )}
         
         {/* Category Badge */ }
         <View className="absolute top-2 right-2 bg-black/5 p-1 rounded-md">
           <Text className="text-[10px] font-medium text-neutral-600 uppercase">{item.category}</Text>
         </View>
      </View>
      <Text className="text-neutral-900 text-body-sm font-medium truncate" numberOfLines={1}>{item.subCategory || item.category}</Text>
      <Text className="text-neutral-500 text-label-sm truncate" numberOfLines={1}>{item.brand || 'No Brand'}</Text>
    </View>
  );

  return (
    <Screen className="bg-white" withPadding={false}>
      {/* Search Bar */}
      <View className="px-4 py-2 bg-white container">
        <View className="bg-neutral-100 rounded-xl h-10 px-3 flex-row items-center border border-transparent focus:border-primary-300">
           <Ionicons name="search" size={20} color={neutral[400]} />
           <TextInput
              className="flex-1 text-neutral-900 text-body-sm ml-2 h-full"
              placeholder="브랜드, 색상, 아이템 검색"
              placeholderTextColor={neutral[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
           />
        </View>
      </View>

      {/* Category Pills */}
      <View className="py-2 mb-2">
        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item.id)}
                className={`px-4 py-2 rounded-full border ${
                  isSelected 
                    ? 'bg-neutral-900 border-neutral-900' 
                    : 'bg-white border-neutral-200'
                }`}
              >
                <Text 
                  className={`text-label-md font-medium ${
                    isSelected ? 'text-white' : 'text-neutral-600'
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Main Grid */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="py-20 items-center">
            <Text className="text-neutral-400 text-body-md">해당 카테고리에 옷이 없어요</Text>
          </View>
        }
      />
      
      {/* Floating Action Button */}
      <FloatingActionButton onPress={() => {
        if (!isLoggedIn) {
          router.push('/(modals)/login-modal');
          return;
        }
        router.push('/(modals)/camera');
      }} />
    </Screen>
  );
}
