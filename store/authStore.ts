/**
 * Auth Store
 * 사용자 인증 상태(로그인 여부, 프로필 정보)를 관리하는 스토어
 * Supabase Auth의 onAuthStateChange 리스너와 연동되어 세션 자동 관리
 */
import { supabase } from '@/utils/supabase';
import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    clearAuth: () => void; // 내부용: signOut 없이 상태만 초기화
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    user: null,
    isLoading: true, // 초기값: 세션 확인 중

    // Supabase Auth 세션이 확인되면 호출
    login: (userData) => set({
        isLoggedIn: true,
        user: userData,
        isLoading: false,
    }),

    // 사용자가 직접 로그아웃 버튼을 눌렀을 때
    logout: async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Supabase signOut 에러:', error);
        }
        set({
            isLoggedIn: false,
            user: null,
            isLoading: false,
        });
    },

    // 내부용: onAuthStateChange에서 세션 없음 감지 시 (signOut 호출 없이 상태만 정리)
    clearAuth: () => set({
        isLoggedIn: false,
        user: null,
        isLoading: false,
    }),
}));
