-- 1. 'clothes' (옷) 테이블 생성
CREATE TABLE clothes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  brand TEXT,
  color TEXT,
  pattern TEXT,
  material TEXT,
  season TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 보안 규칙(RLS) 활성화
ALTER TABLE clothes ENABLE ROW LEVEL SECURITY;

-- 누구나 볼 수 있는 게 아니라 '로그인한 본인의 옷'만 조회(SELECT) 가능
CREATE POLICY "Users can view their own clothes" 
ON clothes FOR SELECT USING (auth.uid() = user_id);

-- '로그인한 본인의 옷'만 추가(INSERT) 가능
CREATE POLICY "Users can insert their own clothes" 
ON clothes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- '로그인한 본인의 옷'만 삭재(DELETE) 가능
CREATE POLICY "Users can delete their own clothes" 
ON clothes FOR DELETE USING (auth.uid() = user_id);

-- '로그인한 본인의 옷'만 수정(UPDATE) 가능
CREATE POLICY "Users can update their own clothes" 
ON clothes FOR UPDATE USING (auth.uid() = user_id);


-- 2. 'outfits' (코디) 테이블 생성
CREATE TABLE outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_ids UUID[] NOT NULL, -- 옷 id들의 배열
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 보안 규칙(RLS) 활성화
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

-- 코디 테이블에 대한 본인 확인 정책 (CRUD)
CREATE POLICY "Users can view their own outfits" 
ON outfits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outfits" 
ON outfits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits" 
ON outfits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits" 
ON outfits FOR UPDATE USING (auth.uid() = user_id);
-- 3. 'style_scraps' (스타일 스크랩) 테이블 생성
CREATE TABLE style_scraps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 보안 규칙(RLS) 활성화
ALTER TABLE style_scraps ENABLE ROW LEVEL SECURITY;

-- 본인 것만 CRUD 가능하게 설정
CREATE POLICY "Users can view their own style_scraps" 
ON style_scraps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own style_scraps" 
ON style_scraps FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own style_scraps" 
ON style_scraps FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own style_scraps" 
ON style_scraps FOR UPDATE USING (auth.uid() = user_id);
