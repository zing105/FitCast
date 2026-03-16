/**
 * Feedback Screen (피드백 보내기)
 * 서비스 개선을 위한 사용자 의견을 수렴하는 화면
 */
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FeedbackScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '전송 완료',
        '소중한 의견 감사합니다! 더 나은 FitCast가 되도록 노력하겠습니다.',
        [{ text: '확인', onPress: () => router.back() }]
      );
    }, 1500);
  };

  return (
    <Screen className="bg-white" withPadding={false}>
      {/* Custom Header */}
      <View className="px-6 pt-6 pb-4 bg-white flex-row items-center border-b border-neutral-100">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-4 p-1"
        >
          <Ionicons name="arrow-back" size={24} color={neutral[900]} />
        </TouchableOpacity>
        <Text className="text-neutral-900 text-title-lg font-bold">피드백 보내기</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
        >
          <View className="mb-8">
            <View className="w-14 h-14 bg-primary-100 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="chatbubble-ellipses" size={28} color={neutral[900]} />
            </View>
            <Text className="text-neutral-900 text-headline-sm font-bold mb-2">무엇이든 말씀해주세요!</Text>
            <Text className="text-neutral-500 text-body-md leading-6">
              불편했던 점이나 추가되었으면 하는 기능이 있다면{"\n"}
              자유롭게 남겨주세요. 개발팀이 꼼꼼히 읽어보겠습니다.
            </Text>
          </View>

          <View className="gap-6">
            <View>
              <Text className="text-neutral-900 text-label-md font-bold mb-2">제목</Text>
              <TextInput
                className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-neutral-900 text-body-md"
                placeholder="간결한 제목을 입력해주세요"
                placeholderTextColor={neutral[400]}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View>
              <Text className="text-neutral-900 text-label-md font-bold mb-2">내용</Text>
              <TextInput
                className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-4 text-neutral-900 text-body-md min-h-[160]"
                placeholder="상세한 내용을 입력해주세요"
                placeholderTextColor={neutral[400]}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
              />
            </View>
          </View>

          <View className="mt-12">
            <Button 
              title={isSubmitting ? "전송 중..." : "의견 보내기"} 
              size="lg" 
              fullWidth 
              onPress={handleSubmit}
              disabled={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
