import { supabase } from '@/utils/supabase';
import { create } from 'zustand';

// 코디 데이터 타입 정의
export interface Outfit {
    id: string;
    itemIds: string[];
    timestamp: number;
    name?: string;
}

// 의류 아이템 타입 정의 (DB 스키마)
export interface ClothItem {
    id: string;
    image_url: string; // DB 컬럼명 매칭
    category: string;
    sub_category: string | null;
    brand?: string;
    color?: string;
    pattern?: string;
    material?: string;
    season?: string[];
    created_at?: string;
}

// UI 컴포넌트 호환성을 위한 구버전 매핑
export interface UIClothItem extends Omit<ClothItem, 'image_url' | 'sub_category' | 'created_at'> {
    image: { uri: string };
    subCategory: string;
    createdAt: number;
}

// Store 상태 정의
interface ClosetState {
    items: UIClothItem[];
    savedOutfits: Outfit[];
    lastWornOutfit: { ids: string[]; timestamp: number } | null;
    isLoading: boolean;

    // 비동기 액션
    fetchItems: (userId: string) => Promise<void>;
    addItem: (itemData: Omit<ClothItem, 'id' | 'created_at' | 'user_id'>, userId: string) => Promise<void>;
    removeItem: (id: string, userId: string) => Promise<void>;
    setLastWornOutfit: (ids: string[]) => void;
    saveOutfit: (itemIds: string[], name?: string) => void;
    removeOutfit: (id: string) => void;
    clearItems: () => void; // 로그아웃 시 옷장 데이터 초기화
}

// DB 모델을 UI 모델로 변환 (기존 컴포넌트 안 깨지게)
const mapDBToUI = (dbItem: ClothItem): UIClothItem => ({
    ...dbItem,
    image: { uri: dbItem.image_url },
    subCategory: dbItem.sub_category || '기타',
    createdAt: dbItem.created_at ? new Date(dbItem.created_at).getTime() : Date.now(),
});

export const useClosetStore = create<ClosetState>((set, get) => ({
    items: [],
    savedOutfits: [],
    lastWornOutfit: null,
    isLoading: false,

    // 내 옷장 불러오기 (Supabase SELECT)
    fetchItems: async (userId: string) => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('clothes')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                // UI용 데이터 스펙으로 변환해서 저장
                set({ items: data.map(mapDBToUI) });
            }
        } catch (error) {
            console.error('옷 데이터를 불러오는 데 실패했습니다:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // 🌟 새로운 옷 추가 (DB INSERT) -> 이후 다시 fetch
    addItem: async (itemData, userId) => {
        set({ isLoading: true });
        try {
            const dbPayload = {
                ...itemData,
                user_id: userId,
            };

            const { error } = await supabase
                .from('clothes')
                .insert([dbPayload]);

            if (error) throw error;

            // 추가 후 내 옷장 최신화
            await get().fetchItems(userId);

        } catch (error) {
            console.error('옷 저장 실패:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // 서버에서 옷 삭제
    removeItem: async (id, userId) => {
        try {
            const { error } = await supabase
                .from('clothes')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;

            // 로컬 상태 즉시 반영 (낙관적 업데이트)
            set((state) => ({
                items: state.items.filter((item) => item.id !== id),
            }));
        } catch (error) {
            console.error('옷 삭제 실패:', error);
        }
    },

    setLastWornOutfit: (ids) => set({
        lastWornOutfit: { ids, timestamp: Date.now() }
    }),

    saveOutfit: (itemIds, name) => set((state) => ({
        savedOutfits: [
            {
                id: Math.random().toString(36).substr(2, 9), // TODO: 코디도 DB 연결 필요
                itemIds,
                name,
                timestamp: Date.now(),
            },
            ...state.savedOutfits,
        ],
    })),

    removeOutfit: (id) => set((state) => ({
        savedOutfits: state.savedOutfits.filter((o) => o.id !== id),
    })),

    // 로그아웃 시 옷장 데이터 전부 초기화
    clearItems: () => set({
        items: [],
        savedOutfits: [],
        lastWornOutfit: null,
    }),
}));
