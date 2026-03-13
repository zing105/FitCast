import { UIClothItem } from '@/store/closetStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

interface OutfitRecommendationResponse {
  message: string;
  outfitIds: string[];
}

/**
 * 옷장 데이터와 설문 결과를 바탕으로 Gemini API에 코디 추천을 요청합니다.
 */
export async function getOutfitRecommendation(
  closetItems: UIClothItem[],
  mood: string,
  colorTone: string,
  schedule: string
): Promise<OutfitRecommendationResponse> {
  if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  }

  // AI가 이해할 수 있도록 옷장 데이터를 간소화 (아이디, 분류, 색상 등 핵심만 전달)
  const simplifiedCloset = closetItems.map(item => ({
    id: item.id,
    category: item.category,
    subCategory: item.subCategory,
    color: item.color,
    pattern: item.pattern,
    brand: item.brand,
  }));

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json', // 강제로 JSON 형태로 응답받기
      temperature: 0.7, // 약간의 창의성 부여
    },
  });

  const prompt = `
    너는 전문 퍼스널 스타일리스트야.
    
    [고객 상황]
    기분: "${mood}"
    선호 컬러: "${colorTone}"
    오늘의 스케줄: "${schedule}"

    [고객의 옷장 목록]
    ${JSON.stringify(simplifiedCloset, null, 2)}

    고객의 상황과 옷장 목록을 분석해서, 오늘 입기 딱 좋은 최고의 코디 조합(아우터 0~1개, 상의 1개, 하의 1개)을 골라줘.
    옷장에 상의나 하의 등 필수 아이템이 부족하다면, 가지고 있는 것들로 최대한 어울리게 조합해줘.
    같은 카테고리(예: 상의 2개)를 중복해서 고르지 마.
    옷장에 없는 아이템 ID를 만들어내지 마. 무조건 제공된 목록의 'id' 값만 사용해.

    반드시 아래 JSON 스키마 형식으로 응답해줘:
    {
      "message": "고객에게 건네는 스타일링 팁과 추천 이유 (친절하고 트렌디한 어투로 2~3문장)",
      "outfitIds": ["추천하는 옷의 id 배열"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as OutfitRecommendationResponse;
  } catch (error) {
    console.error('Gemini API 호출 에러:', error);
    throw new Error('코디 추천을 가져오는 중 오류가 발생했습니다.');
  }
}

export interface ClothAnalysisResponse {
  category: 'top' | 'bottom' | 'outer' | 'dress' | 'shoes' | 'accessory' | 'etc';
  sub_category: string;
  color: string;
  pattern: string;
  material: string;
  season: string[];
}

/**
 * 옷 사진(Base64)을 분석하여 카테고리, 색상, 재질 등의 태그를 자동 추출합니다.
 */
export async function analyzeClothImage(base64Image: string): Promise<ClothAnalysisResponse> {
  if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2, // 분석의 정확도를 위해 낮게 설정
    },
  });

  const prompt = `
    다음 옷 이미지를 분석해서 JSON 형식으로만 완벽하게 응답해.
    1. category: "top", "bottom", "outer", "dress", "shoes", "accessory", "etc" 중 가장 알맞은 것 택 1.
    2. sub_category: (예: 반팔 티셔츠, 청바지, 가디건, 스니커즈 등 한국어로 짧게 명사형으로)
    3. color: (주요 색상 1~2개 한국어로, 예: 네이비, 화이트)
    4. pattern: (무지, 스트라이프, 체크, 플로럴, 그래픽, 도트 등 한국어로)
    5. material: (면, 데님, 니트, 린넨, 가죽, 폴리에스테르, 나일론 등 옷감 재질 한국어로)
    6. season: ("봄", "여름", "가을", "겨울" 중 해당하는 계절들의 배열 형식)

    결과는 반드시 아래 JSON 키워드를 가진 객체 형식으로만 줘:
    {
      "category": "top",
      "sub_category": "반팔 셔츠",
      "color": "파란색",
      "pattern": "스트라이프",
      "material": "면",
      "season": ["봄", "여름"]
    }
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg' // 카메라/갤러리 이미지는 주로 jpeg/png
        }
      }
    ]);
    const text = result.response.text();
    return JSON.parse(text) as ClothAnalysisResponse;
  } catch (error) {
    console.error('Gemini Vision API 호출 에러:', error);
    throw new Error('이미지 분석 중 오류가 발생했습니다.');
  }
}
