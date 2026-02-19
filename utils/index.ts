/**
 * Utility Functions
 * 앱에서 사용하는 유틸리티 함수 모음
 */

/**
 * 날짜를 한국어 형식으로 포맷
 * @param date - Date 객체 또는 ISO 문자열
 * @returns 포맷된 날짜 문자열 (예: "2024년 1월 15일")
 */
export function formatDateKorean(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/**
 * 컬러 HEX를 RGB 배열로 변환
 * @param hex - HEX 컬러 코드 (예: "#FF5722")
 * @returns RGB 배열 [R, G, B]
 */
export function hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
        ]
        : null;
}

/**
 * 밀리초를 일/시간/분 형태로 변환
 * @param ms - 밀리초
 * @returns 사람이 읽기 쉬운 시간 문자열
 */
export function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
}

/**
 * 의류 카테고리 ID를 한국어 이름으로 변환
 * @param categoryId - 카테고리 ID
 * @returns 카테고리 한국어 이름
 */
export function getCategoryName(categoryId: string): string {
    const names: Record<string, string> = {
        top: '상의',
        bottom: '하의',
        outer: '아우터',
        shoes: '신발',
        accessory: '액세서리',
        bag: '가방',
    };
    return names[categoryId] || '기타';
}

// TODO: AI 이미지 분석 관련 유틸리티 함수 추가
// - analyzeImageWithAI: 이미지 분석 API 호출
// - extractDominantColor: 주요 색상 추출
// - classifyClothingType: 의류 종류 분류
// - suggestCareMethod: 케어 방법 추천
