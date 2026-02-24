/**
 * Supabase Client Initialization
 * 데이터 연동 및 인증을 위한 최상위 클라이언트 설정
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// Dashboard -> Project Settings -> API 에서 확인 가능합니다.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Expo Web의 Static Rendering 단계(Node.js)에서는 window 객체가 없어서 에러가 발생합니다.
// 이를 방지하기 위한 Custom Storage Adapter 생성
const customAsyncStorage = {
    getItem: (key: string) => {
        if (typeof window === 'undefined') return Promise.resolve(null);
        return AsyncStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') return Promise.resolve();
        return AsyncStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        if (typeof window === 'undefined') return Promise.resolve();
        return AsyncStorage.removeItem(key);
    },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: customAsyncStorage, // 안전한 Custom Storage 사용
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Expo Web/React Native 특성상 false
    },
});

// AppState 변경 시 세션 자동 리프레시 처리
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});
