/**
 * Image Upload Screen (이미지 업로드 화면)
 * 갤러리에서 의류 사진을 선택하여 등록하는 화면
 */
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function UploadScreen() {
  const router = useRouter();
  const [permission, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [isLoading, setIsLoading] = useState(false);

  // 갤러리 열기
  const pickImage = async () => {
    // 권한 확인
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('권한 필요', '사진을 업로드하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }
    }

    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        // 미리보기 화면으로 이동
        router.push({
          pathname: '/(modals)/preview',
          params: { photoUri: result.assets[0].uri },
        });
      }
    } catch (error) {
      console.error('이미지 선택 실패:', error);
      Alert.alert('오류', '이미지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <Screen className="bg-white">
      {/* 헤더 */}
      <View className="flex-row justify-between items-center py-4">
        <TouchableOpacity onPress={handleClose} className="p-2">
          <Ionicons name="close" size={24} color={neutral[900]} />
        </TouchableOpacity>
        <Text className="text-body-lg font-semibold text-neutral-900">새 의류 등록</Text>
        <View className="w-10" />
      </View>

      {/* 메인 컨텐츠 */}
      <View className="flex-1 items-center justify-center -mt-20">
        <View className="w-full px-8 items-center">
          <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="images" size={40} color={neutral[900]} />
          </View>
          
          <Text className="text-title-lg font-bold text-neutral-900 text-center mb-2">
            사진을 업로드해주세요
          </Text>
          <Text className="text-body-md text-neutral-500 text-center mb-8">
            디지털 옷장에 보관할{'\n'}의류 사진을 갤러리에서 선택해주세요
          </Text>

          <Button 
            title="갤러리에서 선택하기" 
            onPress={pickImage}
            loading={isLoading}
            leftIcon="image-outline"
            fullWidth
            size="lg"
          />
          
          <TouchableOpacity 
            className="mt-4 py-3 px-6"
            onPress={handleClose}
          >
            <Text className="text-neutral-500 text-body-md">취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
