/**
 * Help Screen (도움말)
 * FAQ 및 앱 사용 가이드
 */
import { Screen } from '@/components/ui/Screen';
import { neutral } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  { 
    q: "옷을 어떻게 등록하나요?", 
    a: "메인 화면 하단의 '+' 버튼이나 옷장 탭의 등록 버튼을 눌러보세요. AI가 자동으로 카테고리와 색상을 분석해줍니다!" 
  },
  { 
    q: "AI 추천이 마음에 안 들어요.", 
    a: "더 많은 옷을 등록할수록 AI가 사용자의 취향을 더 잘 학습합니다. 마음에 드는 코디를 적극적으로 저장(찜)해보세요." 
  },
  { 
    q: "로그인이 안 돼요.", 
    a: "현재 Google 로그인만 지원하고 있습니다. 네트워크 상태를 확인하시거나 구글 서비스 상태를 체크해주세요." 
  },
  { 
    q: "내 데이터는 안전한가요?", 
    a: "데이터는 암호화되어 안전하게 보관되며, 개인화된 추천 서비스 제공 이외의 목적으로는 사용되지 않습니다." 
  }
];

export default function HelpScreen() {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: '도움말',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { fontWeight: 'bold' }
      }} />

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="mb-8">
            <Text className="text-neutral-900 text-headline-sm font-bold mb-2">무엇을 도와드릴까요?</Text>
            <Text className="text-neutral-500 text-body-md leading-6">FitCast 이용 중 궁금한 점을 확인해보세요.</Text>
        </View>

        <Text className="text-neutral-900 text-title-sm font-bold mb-4">자주 묻는 질문 (FAQ)</Text>
        
        {FAQ_DATA.map((item, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-5 mb-3 border border-neutral-100 shadow-sm"
          >
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-neutral-800 text-body-md font-semibold pr-4">Q. {item.q}</Text>
              <Ionicons 
                name={expandedIndex === index ? "chevron-up" : "chevron-down"} 
                size={18} 
                color={neutral[400]} 
              />
            </View>
            {expandedIndex === index && (
              <View className="mt-4 pt-4 border-t border-neutral-50">
                <Text className="text-neutral-500 text-body-md leading-6">{item.a}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View className="mt-10 mb-20 p-6 bg-primary-50 rounded-3xl items-center border border-primary-100">
            <Ionicons name="mail-outline" size={32} color={neutral[800]} className="mb-3" />
            <Text className="text-neutral-900 text-body-md font-bold mb-1">일대일 문의가 필요하신가요?</Text>
            <Text className="text-neutral-500 text-caption text-center">
                support@fitcast.app 으로 메일을 보내주시면{"\n"}
                빠르게 답변 드리겠습니다.
            </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
