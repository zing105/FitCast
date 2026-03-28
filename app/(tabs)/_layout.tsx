/**
 * Tab Navigation Layout
 * 메인 탭 내비게이션 설정 - 홈, 옷장, 마이페이지
 */
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View, Platform } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { neutral, primary, surface } from '@/design-tokens';

// 탭 바 아이콘 컴포넌트
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <View className="items-center justify-center">
      <Ionicons 
        size={24} 
        style={{ marginBottom: -3 }} 
        name={props.name} 
        color={props.color} 
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // 테마에 따른 색상 설정 (Light Mode 강제)
  const isDark = false; // colorScheme === 'dark';
  const activeColor = primary[500];
  const inactiveColor = neutral[500];
  const backgroundColor = surface.light.surface;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: backgroundColor,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: isDark ? '#fff' : '#000',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      {/* 홈 탭 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'home' : 'home-outline'} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      
      {/* 옷장 탭 */}
      <Tabs.Screen
        name="closet"
        options={{
          title: '옷장',
          headerTitle: '내 옷장',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'shirt' : 'shirt-outline'} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      
      {/* 마이페이지 탭 */}
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이',
          headerTitle: '마이페이지',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'person' : 'person-outline'} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
