import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral, primary, secondary } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

import { useAuthStore } from '@/store/authStore';
import { useClosetStore } from '@/store/closetStore';
import { analyzeClothImage, ClothAnalysisResponse } from '@/utils/gemini';
import { uploadClothImage } from '@/utils/supabaseStorage';

export default function PreviewScreen() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  
  const addItem = useClosetStore((state) => state.addItem);

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<ClothAnalysisResponse | null>(null);

  // --- Edit States ---
  const [isEditing, setIsEditing] = useState(false);
  const [category, setCategory] = useState<'top' | 'bottom' | 'outer' | 'dress' | 'shoes' | 'accessory' | 'etc'>('top');
  const [subCategory, setSubCategory] = useState('');
  const [color, setColor] = useState('');
  const [pattern, setPattern] = useState('');
  const [material, setMaterial] = useState('');
  const [season, setSeason] = useState<string[]>([]);
  // -------------------

  // AI 분석 실행 (Gemini Vision)
  useEffect(() => {
    let isMounted = true;

    async function processImage() {
      try {
        let base64Image = '';
        if (Platform.OS === 'web') {
          const response = await fetch(photoUri);
          const blob = await response.blob();
          base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else {
          base64Image = await FileSystem.readAsStringAsync(photoUri, {
            // @ts-ignore
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        const result = await analyzeClothImage(base64Image as string);
        if (isMounted) {
          setAnalysisResult(result);
          // Sync with edit states
          setCategory(result.category);
          setSubCategory(result.sub_category);
          setColor(result.color);
          setPattern(result.pattern);
          setMaterial(result.material);
          setSeason(result.season);
          setIsAnalyzing(false);
        }
      } catch (error) {
        console.error('이미지 분석 실패:', error);
        if (isMounted) {
          alert('이미지 분석에 실패했습니다. 형식에 맞춰 기본값이 입력됩니다.');
          const fallback: ClothAnalysisResponse = {
            category: 'top',
            sub_category: '알 수 없음',
            color: '알 수 없음',
            color_hex: '#cccccc',
            pattern: '알 수 없음',
            material: '알 수 없음',
            season: ['봄', '여름', '가을', '겨울'],
          };
          setAnalysisResult(fallback);
          setCategory(fallback.category);
          setSubCategory(fallback.sub_category);
          setColor(fallback.color);
          setPattern(fallback.pattern);
          setMaterial(fallback.material);
          setSeason(fallback.season);
          setIsAnalyzing(false);
        }
      }
    }

    if (photoUri) {
      processImage();
    }

    return () => {
      isMounted = false;
    };
  }, [photoUri]);

  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();

  const handleRetake = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!analysisResult) return;
    if (isSaving) return;

    if (!user) {
      alert('로그인이 필요하거나 분석이 완료되지 않았습니다.');
      return;
    }

    try {
      setIsSaving(true);
      
      let base64Image = '';
      if (Platform.OS === 'web') {
        const response = await fetch(photoUri);
        const blob = await response.blob();
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        base64Image = await FileSystem.readAsStringAsync(photoUri, {
          // @ts-ignore
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const fileName = `${user.id}_${Date.now()}.jpg`;
      const imageUrl = await uploadClothImage(base64Image, fileName);

      await addItem({
        image_url: imageUrl, 
        category: category.toLowerCase(), 
        sub_category: subCategory || analysisResult.sub_category,
        brand: 'Unknown', 
        color: color || analysisResult.color,
        pattern: pattern || analysisResult.pattern,
        material: material || analysisResult.material,
        season: season || analysisResult.season,
      }, user.id);
      
      router.dismissAll();
      router.replace('/(tabs)/closet');
      
    } catch (error) {
      console.error('옷 저장 에러:', error);
      alert('저장 중 오류가 발생했습니다.');
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
         <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 24, borderRadius: 16, alignItems: 'center' }}>
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
        <View className="relative">
          <Image
            source={{ uri: photoUri }}
            style={{ width: screenWidth, height: screenWidth * 1.3 }}
            resizeMode="cover"
          />
          <TouchableOpacity onPress={handleRetake} className="absolute top-12 left-4 bg-black/50 p-2 rounded-full">
             <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="bg-white -mt-6 rounded-t-3xl px-6 pt-8 pb-40">
           <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-2">
                   <Ionicons name="sparkles" size={16} color={primary[500]} />
                </View>
                <Text className="text-neutral-900 text-title-md font-bold">AI 분석 결과</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsEditing(!isEditing)}
                className={`px-3 py-1.5 rounded-full ${isEditing ? 'bg-primary-500' : 'bg-neutral-100'}`}
              >
                <View className="flex-row items-center">
                  <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={14} color={isEditing ? "white" : neutral[600]} style={{ marginRight: 4 }} />
                  <Text className={`text-label-sm font-bold ${isEditing ? 'text-white' : 'text-neutral-600'}`}>
                    {isEditing ? "수정 완료" : "수정하기"}
                  </Text>
                </View>
              </TouchableOpacity>
           </View>

           <View className="gap-6">
              {/* Category Selection */}
              <View>
                 <Text className="text-neutral-500 text-label-md font-bold mb-3">카테고리</Text>
                 <View className="flex-row flex-wrap gap-2">
                    {(['top', 'bottom', 'outer'] as const).map((cat) => (
                      <TouchableOpacity 
                        key={cat}
                        disabled={!isEditing}
                        onPress={() => setCategory(cat)}
                        className={`px-5 py-2.5 rounded-full border ${
                          category === cat 
                            ? 'bg-primary-500 border-primary-500' 
                            : 'bg-neutral-50 border-neutral-100'
                        }`}
                      >
                        <Text className={`text-body-sm font-bold ${category === cat ? 'text-white' : 'text-neutral-400'}`}>
                          {cat === 'top' ? '상의' : cat === 'bottom' ? '하의' : '아우터'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                 </View>
              </View>

              {/* Sub-Category Edit */}
              <View>
                 <Text className="text-neutral-500 text-label-md font-bold mb-3">세부 분류</Text>
                 {isEditing ? (
                   <TextInput
                      className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-neutral-900 font-medium"
                      value={subCategory}
                      onChangeText={setSubCategory}
                      placeholder="예: 반팔 티셔츠, 청바지"
                   />
                 ) : (
                   <View className="bg-primary-50 border border-primary-100 px-4 py-2 rounded-full self-start">
                      <Text className="text-primary-700 text-body-sm font-medium">{subCategory}</Text>
                   </View>
                 )}
              </View>

              <View className="flex-row gap-4">
                 <View className="flex-1">
                    <Text className="text-neutral-500 text-label-md font-bold mb-3">색상</Text>
                    {isEditing ? (
                      <TextInput
                        className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-neutral-900"
                        value={color}
                        onChangeText={setColor}
                      />
                    ) : (
                      <View className="flex-row items-center bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl">
                         <View 
                           className="w-6 h-6 rounded-full border border-neutral-200 mr-2" 
                           style={{ backgroundColor: analysisResult?.color_hex || '#cccccc' }}
                         />
                         <Text className="text-neutral-900 text-body-sm">{color}</Text>
                      </View>
                    )}
                 </View>
                 <View className="flex-1">
                    <Text className="text-neutral-500 text-label-md font-bold mb-3">패턴</Text>
                    {isEditing ? (
                      <TextInput
                        className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-neutral-900"
                        value={pattern}
                        onChangeText={setPattern}
                      />
                    ) : (
                      <View className="bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl items-center">
                         <Text className="text-neutral-900 text-body-sm">{pattern}</Text>
                      </View>
                    )}
                 </View>
              </View>

              <View>
                 <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-neutral-500 text-label-md font-bold">소재 (AI 추론)</Text>
                    {!isEditing && <Ionicons name="information-circle-outline" size={18} color={neutral[400]} />}
                 </View>
                 {isEditing ? (
                    <TextInput
                      className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-neutral-900"
                      value={material}
                      onChangeText={setMaterial}
                    />
                 ) : (
                   <View className="bg-secondary-50 border border-secondary-100 p-4 rounded-xl">
                      <Text className="text-secondary-900 text-body-sm font-medium mb-1">{material}</Text>
                      <Text className="text-secondary-700 text-caption">Gemini Vision AI가 추론한 결과입니다.</Text>
                   </View>
                 )}
              </View>
           </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white border-t border-neutral-100 px-6 py-4 pb-10 shadow-lg">
         <Button 
            title={isSaving ? "저장 중..." : isEditing ? "수정 완료 및 저장하기" : "이대로 저장하기"} 
            fullWidth 
            size="lg" 
            onPress={isSaving ? undefined : handleSave}
            rightIcon="checkmark-circle"
            disabled={isSaving}
         />
      </View>
    </Screen>
  );
}
