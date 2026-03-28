/**
 * Home Screen (홈 화면)
 * 개인화된 대시보드 형태의 메인 화면
 */
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { Screen } from '@/components/ui/Screen';
import { neutral, primary, secondary, tertiary } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { AnimatedMeshGradient } from '@/components/ui/AnimatedMeshGradient';
import { InstallBanner } from '@/components/ui/InstallBanner';
import { WaveEffect } from '@/components/ui/WaveEffect';
import { useRecommendation } from '@/hooks/useRecommendation';
import { useAuthStore } from '@/store/authStore';
import { useClosetStore } from '@/store/closetStore';
import { useNotificationStore } from '@/store/notificationStore';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const WEATHER_ICONS: Record<string, any> = {
  Sunny: 'sunny',
  Cloudy: 'cloudy',
  Rainy: 'rain',
  Snowy: 'snow',
};

export default function HomeScreen() {
  const router = useRouter();
  const items = useClosetStore((state) => state.items);
  const savedOutfits = useClosetStore((state) => state.savedOutfits);
  const lastWornOutfit = useClosetStore((state) => state.lastWornOutfit);
  const { weather, recommendation, isLoading } = useRecommendation();
  
  const { isLoggedIn, user } = useAuthStore();
  const getUnreadCount = useNotificationStore(state => state.getUnreadCount);
  
  const [cardHeight, setCardHeight] = React.useState(0);
  
  // Animation Values
  const cardScale = useSharedValue(1);
  const fillProgress = useSharedValue(1); // 1 = hidden at bottom

  // Trigger animation when outfit is selected
  React.useEffect(() => {
    if (lastWornOutfit) {
      // Animation Reset
      fillProgress.value = 1; 
      
      // Bounce scale
      cardScale.value = withSequence(
        withSpring(1.05),
        withSpring(1)
      );
      // Wave fill up from bottom
      fillProgress.value = withDelay(500, withTiming(0, { // 1.0(바닥) -> 0.0(기준점)
        duration: 2500,
        easing: Easing.out(Easing.poly(4))
      }));
    }
  }, [lastWornOutfit?.timestamp]);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
    };
  });

  const recentItems = items.slice(0, 5); // 최근 5개만 표시

  const handleCameraOpen = () => {
    if (!isLoggedIn) {
      router.push('/(modals)/login-modal');
      return;
    }
    router.push('/(modals)/camera');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Background - 루트 View 직접 자식으로 배치 */}
      <AnimatedMeshGradient variant="home" />

      {/* PWA 설치 배너 (웹 전용) */}
      <InstallBanner />
      
      {/* Content - 인라인 style로 투명 배경 강제 */}
      <Screen 
        className="flex-1" 
        withPadding={false}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }}
      >
        <ScrollView 
          className="flex-1" 
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingBottom: 100, backgroundColor: 'transparent' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="px-6 pt-4 pb-6 bg-transparent">
            {/* Top Bar: Logo & Bell */}
            <View className="flex-row justify-between items-center mb-6">
              <AnimatedLogo />
              <TouchableOpacity 
                onPress={() => router.push('/notifications' as any)}
                className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-neutral-100 relative"
              >
              <Ionicons name="notifications-outline" size={22} color={neutral[800]} />
              {/* unread count badge */}
              {getUnreadCount() > 0 && (
                <View className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border border-white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View>
            <Text className="text-neutral-500 text-body-md mb-1">
              {isLoggedIn ? '오늘도 멋지게,' : '환영합니다,'}
            </Text>
            <Text className="text-neutral-900 text-headline-sm font-bold mb-3">
              안녕하세요 {isLoggedIn ? user?.name : '게스트'}님!
            </Text>
          </View>

          {/* Main Card (OOTD Recommendation) */}
          <Animated.View style={animatedCardStyle}>
            <View 
              onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
              className="w-full bg-primary-50 rounded-3xl p-6 relative overflow-hidden shadow-sm"
            >
              {/* Wave Background Layer */}
              <WaveEffect 
                progress={fillProgress} 
                isActive={!!lastWornOutfit} 
                cardHeight={cardHeight} 
              />
              
              {/* Background Decorative Circle */}
              <View className="absolute -right-10 -top-10 w-40 h-40 bg-primary-100 rounded-full opacity-50" />
            
            <View className="flex-row justify-between items-start mb-4">
              <View className={`${lastWornOutfit ? 'bg-primary-500' : 'bg-white'} px-3 py-1 rounded-full flex-row items-center`}>
                {lastWornOutfit && <Ionicons name="checkmark-circle" size={14} color="white" style={{ marginRight: 4 }} />}
                <Text className={`${lastWornOutfit ? 'text-white' : 'text-primary-600'} text-label-sm font-bold`}>
                  {lastWornOutfit ? 'Outfit Selected' : "Today's Pick"}
                </Text>
              </View>
              <Ionicons 
                name={weather ? WEATHER_ICONS[weather.condition] : 'sunny'} 
                size={24} 
                color={lastWornOutfit ? 'white' : primary[500]} 
              />
            </View>
            
            <Text className={`${lastWornOutfit ? 'text-primary-900' : 'text-primary-900'} text-title-lg font-bold mb-2`}>
              {lastWornOutfit ? (
                "오늘의 코디가 선택되었습니다!\n멋진 하루 보내세요 ✨"
              ) : recommendation ? (
                recommendation.message
              ) : weather ? (
                `${weather.temp}°C ${weather.condition === 'Sunny' ? '☀️ 맑음' : weather.condition === 'Cloudy' ? '☁️ 흐림' : weather.condition === 'Rainy' ? '🌧️ 비' : '❄️ 눈'}`
              ) : (
                "날씨 정보를 가져오는 중..."
              )}
            </Text>

            {recommendation && (
              <View className="flex-row items-center gap-4 mb-6">
                <View className="flex-1">
                  <View className="flex-row gap-3 mb-4">
                    {recommendation.items.map((item: any, idx) => (
                      <View 
                        key={item.id} 
                        className={`w-14 h-14 bg-white rounded-xl overflow-hidden border ${item.isPlaceholder ? 'border-dashed border-primary-200' : 'border-primary-100'} items-center justify-center relative`}
                      >
                        {item.isPlaceholder ? (
                          <View className="items-center justify-center">
                            <Ionicons name="cart-outline" size={20} color={primary[200]} />
                            <View className="absolute -top-1 -right-1 bg-primary-500 px-1 rounded-sm">
                              <Text className="text-[8px] text-white font-bold">BUY</Text>
                            </View>
                          </View>
                        ) : item.image ? (
                          <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} className="w-full h-full" resizeMode="cover" />
                        ) : (
                          <Ionicons name="shirt-outline" size={20} color={primary[200]} />
                        )}
                        <View className="absolute bottom-0 w-full bg-black/5 py-0.5">
                          <Text className="text-[8px] text-center text-neutral-500 font-bold uppercase">{item.category}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {recommendation.tags.map(tag => (
                      <View key={tag} className="bg-primary-100/50 px-2.5 py-1 rounded-lg border border-primary-100">
                        <Text className="text-primary-700 text-caption font-bold">#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {!recommendation && !isLoading && (
              <Text className="text-primary-700 text-body-sm mb-6">
                오늘 기온에 맞는 추천 코디가 없습니다.{"\n"}옷장을 더 채워보시는 건 어떨까요?
              </Text>
            )}

            <TouchableOpacity 
              onPress={() => {
                if (!isLoggedIn) {
                  router.push('/(modals)/login-modal');
                  return;
                }
                if (recommendation) {
                   const ids = recommendation.items.map((i: any) => i.id).join(',');
                   router.push({
                      pathname: '/ootd-detail',
                      params: { 
                         itemIds: ids,
                         temp: weather?.temp.toString(),
                         condition: weather?.condition
                      }
                   });
                }
              }}
              className="bg-primary-500 py-3 px-6 rounded-xl self-start"
            >
              <Text className="text-white text-label-lg font-medium">코디 상세 보기</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        </View>

        {/* Stats Row */}
        <View className="px-6 mb-8">
          <Text className="text-neutral-900 text-title-md font-bold mb-4">나의 옷장 현황</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/closet')}
              className="flex-1 bg-neutral-50 p-4 rounded-2xl border border-neutral-100"
            >
              <View className="w-8 h-8 bg-secondary-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="shirt-outline" size={16} color={secondary[500] || '#FF5722'} />
              </View>
              <Text className="text-neutral-500 text-label-md mb-1">전체 의류</Text>
              <Text className="text-neutral-900 text-title-lg font-bold">{items.length}<Text className="text-body-sm font-normal text-neutral-500">벌</Text></Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push('/saved-outfits')}
              className="flex-1 bg-neutral-50 p-4 rounded-2xl border border-neutral-100"
            >
              <View className="w-8 h-8 bg-tertiary-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="albums-outline" size={16} color={tertiary[500] || '#009688'} />
              </View>
              <Text className="text-neutral-500 text-label-md mb-1">저장된 코디</Text>
              <Text className="text-neutral-900 text-title-lg font-bold">{savedOutfits.length}<Text className="text-body-sm font-normal text-neutral-500">개</Text></Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Items Section */}
        <View className="mb-8">
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-neutral-900 text-title-md font-bold">최근 등록한 옷</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/closet')}>
              <Text className="text-neutral-400 text-body-sm">더보기</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
            {/* Real Items from Store */}
            {recentItems.map((item: any) => (
              <View key={item.id} className="w-32">
                <View className="w-32 h-40 bg-neutral-100 rounded-2xl mb-2 overflow-hidden">
                   {item.image ? (
                     <Image 
                       source={item.image} 
                       className="w-full h-full" 
                       resizeMode="cover" 
                     />
                   ) : (
                     <View className="w-full h-full items-center justify-center">
                       <Ionicons name="shirt" size={32} color={neutral[300]} />
                     </View>
                   )}
                </View>
                <Text className="text-neutral-900 text-body-sm font-medium truncate" numberOfLines={1}>{item.subCategory || item.category}</Text>
                <Text className="text-neutral-500 text-label-sm">{item.category}</Text>
              </View>
            ))}
            
            {/* Add New Item Button */}
            <TouchableOpacity 
              onPress={handleCameraOpen}
              className="w-32 h-40 border-2 border-dashed border-neutral-200 rounded-2xl items-center justify-center bg-neutral-50"
            >
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-2">
                <Ionicons name="add" size={24} color={primary[500]} />
              </View>
              <Text className="text-neutral-400 text-label-sm">새 의류 등록</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="px-6">
           <View className="bg-neutral-900 rounded-2xl p-5 flex-row items-center justify-between">
              <View>
                 <Text className="text-white text-title-md font-bold mb-1">코디 고민 해결!</Text>
                 <Text className="text-neutral-400 text-body-sm">AI에게 오늘의 옷 추천받기</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(modals)/ai-recommendation' as any)}
                className="bg-white px-4 py-2 rounded-lg"
              >
                 <Text className="text-neutral-900 text-label-md font-bold">Start AI</Text>
              </TouchableOpacity>
           </View>
        </View>

      </ScrollView>
      
      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleCameraOpen} />
    </Screen>
  </View>
  );
}
