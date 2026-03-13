/**
 * Cloth Detail Modal
 * 옷의 상세 정보를 확인하고 수정하거나 삭제할 수 있는 화면
 */
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral, primary, secondary } from '@/design-tokens';
import { useAuthStore } from '@/store/authStore';
import { useClosetStore } from '@/store/closetStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'top', label: '상의' },
  { id: 'bottom', label: '하의' },
  { id: 'outer', label: '아우터' },
  { id: 'shoes', label: '신발' },
  { id: 'bag', label: '가방' },
  { id: 'acc', label: '액세서리' },
];

export default function ClothDetailModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { items, updateItem, removeItem } = useClosetStore();
  
  const item = items.find(i => i.id.toString() === id?.toString());

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    category: item?.category || '',
    sub_category: item?.subCategory || '',
    brand: item?.brand || '',
    color: item?.color || '',
    pattern: item?.pattern || '',
    material: item?.material || '',
  });

  if (!item) {
    return (
      <Screen className="bg-white items-center justify-center">
        <Text className="text-neutral-500">아이템을 찾을 수 없습니다.</Text>
        <Button title="돌아가기" onPress={() => router.back()} className="mt-4" />
      </Screen>
    );
  }

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateItem(item.id, editData, user.id);
      setIsEditing(false);
      Alert.alert('성공', '옷 정보가 수정되었습니다.');
    } catch (error) {
      Alert.alert('오류', '수정 중 문제가 발생했습니다.');
    }
  };

  const handleDelete = () => {
    if (!user) return;
    Alert.alert(
      '정말 삭제할까요?',
      '삭제된 옷은 다시 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeItem(item.id, user.id);
              router.back();
            } catch (error) {
              Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
            }
          }
        }
      ]
    );
  };

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header & Image */}
        <View className="relative">
          <Image
            source={item.image}
            style={{ width: screenWidth, height: screenWidth * 1.3 }}
            resizeMode="cover"
          />
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-4 bg-black/50 p-2 rounded-full"
          >
             <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          {!isEditing && (
            <TouchableOpacity 
              onPress={handleDelete}
              className="absolute top-12 right-4 bg-red-500/80 p-2 rounded-full"
            >
               <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Content Area */}
        <View className="bg-white -mt-6 rounded-t-3xl px-6 pt-8 pb-32">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center mr-2">
                 <Ionicons name="shirt" size={16} color={neutral[600]} />
              </View>
              <Text className="text-neutral-900 text-title-md font-bold">의류 정보</Text>
            </View>
            <TouchableOpacity 
              onPress={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-4 py-2 rounded-xl ${isEditing ? 'bg-primary-500' : 'bg-neutral-100'}`}
            >
              <Text className={`font-bold ${isEditing ? 'text-white' : 'text-neutral-600'}`}>
                {isEditing ? '저장' : '수정'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Sections */}
          <View className="gap-6">
            {/* Category */}
            <View>
              <Text className="text-neutral-500 text-label-md font-bold mb-3">카테고리</Text>
              {isEditing ? (
                <View className="flex-row flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity 
                      key={cat.id}
                      onPress={() => setEditData(prev => ({ ...prev, category: cat.id }))}
                      className={`px-4 py-2 rounded-full border ${editData.category === cat.id ? 'bg-primary-500 border-primary-500' : 'bg-white border-neutral-200'}`}
                    >
                      <Text className={editData.category === cat.id ? 'text-white' : 'text-neutral-600'}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View className="flex-row gap-2">
                  <View className="bg-primary-50 px-4 py-2 rounded-full">
                    <Text className="text-primary-700 font-medium">{item.category.toUpperCase()}</Text>
                  </View>
                  <View className="bg-neutral-50 px-4 py-2 rounded-full">
                    <Text className="text-neutral-600">{item.subCategory}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Sub-category / Brand Edit */}
            {isEditing && (
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-neutral-500 text-label-md font-bold mb-3">상세 분류</Text>
                  <TextInput
                    className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-neutral-900"
                    value={editData.sub_category}
                    onChangeText={txt => setEditData(prev => ({ ...prev, sub_category: txt }))}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-neutral-500 text-label-md font-bold mb-3">브랜드</Text>
                  <TextInput
                    className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-neutral-900"
                    value={editData.brand}
                    onChangeText={txt => setEditData(prev => ({ ...prev, brand: txt }))}
                  />
                </View>
              </View>
            )}

            {!isEditing && (
               <View>
                 <Text className="text-neutral-500 text-label-md font-bold mb-3">브랜드</Text>
                 <Text className="text-neutral-900 text-body-lg font-medium">{item.brand || 'No Brand'}</Text>
               </View>
            )}

            {/* Color & Pattern */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-neutral-500 text-label-md font-bold mb-3">색상</Text>
                {isEditing ? (
                  <TextInput
                    className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-neutral-900"
                    value={editData.color}
                    onChangeText={txt => setEditData(prev => ({ ...prev, color: txt }))}
                  />
                ) : (
                  <View className="flex-row items-center">
                    <View className="w-5 h-5 rounded-full bg-neutral-200 mr-2" />
                    <Text className="text-neutral-900">{item.color || '미지정'}</Text>
                  </View>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-neutral-500 text-label-md font-bold mb-3">패턴</Text>
                {isEditing ? (
                  <TextInput
                    className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-neutral-900"
                    value={editData.pattern}
                    onChangeText={txt => setEditData(prev => ({ ...prev, pattern: txt }))}
                  />
                ) : (
                  <Text className="text-neutral-900">{item.pattern || '미지정'}</Text>
                )}
              </View>
            </View>

            {/* Material */}
            <View>
              <Text className="text-neutral-500 text-label-md font-bold mb-3">소재</Text>
              {isEditing ? (
                <TextInput
                  className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-neutral-900"
                  value={editData.material}
                  onChangeText={txt => setEditData(prev => ({ ...prev, material: txt }))}
                />
              ) : (
                <View className="bg-secondary-50 p-4 rounded-xl">
                  <Text className="text-secondary-900 font-medium">{item.material || '정보 없음'}</Text>
                </View>
              )}
            </View>
          </View>

          {isEditing && (
             <TouchableOpacity 
               onPress={() => setIsEditing(false)}
               className="mt-10 py-4 items-center"
             >
               <Text className="text-neutral-400 font-bold">수정 취소</Text>
             </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
