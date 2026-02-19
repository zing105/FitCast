/**
 * OOTD Detail Screen (추천 코디 상세 보기)
 * 홈 화면에서 추천된 코디를 크게 보여주고 확인하는 화면
 */
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral, primary } from '@/design-tokens';
import { useClosetStore } from '@/store/closetStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function OOTDDetailScreen() {
  const router = useRouter();
  const { itemIds, temp, condition } = useLocalSearchParams<{ 
    itemIds: string; // "id1,id2,id3" 형식
    temp: string;
    condition: string;
  }>();

  const items = useClosetStore((state) => state.items);
  
  const setLastWornOutfit = useClosetStore((state) => state.setLastWornOutfit);
  const saveOutfit = useClosetStore((state) => state.saveOutfit);
  const removeOutfit = useClosetStore((state) => state.removeOutfit);
  const savedOutfits = useClosetStore((state) => state.savedOutfits);
  
  // 전달받은 ID들로 실제 아이템 필터링 (Placeholder 포함 처리)
  const recommendedItems = useMemo(() => {
    if (!itemIds) return [];
    const ids = itemIds.split(',');
    
    return ids.map(id => {
      if (id.startsWith('placeholder-')) {
        const category = id.replace('placeholder-', '');
        return {
          id,
          category,
          subCategory: `${category === 'top' ? '상의' : category === 'bottom' ? '하의' : '아우터'}가 부족해요`,
          isPlaceholder: true,
        };
      }
      return items.find(item => item.id === id);
    }).filter(Boolean);
  }, [itemIds, items]);

  // 실제 아이템 ID들 추출 (비교 및 저장용)
  const realItemIds = useMemo(() => {
    return recommendedItems
      .filter((item: any) => !item.isPlaceholder)
      .map((item: any) => item.id)
      .sort(); // 순서 상관없이 비교하기 위해 정렬
  }, [recommendedItems]);

  // 이미 저장된 코디인지 확인
  const existingSavedOutfit = useMemo(() => {
    if (realItemIds.length === 0) return null;
    
    return savedOutfits.find(outfit => {
      if (outfit.itemIds.length !== realItemIds.length) return false;
      const sortedSavedIds = [...outfit.itemIds].sort();
      return sortedSavedIds.every((id, index) => id === realItemIds[index]);
    });
  }, [savedOutfits, realItemIds]);

  const isAlreadySaved = !!existingSavedOutfit;

  const handleClose = () => {
    router.back();
  };

  const handleWear = () => {
    setLastWornOutfit(realItemIds);
    router.back();
  };

  const handleSave = () => {
    if (realItemIds.length === 0) return;

    if (isAlreadySaved) {
      // 이미 저장된 경우 삭제 (토글)
      removeOutfit(existingSavedOutfit.id);
      alert('코디 아카이브에서 삭제되었습니다. 🗑️');
    } else {
      // 저장
      saveOutfit(realItemIds);
      alert('코디 아카이브에 저장되었습니다! ✨');
    }
  };

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      {/* Custom Header */}
      <View className="px-6 pt-6 pb-4 bg-white flex-row justify-between items-center shadow-sm">
        <View>
          <Text className="text-neutral-500 text-label-md">오늘의 추천 코디</Text>
          <View className="flex-row items-center">
            <Text className="text-neutral-900 text-title-lg font-bold mr-2">OOTD Preview</Text>
            {temp && (
               <View className="bg-primary-50 px-2 py-0.5 rounded-full">
                  <Text className="text-primary-700 text-caption font-bold">{temp}°C {condition}</Text>
               </View>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={handleClose} className="p-2 bg-neutral-100 rounded-full">
          <Ionicons name="close" size={24} color={neutral[900]} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {recommendedItems.length > 0 ? (
          <View className="gap-6">
            {recommendedItems.map((item: any, index) => (
              <View 
                key={item.id} 
                className={`bg-white rounded-3xl overflow-hidden shadow-sm border ${item.isPlaceholder ? 'border-dashed border-primary-200' : 'border-neutral-100'}`}
              >
                <View className="relative">
                   <View className={`w-full h-80 ${item.isPlaceholder ? 'bg-primary-50' : 'bg-neutral-50'} items-center justify-center`}>
                      {item.isPlaceholder ? (
                        <View className="items-center">
                           <Ionicons name="cart-outline" size={64} color={primary[200]} />
                           <Text className="text-primary-400 text-label-md mt-2">구매 추천</Text>
                        </View>
                      ) : item.image ? (
                        <Image 
                          source={item.image} 
                          style={{ width: '100%', height: '100%' }} 
                          resizeMode="cover" 
                        />
                      ) : (
                        <Ionicons name="shirt-outline" size={64} color={neutral[200]} />
                      )}
                   </View>
                   <View className={`absolute top-4 left-4 ${item.isPlaceholder ? 'bg-primary-500' : 'bg-black/60'} px-3 py-1 rounded-full`}>
                      <Text className="text-white text-caption font-bold uppercase">{item.category}</Text>
                   </View>
                </View>
                
                <View className="p-5">
                   <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                         <Text className="text-neutral-400 text-label-sm mb-1">
                            {item.isPlaceholder ? 'Shopping Tip' : item.brand || 'No Brand'}
                         </Text>
                         <Text className={`text-title-md font-bold ${item.isPlaceholder ? 'text-primary-700' : 'text-neutral-900'}`}>
                            {item.subCategory || 'Clothing Item'}
                         </Text>
                      </View>
                      {!item.isPlaceholder && (
                        <View className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center">
                           <Ionicons name="heart-outline" size={18} color={neutral[400]} />
                        </View>
                      )}
                   </View>
                   
                   {item.isPlaceholder ? (
                     <View className="bg-primary-50/50 p-4 rounded-xl mt-2">
                        <Text className="text-primary-600 text-body-sm">
                           현재 날씨에 어울리는 이 카테고리의 옷이 부족해요. 비슷한 스타일의 옷을 구매해보는 건 어떨까요?
                        </Text>
                     </View>
                   ) : (
                     <View className="flex-row gap-2 mt-2">
                        {item.color && (
                           <View className="bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
                              <Text className="text-neutral-600 text-caption">#{item.color}</Text>
                           </View>
                        )}
                        {item.material && (
                           <View className="bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
                              <Text className="text-neutral-600 text-caption">#{item.material}</Text>
                           </View>
                        )}
                     </View>
                   )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
             <Ionicons name="alert-circle-outline" size={60} color={neutral[200]} />
             <Text className="text-neutral-400 text-body-md mt-4">코디 정보를 불러올 수 없습니다.</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 w-full bg-white border-t border-neutral-100 px-6 py-6 pb-12 shadow-2xl">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button 
               title={isAlreadySaved ? "코디 저장됨" : "코디 저장"}
               fullWidth 
               variant={isAlreadySaved ? "outline" : "outline"} // Stay consistent or change if desired
               size="lg" 
               onPress={handleSave}
               leftIcon={isAlreadySaved ? "bookmark" : "bookmark-outline"}
            />
          </View>
          <View className="flex-2" style={{ flex: 2 }}>
            <Button 
               title="오늘 이 옷 입기" 
               fullWidth 
               size="lg" 
               onPress={handleWear}
               rightIcon="checkmark-circle"
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}
