/**
 * Auth Store
 * 사용자 인증 상태(로그인 여부, 프로필 정보)를 관리하는 스토어
 */
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
    login: (userData: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false, // 초기값은 로그아웃 상태
    user: null,

    // 실제 구글 로그인 성공 후 호출될 함수
    login: (userData) => set({
        isLoggedIn: true,
        user: userData,
    }),

    logout: () => set({
        isLoggedIn: false,
        user: null,
    }),
}));
