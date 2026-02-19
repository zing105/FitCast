/**
 * Constants
 * 앱 전역 상수 정의
 */

/** 앱 이름 */
export const APP_NAME = 'OOTD Archive';

/** 앱 버전 */
export const APP_VERSION = '1.0.0';

/** 의류 카테고리 */
export const CLOTHING_CATEGORIES = {
    top: { id: 'top', name: '상의', icon: 'shirt-outline' },
    bottom: { id: 'bottom', name: '하의', icon: 'man-outline' },
    outer: { id: 'outer', name: '아우터', icon: 'snow-outline' },
    shoes: { id: 'shoes', name: '신발', icon: 'footsteps-outline' },
    accessory: { id: 'accessory', name: '액세서리', icon: 'diamond-outline' },
    bag: { id: 'bag', name: '가방', icon: 'bag-handle-outline' },
} as const;

/** 의류 소재 목록 (AI 분석 결과용) */
export const CLOTHING_MATERIALS = [
    '면', '폴리에스터', '나일론', '레이온', '린넨',
    '울', '캐시미어', '실크', '데님', '가죽', '합성피혁',
] as const;

/** 세탁 방법 */
export const CARE_METHODS = {
    washable: { id: 'washable', name: '물세탁 가능', icon: 'water' },
    handWash: { id: 'handWash', name: '손세탁', icon: 'hand-left' },
    dryClean: { id: 'dryClean', name: '드라이클리닝', icon: 'storefront' },
    noWash: { id: 'noWash', name: '세탁 불가', icon: 'close-circle' },
} as const;

/** API 엔드포인트 (향후 백엔드 연동용) */
export const API = {
    // TODO: 실제 API 엔드포인트 설정
    BASE_URL: 'https://api.example.com',
    ANALYZE_IMAGE: '/analyze/image',
    GET_CARE_TIPS: '/care/tips',
} as const;
