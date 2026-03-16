import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';

/**
 * Supabase Storage에 이미지 업로드
 * @param base64ImageData 로컬 이미지의 base64 문자열
 * @param fileName 저장할 파일명 (확장자 포함)
 * @returns 업로드된 이미지의 공개 URL (Public URL)
 */
export async function uploadClothImage(base64ImageData: string, fileName: string): Promise<string> {
    try {
        // 1. base64 문자열을 ArrayBuffer로 디코딩
        const arrayBuffer = decode(base64ImageData);

        // 2. Supabase Storage 'clothes-images' 버킷에 업로드
        const { data, error } = await supabase.storage
            .from('clothes-images')
            .upload(`public/${fileName}`, arrayBuffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (error) {
            console.error('이미지 업로드 실패:', error);
            throw error;
        }

        // 3. 업로드된 파일의 Public URL 생성 후 반환
        const { data: { publicUrl } } = supabase.storage
            .from('clothes-images')
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (err) {
        console.error('uploadClothImage 에러:', err);
        throw err;
    }
}

/**
 * 스타일 스크랩 이미지 업로드
 */
export async function uploadStyleScrapImage(base64ImageData: string, fileName: string): Promise<string> {
    try {
        const arrayBuffer = decode(base64ImageData);
        const { data, error } = await supabase.storage
            .from('style-scraps')
            .upload(`scraps/${fileName}`, arrayBuffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('style-scraps')
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (err) {
        console.error('uploadStyleScrapImage 에러:', err);
        throw err;
    }
}

