/**
 * Supabase Client Initialization
 * 데이터 연동 및 인증을 위한 최상위 클라이언트 설정
 * AsyncStorage를 사용하여 세션을 영구 저장 (새로고침/앱 재시작 후에도 로그인 유지)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Dashboard -> Project Settings -> API 에서 확인 가능합니다.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        // 네이티브에서는 AsyncStorage, 웹에서는 localStorage를 사용
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,       // JWT 토큰 자동 갱신
        persistSession: true,         // 세션을 저장소에 영구 보관
        detectSessionInUrl: Platform.OS === 'web',  // 웹에서만 URL의 세션 파라미터 감지
    },
});
