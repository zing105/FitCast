/**
 * AI Recommendation Modal (Mood/Color Roulette)
 * 사용자의 오늘 기분과 스케줄을 입력받아 Gemini AI가 코디를 추천하는 기능
 */
import { AnimatedMeshGradient } from '@/components/ui/AnimatedMeshGradient';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { neutral, primary } from '@/design-tokens';
import { UIClothItem, useClosetStore } from '@/store/closetStore';
import { getOutfitRecommendation } from '@/utils/gemini';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Step = 'mood' | 'color' | 'schedule' | 'loading' | 'result';

const MOODS = [
  { id: '차분함', icon: 'cafe', label: '차분함' },
  { id: '활기참', icon: 'flash', label: '에너지 뿜뿜' },
  { id: '시크함', icon: 'glasses', label: '시크/모던' },
  { id: '편안함', icon: 'bed', label: '무조건 편하게' },
];

const COLORS = [
  { id: '웜톤', bgColor: '#FFE4B5', label: '따뜻한 웜톤' },
  { id: '쿨톤', bgColor: '#E0F7FA', label: '시원한 쿨톤' },
  { id: '모노톤', bgColor: '#E0E0E0', label: '무채색 모노톤' },
  { id: '화려한색', bgColor: '#FFCDD2', label: '기분전환 포인트 컬러' },
];

const SCHEDULES = [
  { id: '실내작업', icon: 'laptop', label: '실내 작업/공부' },
  { id: '야외활동', icon: 'bicycle', label: '야외 활동/산책' },
  { id: '특별한만남', icon: 'wine', label: '중요한 약속/데이트' },
  { id: '동네마실', icon: 'walk', label: '가벼운 동네 외출' },
];

