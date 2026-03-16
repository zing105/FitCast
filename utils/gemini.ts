import { UIClothItem } from '@/store/closetStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

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

/**
 * 옷장 데이터와 설문 결과를 바탕으로 Gemini API에 코디 추천을 요청합니다.
 */
export async function getOutfitRecommendation(
  closetItems: UIClothItem[],
  gender: string,
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
    너는 하이엔드 패션 매거진의 수석 에디터이자 VIP 프라이빗 스타일리스트야.
    
    [고객 상황]
    성별: "${gender}"
    기분: "${mood}"
    선호 컬러: "${colorTone}"
    오늘의 스케줄: "${schedule}"

    [고객의 옷장 데이터베이스]
    ${JSON.stringify(simplifiedCloset, null, 2)}

    고객의 성별과 상황, 옷장 목록을 분석해서 오늘 입기 딱 좋은 가장 세련되고 감각적인 코디 조합(아우터 0~1개, 상의 1개, 하의 1개)을 골라줘.

    [주의사항]
    1. 반드시 선택된 성별("${gender}")에 어울리는 스타일링을 제안해.
    2. 만약 고객의 옷장이 비어있거나, 지금 상황에 어울리는 적절한 조합을 옷장에서 도저히 찾을 수 없을 경우에는 억지로 맞추지 마.
    3. 옷장에서 찾지 못했다면 대신 'suggestedPurchases' 필드를 사용해서 고객의 성별에 맞는 추천할 만한 2~3가지 핵심 아이템을 제안해줘.
    4. 옷장에 있는 아이템을 쓸 때는 무조건 제공된 목록의 'id' 값만 사용해. 존재하지 않는 ID를 지어내지 마.

    반드시 아래 JSON 스키마 형식 중 하나로 응답해줘:
    
    매칭이 성공했을 때:
    {
      "message": "세련된 에디터 말투로 코디 추천 이유 2~3문장",
      "outfitIds": ["아이템1_id", "아이템2_id"]
    }

    매칭 실패하여 쇼핑을 추천할 때:
    {
      "message": "옷장 아이템으로는 부족하지만, 이런 아이템을 매칭하면 완벽할 것 같아 제안하는 메시지",
      "suggestedPurchases": [
        { 
          "item": "아이템 이름", 
          "reason": "추천 이유", 
          "searchKeyword": "쇼핑몰 검색에 사용할 정확한 성별이 포함된 키워드 (예: ${gender === '남성' ? '남성용 블랙 슬랙스' : '여성용 트위드 자켓'})" 
        }
      ]
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

/**
 * 이미지(Base64)를 분석하여 스타일 스크랩 태그 및 설명을 생성합니다.
 */
export async function analyzeStyleScrap(base64Image: string): Promise<StyleScrapAnalysis> {
  if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  });

  const prompt = `
    이 패션 영감 이미지를 분석해서 다음 정보를 JSON 형식으로 제공해줘:
    1. tags: 3~5개의 스타일 태그 (예: #미니멀, #스트릿, #빈티지, #캐주얼, #포멀 등 한국어로)
    2. description: 전체적인 스타일에 대한 한 줄 요약 설명 (한국어로)

    응답 형식:
    {
      "tags": ["#태그1", "#태그2", ...],
      "description": "스타일 설명 한 줄"
    }
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text) as StyleScrapAnalysis;
  } catch (error) {
    console.error('Style Scrap AI Analysis Error:', error);
    return {
      tags: ['#패션', '#영감'],
      description: 'AI 분석 중 오류가 발생했습니다.'
    };
  }
}

