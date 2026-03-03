/**
 * Auth Store
 * 사용자 인증 상태(로그인 여부, 프로필 정보)를 관리하는 스토어
 * Supabase Auth 세션과 연동하여 새로고침/앱 재시작 후에도 로그인 유지
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
    isLoading: boolean; // 세션 복원 중 로딩 상태
    login: (userData: User) => void;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    user: null,
    isLoading: true, // 초기값: 세션 확인 중

    // 로그인 성공 후 호출 (Supabase Auth 완료 후)
    login: (userData) => set({
        isLoggedIn: true,
        user: userData,
        isLoading: false,
    }),

    // 로그아웃: Supabase 세션도 함께 파기
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

    // 앱 시작 시 저장된 세션 복원
    restoreSession: async () => {
        try {
            set({ isLoading: true });
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('세션 복원 에러:', error);
                set({ isLoggedIn: false, user: null, isLoading: false });
                return;
            }

            if (session?.user) {
                const user = session.user;
                set({
                    isLoggedIn: true,
                    user: {
                        id: user.id,
                        email: user.email || '',
                        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
                        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                    },
                    isLoading: false,
                });
                console.log('✅ 세션 복원 성공:', user.email);
            } else {
                console.log('ℹ️ 저장된 세션 없음 (로그아웃 상태)');
                set({ isLoggedIn: false, user: null, isLoading: false });
            }
        } catch (error) {
            console.error('세션 복원 중 예외:', error);
            set({ isLoggedIn: false, user: null, isLoading: false });
        }
    },
}));
