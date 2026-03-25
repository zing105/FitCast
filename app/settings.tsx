import { Screen } from '@/components/ui/Screen';
import { neutral, primary } from '@/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_STORAGE_KEY = '@fitcast_settings';

export default function SettingsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    notifications: true,
    marketing: false,
    darkMode: false,
    autoSave: true,
  });

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    };
    saveSettings();
  }, [settings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSettingItem = (
    icon: React.ComponentProps<typeof Ionicons>['name'], 
    label: string, 
    value: boolean, 
    onToggle: () => void,
    description?: string,
    isLast = false
  ) => (
    <View className={`flex-row items-center py-4 px-6 bg-white ${!isLast ? 'border-b border-neutral-100' : ''}`}>
      <View className="w-10 h-10 bg-neutral-50 rounded-xl items-center justify-center mr-4">
        <Ionicons name={icon} size={22} color={neutral[600]} />
      </View>
      <View className="flex-1 mr-4">
        <Text className="text-neutral-900 text-body-md font-bold">{label}</Text>
        {description && (
          <Text className="text-neutral-400 text-caption mt-0.5">{description}</Text>
        )}
      </View>
      <Switch
        trackColor={{ false: neutral[200], true: primary[300] }}
        thumbColor={value ? primary[500] : '#f4f3f4'}
        ios_backgroundColor={neutral[200]}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <Screen className="bg-neutral-50" withPadding={false}>
      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View className="px-6 pt-6 pb-4 bg-white flex-row items-center border-b border-neutral-100">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-4 p-1"
        >
          <Ionicons name="arrow-back" size={24} color={neutral[900]} />
        </TouchableOpacity>
        <Text className="text-neutral-900 text-title-lg font-bold">설정</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="px-6 py-4 text-neutral-500 text-label-sm font-semibold uppercase tracking-wider">알림 설정</Text>
        <View className="bg-white border-y border-neutral-100">
          {renderSettingItem(
            "notifications-outline", 
            "푸시 알림", 
            settings.notifications, 
            () => toggleSetting('notifications'),
            "코디 추천 및 활동 알림을 받습니다."
          )}
          {renderSettingItem(
            "megaphone-outline", 
            "마케팅 정보 수신", 
            settings.marketing, 
            () => toggleSetting('marketing'),
            "이벤트 및 혜택 정보를 받습니다.",
            true
          )}
        </View>

        <Text className="px-6 py-4 text-neutral-500 text-label-sm font-semibold uppercase tracking-wider">앱 설정</Text>
        <View className="bg-white border-y border-neutral-100">
          {renderSettingItem(
            "moon-outline", 
            "다크 모드", 
            settings.darkMode, 
            () => toggleSetting('darkMode'),
            "시스템 설정과 관계없이 다크 모드를 사용합니다."
          )}
          {renderSettingItem(
            "cloud-upload-outline", 
            "자동 저장", 
            settings.autoSave, 
            () => toggleSetting('autoSave'),
            "코디 분석 결과를 자동으로 클라우드에 저장합니다.",
            true
          )}
        </View>

        <View className="py-10 items-center">
          <Text className="text-neutral-300 text-caption font-medium">FitCast v1.0.0 (Stable)</Text>
        </View>

        <View className="py-10 items-center">
          <Text className="text-neutral-300 text-caption font-medium">FitCast v1.0.0 (Stable)</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

