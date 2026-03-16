/**
 * Style Archive Screen (스타일 스크랩)
 * 사용자가 영감을 받은 패션 이미지들을 모아보고 관리하는 화면
 */
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral, primary, secondary } from '@/design-tokens';
import { useAuthStore } from '@/store/authStore';
import { useClosetStore } from '@/store/closetStore';
import { analyzeStyleScrap } from '@/utils/gemini';
import { uploadStyleScrapImage } from '@/utils/supabaseStorage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const COLUMN_WIDTH = (screenWidth - 48) / 2;

export default function StyleScrapScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { styleScraps, fetchScraps, addScrap, removeScrap, isLoading } = useClosetStore();
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchScraps(user.id);
    }
  }, [user]);

  // 이미지 선택 및 AI 분석/저장 플로우
  const handleAddScrap = async () => {
    if (!user) {
      Alert.alert('알림', '로그인이 필요한 기능입니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    const asset = result.assets ? result.assets[0] : null;
    const base64Data = asset?.base64;

    if (!result.canceled && base64Data && asset) {
      try {
        setIsProcessing(true);
        
        // 1. Gemini AI 분석
        const analysis = await analyzeStyleScrap(base64Data);
        
        // 2. Storage 업로드
        const fileName = `${user.id}_scrap_${Date.now()}.jpg`;
        const imageUrl = await uploadStyleScrapImage(base64Data, fileName);
        
        // 3. DB 저장
        await addScrap({
          image_url: imageUrl,
          description: analysis.description,
          tags: analysis.tags,
        }, user.id);

        Alert.alert('성공', '스타일 영감이 저장되었습니다.');
      } catch (error) {
        console.error('스크랩 추가 실패:', error);
        Alert.alert('오류', '저장 중 문제가 발생했습니다.');
      } finally {
        setIsProcessing(false);
      }
    }
  };



  // 핀터레스트 스타일 그리드를 위한 데이터 분할
  const leftColumn = styleScraps.filter((_, i) => i % 2 === 0);
  const rightColumn = styleScraps.filter((_, i) => i % 2 !== 0);

  const renderScrapItem = (scrap: any) => (
    <View key={scrap.id} className="mb-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: '/(modals)/scrap-detail' as any, params: { id: scrap.id } })}
      >
        <Image 
          source={scrap.image} 
          style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * (1 + Math.random() * 0.5) }} 
          resizeMode="cover" 
        />
        <View className="p-3">
          <Text className="text-neutral-900 text-caption font-medium mb-2" numberOfLines={2}>
            {scrap.description}
          </Text>
          <View className="flex-row flex-wrap gap-1">
            {scrap.tags.map((tag: string, idx: number) => (
              <Text key={idx} className="text-primary-600 text-[10px] font-bold">
                {tag}
              </Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white flex-row items-center justify-between border-b border-neutral-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
            <Ionicons name="arrow-back" size={24} color={neutral[900]} />
          </TouchableOpacity>
          <Text className="text-neutral-900 text-title-lg font-bold">스타일 스크랩</Text>
        </View>
        <TouchableOpacity 
          onPress={handleAddScrap}
          className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center shadow-md"
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isProcessing && (
           <View className="bg-primary-50 px-6 py-4 flex-row items-center justify-center border-b border-primary-100">
             <ActivityIndicator size="small" color={primary[500]} className="mr-3" />
             <Text className="text-primary-700 font-bold">AI가 스타일을 분석 중입니다...</Text>
           </View>
        )}

        {styleScraps.length > 0 ? (
          <View className="flex-row px-4 pt-4 gap-4">
            <View className="flex-1">{leftColumn.map(renderScrapItem)}</View>
            <View className="flex-1">{rightColumn.map(renderScrapItem)}</View>
          </View>
        ) : (
          !isLoading && !isProcessing && (
            <View className="flex-1 items-center justify-center mt-32 px-10">
              <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-6">
                <Ionicons name="bookmark-outline" size={40} color={neutral[300]} />
              </View>
              <Text className="text-neutral-900 text-title-md font-bold mb-2">저장된 스타일이 없어요</Text>
              <Text className="text-neutral-400 text-body-sm text-center">
                인터넷에서 발견한 멋진 패션이나{"\n"}
                입고 싶은 코디 사진을 스크랩해보세요!
              </Text>
              <TouchableOpacity 
                onPress={handleAddScrap}
                className="mt-8 bg-white border border-neutral-200 py-3 px-8 rounded-full shadow-sm"
              >
                <Text className="text-neutral-900 text-label-lg font-bold">첫 번째 스크랩 추가하기</Text>
              </TouchableOpacity>
            </View>
          )
        )}
        
        {isLoading && styleScraps.length === 0 && (
          <View className="flex-1 items-center justify-center mt-20">
            <ActivityIndicator size="large" color={primary[500]} />
          </View>
        )}
        
        <View className="h-20" />
      </ScrollView>
    </Screen>
  );
}
