import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "인증이 필요합니다." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "유효하지 않은 세션입니다." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { closetItems, gender, mood, colorTone, schedule } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "서버 설정 오류" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const simplifiedCloset = closetItems.map((item: any) => ({
      id: item.id,
      category: item.category,
      subCategory: item.subCategory,
      color: item.color,
      pattern: item.pattern,
      brand: item.brand,
    }));

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

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const recommendation = JSON.parse(text);

    return new Response(JSON.stringify(recommendation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("recommend-outfit error:", error);
    return new Response(JSON.stringify({ error: "코디 추천 중 오류가 발생했습니다." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
