/**
 * Closet Store
 * 옷장 데이터를 전역적으로 관리하는 Zustand Store
 */
import { create } from 'zustand';

// 코디 데이터 타입 정의
export interface Outfit {
    id: string;
    itemIds: string[];
    timestamp: number;
    name?: string;
}

// 의류 아이템 타입 정의
export interface ClothItem {
    id: string;
    image: any;
    category: string;
    subCategory: string;
    brand?: string;
    color?: string;
    pattern?: string;
    material?: string;
    season?: string[];
    createdAt: number;
}

// Store 상태 정의
interface ClosetState {
    items: ClothItem[];
    savedOutfits: Outfit[];
    lastWornOutfit: { ids: string[]; timestamp: number } | null;
    addItem: (item: Omit<ClothItem, 'id' | 'createdAt'>) => void;
    removeItem: (id: string) => void;
    setLastWornOutfit: (ids: string[]) => void;
    saveOutfit: (itemIds: string[], name?: string) => void;
    removeOutfit: (id: string) => void;
}

// 초기 Mock Data (Gemini Banana 에셋 포함)
const INITIAL_ITEMS: ClothItem[] = [
    {
        id: '1',
        image: require('@/assets/images/clothes/banana_tshirt.png'),
        category: 'top',
        subCategory: 'T-Shirt',
        brand: 'Gemini Banana',
        color: 'White',
        createdAt: Date.now() - 100000
    },
    {
        id: '2',
        image: require('@/assets/images/clothes/banana_hoodie.png'),
        category: 'outer',
        subCategory: 'Hoodie',
        brand: 'Gemini Banana',
        color: 'Navy',
        createdAt: Date.now() - 200000
    },
    {
        id: '3',
        image: require('@/assets/images/clothes/banana_cap.png'),
        category: 'acc',
        subCategory: 'Cap',
        brand: 'Gemini Banana',
        color: 'Black',
        createdAt: Date.now() - 300000
    },
    {
        id: '4',
        image: { uri: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80' },
        category: 'bottom',
        subCategory: 'Blue Jeans',
        brand: 'Levis',
        color: 'Blue',
        createdAt: Date.now() - 400000
    },
];

export const useClosetStore = create<ClosetState>((set) => ({
    items: INITIAL_ITEMS,
    savedOutfits: [],
    lastWornOutfit: null,

    addItem: (newItem) => set((state) => ({
        items: [
            {
                ...newItem,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: Date.now(),
            },
            ...state.items,
        ],
    })),

    removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
    })),

    setLastWornOutfit: (ids) => set({
        lastWornOutfit: { ids, timestamp: Date.now() }
    }),

    saveOutfit: (itemIds, name) => set((state) => ({
        savedOutfits: [
            {
                id: Math.random().toString(36).substr(2, 9),
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
}));
