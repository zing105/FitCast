import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. JWT 인증 검증
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

    // 2. 요청 본문에서 base64 이미지 추출
    const { base64Image } = await req.json();
    if (!base64Image) {
      return new Response(JSON.stringify({ error: "이미지 데이터가 필요합니다." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Gemini API 호출 (서버 측 API 키 사용)
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
        temperature: 0.2,
      },
    });

    const prompt = `
      다음 옷 이미지를 분석해서 JSON 형식으로만 완벽하게 응답해.
      1. category: "top", "bottom", "outer", "dress", "shoes", "accessory", "etc" 중 가장 알맞은 것 택 1.
      2. sub_category: (예: 반팔 티셔츠, 청바지, 가디건, 스니커즈 등 한국어로 짧게 명사형으로)
      3. color: (주요 색상 1~2개 한국어로, 예: 네이비, 화이트)
      4. color_hex: (추출한 주요 색상을 나타내는 대표적인 HEX CODE 형식. 반드시 #포함 6자리 소문자로, 예: #000080, #ffffff)
      5. pattern: (무지, 스트라이프, 체크, 플로럴, 그래픽, 도트 등 한국어로)
      6. material: (면, 데님, 니트, 린넨, 가죽, 폴리에스테르, 나일론 등 옷감 재질 한국어로)
      7. season: ("봄", "여름", "가을", "겨울" 중 해당하는 계절들의 배열 형식)

      결과는 반드시 아래 JSON 키워드를 가진 객체 형식으로만 줘:
      {
        "category": "top",
        "sub_category": "반팔 셔츠",
        "color": "파란색",
        "color_hex": "#0000ff",
        "pattern": "스트라이프",
        "material": "면",
        "season": ["봄", "여름"]
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
    ]);

    const text = result.response.text();
    const analysisResult = JSON.parse(text);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-cloth error:", error);
    return new Response(JSON.stringify({ error: "이미지 분석 중 오류가 발생했습니다." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
