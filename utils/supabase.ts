/**
 * Supabase Client Initialization
 * 데이터 연동 및 인증을 위한 최상위 클라이언트 설정
 */
import { createClient } from '@supabase/supabase-js';

// TODO: 사용자님의 Supabase 프로젝트 정보로 교체 필요
// Dashboard -> Project Settings -> API 에서 확인 가능합니다.
const SUPABASE_URL = 'https://sddyujjpxpdpzrdedgqy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Glp2G6vwkse3Jp4dg93Rlw_wEJp6QXm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
