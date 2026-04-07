/**
 * Gemini AI 프록시 클라이언트
 * 모든 AI 호출은 Supabase Edge Function을 통해 서버에서 처리됩니다.
 * Gemini API 키는 클라이언트에 노출되지 않습니다.
 */
import { UIClothItem } from '@/store/closetStore';
import { supabase } from './supabase';

export interface SuggestedPurchase {
  item: string;
  reason: string;
  searchKeyword: string;
}

export interface StyleScrapAnalysis {
  tags: string[];
  description: string;
}

export interface OutfitRecommendationResponse {
  message: string;
  outfitIds?: string[];
  suggestedPurchases?: SuggestedPurchase[];
}

export interface ClothAnalysisResponse {
  category: 'top' | 'bottom' | 'outer' | 'dress' | 'shoes' | 'accessory' | 'etc';
  sub_category: string;
  color: string;
  color_hex: string;
  pattern: string;
  material: string;
  season: string[];
}

/**
 * 옷장 데이터와 설문 결과를 바탕으로 AI 코디 추천을 요청합니다.
 * (서버 프록시: Supabase Edge Function → Gemini API)
 */
export async function getOutfitRecommendation(
  closetItems: UIClothItem[],
  gender: string,
  mood: string,
  colorTone: string,
  schedule: string
): Promise<OutfitRecommendationResponse> {
  const { data, error } = await supabase.functions.invoke('recommend-outfit', {
    body: { closetItems, gender, mood, colorTone, schedule },
  });

  if (error) {
    console.error('Edge Function 호출 에러:', error);
    throw new Error('코디 추천을 가져오는 중 오류가 발생했습니다.');
  }

  return data as OutfitRecommendationResponse;
}

/**
 * 옷 사진(Base64)을 분석하여 카테고리, 색상, 재질 등의 태그를 자동 추출합니다.
 * (서버 프록시: Supabase Edge Function → Gemini API)
 */
export async function analyzeClothImage(base64Image: string): Promise<ClothAnalysisResponse> {
  const { data, error } = await supabase.functions.invoke('analyze-cloth', {
    body: { base64Image },
  });

  if (error) {
    console.error('Edge Function 호출 에러:', error);
    throw new Error('이미지 분석 중 오류가 발생했습니다.');
  }

  return data as ClothAnalysisResponse;
}

/**
 * 이미지(Base64)를 분석하여 스타일 스크랩 태그 및 설명을 생성합니다.
 * (서버 프록시: Supabase Edge Function → Gemini API)
 */
export async function analyzeStyleScrap(base64Image: string): Promise<StyleScrapAnalysis> {
  const { data, error } = await supabase.functions.invoke('analyze-style', {
    body: { base64Image },
  });

  if (error) {
    console.error('Edge Function 호출 에러:', error);
    return {
      tags: ['#패션', '#영감'],
      description: 'AI 분석 중 오류가 발생했습니다.'
    };
  }

  return data as StyleScrapAnalysis;
}
