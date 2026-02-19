/**
 * Supabase Client Initialization
 * 데이터 연동 및 인증을 위한 최상위 클라이언트 설정
 */
import { createClient } from '@supabase/supabase-js';

// Dashboard -> Project Settings -> API 에서 확인 가능합니다.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
