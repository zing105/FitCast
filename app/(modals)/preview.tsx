/**
 * Preview Screen (미리보기 및 AI 분석 결과)
 * 촬영된 사진을 확인하고 AI 분석 결과를 수정/저장하는 화면
 */
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral, primary } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

import { useAuthStore } from '@/store/authStore';
import { useClosetStore } from '@/store/closetStore';
import { uploadClothImage } from '@/utils/supabaseStorage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Analysis Data (나중에 실제 AI로 대체)
const MOCK_ANALYSIS = {
  category: 'Top',
  subCategory: 'T-Shirt',
  color: 'Navy',
  pattern: 'Solid',
  material: 'Cotton 100%',
  season: ['Spring', 'Summer'],
};

export default function PreviewScreen() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  
  const addItem = useClosetStore((state) => state.addItem); // Store Action
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<typeof MOCK_ANALYSIS | null>(null);

  // AI 분석 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(MOCK_ANALYSIS);
    }, 2000); // 2초 후 분석 완료

    return () => clearTimeout(timer);
  }, []);

  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();

  // 다시 찍기
  const handleRetake = () => {
    router.back();
  };

  // 저장하기 로직 연결 (Supabase 업로드 포함)
  const handleSave = async () => {
    if (!analysisResult || !user) {
      alert('로그인이 필요하거나 분석이 완료되지 않았습니다.');
      return;
    }

    try {
      setIsSaving(true);
      
      // 1. 이미지를 Base64로 변환 (플랫폼별 분기 처리)
      let base64Image = '';
      if (Platform.OS === 'web') {
        // 웹 브라우저에서는 fetch + FileReader 조합 사용
        const response = await fetch(photoUri);
        const blob = await response.blob();
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // 'data:image/jpeg;base64,' 접두사 제거
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // 네이티브(iOS/Android)에서는 expo-file-system 사용
        base64Image = await FileSystem.readAsStringAsync(photoUri, {
          // @ts-ignore
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // 2. 파일명 생성 (타임스탬프 기반)
      const fileName = `${user.id}_${Date.now()}.jpg`;

      // 3. Supabase Storage에 업로드 후 Public URL 받기
      const imageUrl = await uploadClothImage(base64Image, fileName);

      // 4. DB에 메타데이터와 함께 저장
      await addItem({
        image_url: imageUrl, 
        category: analysisResult.category.toLowerCase(), 
        sub_category: analysisResult.subCategory,
        brand: 'Unknown', 
        color: analysisResult.color,
        pattern: analysisResult.pattern,
        material: analysisResult.material,
        season: analysisResult.season,
      }, user.id);
      
      console.log('✨ 옷장에 저장 완료!', { imageUrl });
      
      // 홈으로 이동 및 스택 초기화
      router.dismissAll();
      router.replace('/(tabs)/closet');
      
    } catch (error) {
      console.error('옷 저장 전체 플로우 에러:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#171717', justifyContent: 'center', alignItems: 'center' }}>
         <Image 
            source={{ uri: photoUri }} 
            style={{ width: screenWidth, height: screenWidth * 1.3, position: 'absolute', opacity: 0.3 }} 
            resizeMode="cover"
         />
         <View 
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              padding: 24, 
              borderRadius: 16, 
              alignItems: 'center' 
            }}
         >
            <ActivityIndicator size="large" color={primary[500]} style={{ marginBottom: 16 }} />
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>AI가 옷을 분석 중입니다</Text>
            <Text style={{ color: '#a3a3a3', fontSize: 14 }}>패턴, 소재, 색상을 찾고 있어요...</Text>
         </View>
      </SafeAreaView>
    );
  }

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View className="relative">
          <Image
            source={{ uri: photoUri }}
            style={{ width: screenWidth, height: screenWidth * 1.3 }}
            resizeMode="cover"
          />
          <TouchableOpacity 
            onPress={handleRetake}
            className="absolute top-12 left-4 bg-black/50 p-2 rounded-full"
          >
             <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Analysis Result Form */}
        <View className="bg-white -mt-6 rounded-t-3xl px-6 pt-8 pb-32">
           <View className="flex-row items-center mb-6">
              <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-2">
                 <Ionicons name="sparkles" size={16} color={primary[500]} />
              </View>
              <Text className="text-neutral-900 text-title-md font-bold">AI 분석 결과</Text>
           </View>

           {/* Tags Section */}
           <View className="gap-6">
              {/* Category */}
              <View>
                 <Text className="text-neutral-500 text-label-md font-bold mb-3">카테고리</Text>
                 <View className="flex-row flex-wrap gap-2">
                    <View className="bg-primary-50 border border-primary-100 px-4 py-2 rounded-full">
                       <Text className="text-primary-700 text-body-sm font-medium">{analysisResult?.subCategory}</Text>
                    </View>
                    <View className="bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-full">
                       <Text className="text-neutral-600 text-body-sm">{analysisResult?.category}</Text>
                    </View>
                 </View>
              </View>

              {/* Color & Pattern */}
              <View className="flex-row gap-4">
                 <View className="flex-1">
                    <Text className="text-neutral-500 text-label-md font-bold mb-3">색상</Text>
                    <View className="flex-row items-center bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl">
                       <View className="w-6 h-6 rounded-full bg-[#000080] border border-neutral-200 mr-2" />
                       <Text className="text-neutral-900 text-body-sm">{analysisResult?.color}</Text>
                    </View>
                 </View>
                 <View className="flex-1">
                    <Text className="text-neutral-500 text-label-md font-bold mb-3">패턴</Text>
                    <View className="bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl items-center">
                       <Text className="text-neutral-900 text-body-sm">{analysisResult?.pattern}</Text>
                    </View>
                 </View>
              </View>

              {/* Material Inference */}
              <View>
                 <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-neutral-500 text-label-md font-bold">소재 (AI 추론)</Text>
                    <Ionicons name="information-circle-outline" size={18} color={neutral[400]} />
                 </View>
                 <View className="bg-secondary-50 border border-secondary-100 p-4 rounded-xl">
                    <Text className="text-secondary-900 text-body-sm font-medium mb-1">
                       {analysisResult?.material}
                    </Text>
                    <Text className="text-secondary-700 text-caption">
                       광택이 없고 짜임이 촘촘한 것으로 보아 면 소재일 확률이 높습니다.
                    </Text>
                 </View>
              </View>
           </View>
        </View>
      </ScrollView>

      {/* Validating Footer */}
      <View className="absolute bottom-0 w-full bg-white border-t border-neutral-100 px-6 py-4 pb-10 shadow-lg">
         <Button 
            title="이대로 저장하기" 
            fullWidth 
            size="lg" 
            onPress={handleSave}
            rightIcon="checkmark-circle"
         />
      </View>
    </Screen>
  );
}
