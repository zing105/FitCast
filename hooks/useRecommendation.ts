/**
 * useRecommendation Hook
 * 날씨 정보(Mock)를 가져오고, 그에 맞는 옷차림을 추천하는 커스텀 훅
 */
import { ClothItem, useClosetStore } from '@/store/closetStore';
import { useEffect, useMemo, useState } from 'react';

interface WeatherInfo {
    temp: number;
    condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy';
    location: string;
}

// 기온별 추천 카테고리 설정
const TEMPERATURE_GUIDE = [
    { max: 4, categories: ['outer', 'top', 'bottom'], tags: ['패딩', '코트', '기모'] },
    { min: 5, max: 8, categories: ['outer', 'top', 'bottom'], tags: ['코트', '가죽자켓', '히트텍'] },
    { min: 9, max: 11, categories: ['outer', 'top', 'bottom'], tags: ['트렌치코트', '야상', '니트'] },
    { min: 12, max: 16, categories: ['outer', 'top', 'bottom'], tags: ['자켓', '가디건', '청자켓'] },
    { min: 17, max: 19, categories: ['top', 'bottom'], tags: ['니트', '가디건', '후드티'] },
    { min: 20, max: 22, categories: ['top', 'bottom'], tags: ['긴팔티', '가디건', '면바지'] },
    { min: 23, max: 27, categories: ['top', 'bottom'], tags: ['반팔', '얇은셔츠', '반바지'] },
    { min: 28, max: 100, categories: ['top', 'bottom'], tags: ['민소매', '반팔', '반바지'] },
];

export function useRecommendation() {
    const items = useClosetStore((state) => state.items);
    const [weather, setWeather] = useState<WeatherInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 1. 날씨 정보 가져오기 (Mock)
    useEffect(() => {
        // 실제로는 API 호출이 들어갈 자리
        const timer = setTimeout(() => {
            setWeather({
                temp: 18,
                condition: 'Sunny',
                location: 'Seoul',
            });
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // 2. 추천 로직 실행
    const recommendation = useMemo(() => {
        if (!weather || items.length === 0) return null;

        const currentGuide = TEMPERATURE_GUIDE.find(
            (g) => (g.min === undefined || weather.temp >= g.min) && (g.max === undefined || weather.temp <= g.max)
        );

        if (!currentGuide) return null;

        // 카테고리별로 아이템 필터링 후 랜덤 선택
        const getRecommendationBySection = (category: string) => {
            const filtered = items.filter((item) => item.category === category);
            if (filtered.length === 0) {
                // 아이템이 없는 경우 Placeholder 반환
                return {
                    id: `placeholder-${category}`,
                    category,
                    subCategory: `${category === 'top' ? '상의' : category === 'bottom' ? '하의' : '아우터'}가 필요해요`,
                    isPlaceholder: true,
                } as any;
            }
            return filtered[Math.floor(Math.random() * filtered.length)];
        };

        const top = getRecommendationBySection('top');
        const bottom = getRecommendationBySection('bottom');
        const outer = currentGuide.categories.includes('outer') ? getRecommendationBySection('outer') : null;

        const recommendationItems = [outer, top, bottom].filter((i): i is ClothItem & { isPlaceholder?: boolean } => i !== null);

        return {
            items: recommendationItems,
            tags: currentGuide.tags,
            message: `${weather.temp}°C, 활기찬 ${weather.condition === 'Sunny' ? '맑은' : '흐린'} 날이에요!`,
            hasPlaceholder: recommendationItems.some(i => i.isPlaceholder),
        };
    }, [weather, items]);

    return {
        weather,
        recommendation,
        isLoading,
        refresh: () => {
            // 강제 리렌더링을 위해 간단한 상태 변경 가능 (현재는 useMemo 의존성으로 충분)
        }
    };
}