export default function AIRecommendationModal() {
  const router = useRouter();
  const items = useClosetStore((state) => state.items);
  const addOutfit = useClosetStore((state) => state.saveOutfit);
  const setLastWorn = useClosetStore((state) => state.setLastWornOutfit);

  const [step, setStep] = useState<Step>('mood');
  const [answers, setAnswers] = useState({ mood: '', color: '', schedule: '' });
  const [aiResult, setAiResult] = useState<{ message: string; outfitItems: UIClothItem[] } | null>(null);

  const handleSelect = (category: keyof typeof answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [category]: value }));
    
    // 다음 스텝으로 자동 복귀
    if (category === 'mood') setStep('color');
    else if (category === 'color') setStep('schedule');
    else if (category === 'schedule') generateRecommendation({ ...answers, schedule: value });
  };

  const generateRecommendation = async (finalAnswers: typeof answers) => {
    setStep('loading');
    try {
      if (items.length === 0) throw new Error('옷장에 옷이 없습니다.');
      
      const { message, outfitIds } = await getOutfitRecommendation(
        items,
        finalAnswers.mood,
        finalAnswers.color,
        finalAnswers.schedule
      );

      // AI가 준 ID를 기반으로 실제 옷 객체 찾기
      const matchedItems = outfitIds
        .map(id => items.find(item => item.id.toString() === id.toString()))
        .filter(Boolean) as UIClothItem[];

      setAiResult({ message, outfitItems: matchedItems });
      setStep('result');
    } catch (error) {
      console.error(error);
      alert('AI 추천 중 문제가 발생했습니다.\n옷장에 충분한 옷이 있는지 확인해주세요!');
      router.back();
    }
  };

  const handleConfirmOutfit = () => {
    if (!aiResult) return;
    const ids = aiResult.outfitItems.map(i => i.id);
    setLastWorn(ids);
    addOutfit(ids, 'AI가 추천한 룩 ✨');
    router.back();
  };

  const renderHeader = () => (
    <View className="flex-row items-center justify-between mb-8 z-10 px-6 mt-4">
      <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white/50 rounded-full items-center justify-center">
        <Ionicons name="close" size={24} color={neutral[900]} />
      </TouchableOpacity>
      <View className="flex-row gap-2">
        <View className={`w-2 h-2 rounded-full ${step === 'mood' ? 'bg-primary-500' : 'bg-neutral-200'}`} />
        <View className={`w-2 h-2 rounded-full ${step === 'color' ? 'bg-primary-500' : 'bg-neutral-200'}`} />
        <View className={`w-2 h-2 rounded-full ${step === 'schedule' ? 'bg-primary-500' : 'bg-neutral-200'}`} />
      </View>
      <View className="w-10 h-10" />
    </View>
  );

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      <AnimatedMeshGradient />
      {step !== 'loading' && step !== 'result' && renderHeader()}

      <ScrollView className="flex-1 px-6 pb-12" showsVerticalScrollIndicator={false}>
        {/* Step 1: Mood */}
        {step === 'mood' && (
          <View className="flex-1 justify-center mt-10">
            <Text className="text-primary-600 font-bold mb-2">STEP 1</Text>
            <Text className="text-headline-sm font-bold text-neutral-900 mb-8">
              오늘 당신의 기분은 어떤가요?
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => handleSelect('mood', m.id)}
                  className="w-[47%] bg-white p-6 rounded-3xl border border-neutral-100 items-center justify-center shadow-sm"
                >
                  <Ionicons name={m.icon as any} size={32} color={primary[500]} className="mb-4" />
                  <Text className="text-neutral-900 font-bold mt-2">{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Color */}
        {step === 'color' && (
          <View className="flex-1 justify-center mt-10">
            <Text className="text-primary-600 font-bold mb-2">STEP 2</Text>
            <Text className="text-headline-sm font-bold text-neutral-900 mb-8">
              오늘 유독 끌리는 색상 온도는?
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => handleSelect('color', c.id)}
                  className="w-[47%] bg-white p-6 rounded-3xl border border-neutral-100 items-center justify-center shadow-sm"
                >
                  <View style={{ backgroundColor: c.bgColor }} className="w-16 h-16 rounded-full mb-4 shadow-sm" />
                  <Text className="text-neutral-900 font-bold text-center">{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Schedule */}
        {step === 'schedule' && (
          <View className="flex-1 justify-center mt-10">
            <Text className="text-primary-600 font-bold mb-2">STEP 3</Text>
            <Text className="text-headline-sm font-bold text-neutral-900 mb-8">
              오늘의 주된 스케줄은 무엇인가요?
            </Text>
            <View className="gap-4">
              {SCHEDULES.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => handleSelect('schedule', s.id)}
                  className="bg-white p-5 rounded-2xl border border-neutral-100 flex-row items-center shadow-sm"
                >
                  <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-4">
                    <Ionicons name={s.icon as any} size={24} color={primary[600]} />
                  </View>
                  <Text className="text-neutral-900 font-bold text-label-lg">{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Loading State */}
        {step === 'loading' && (
          <View className="flex-1 items-center justify-center mt-32">
            <View className="w-24 h-24 bg-white rounded-3xl shadow-lg items-center justify-center mb-8">
              <ActivityIndicator size="large" color={primary[500]} />
            </View>
            <Text className="text-headline-sm font-bold text-neutral-900 text-center mb-2">
              AI가 옷장을 스캔 중입니다...
            </Text>
            <Text className="text-neutral-500 text-center">
              선택하신 답변을 바탕으로{'\n'}가장 완벽한 코디를 생성하고 있어요 ✨
            </Text>
          </View>
        )}

        {/* Result State */}
        {step === 'result' && aiResult && (
          <View className="pt-8">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                <Ionicons name="close" size={24} color={neutral[900]} />
              </TouchableOpacity>
              <View className="bg-primary-500 px-3 py-1.5 rounded-full flex-row items-center shadow-sm">
                <Ionicons name="sparkles" size={14} color="white" />
                <Text className="text-white font-bold text-label-sm ml-1">AI Pick</Text>
              </View>
            </View>

            <View className="bg-white/80 p-6 rounded-3xl border border-white mb-6 shadow-sm">
              <Text className="text-neutral-900 text-title-lg font-bold leading-8">
                {aiResult.message}
              </Text>
            </View>

            <View className="gap-4 mb-8">
              {aiResult.outfitItems.map((item) => (
                <View key={item.id} className="bg-white p-4 rounded-2xl border border-neutral-100 flex-row items-center shadow-sm">
                  <View className="w-20 h-24 bg-neutral-100 rounded-xl overflow-hidden mr-4">
                    <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} className="w-full h-full" resizeMode="cover" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-primary-500 text-label-sm font-bold mb-1">{item.category}</Text>
                    <Text className="text-neutral-900 text-body-lg font-bold">{item.subCategory || '의류 아이템'}</Text>
                    <Text className="text-neutral-500 mt-1">{item.color || '컬러 미지정'}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Button title="이 코디로 확정하기 ✨" variant="primary" size="lg" onPress={handleConfirmOutfit} className="shadow-lg" />
            <Button title="다시 추천받기" variant="secondary" size="md" onPress={() => setStep('mood')} className="mt-3" />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
