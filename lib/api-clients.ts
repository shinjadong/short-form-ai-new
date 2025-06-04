import OpenAI from 'openai'

// OpenAI 클라이언트 (서버 사이드에서만 사용)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * 한국어 검색어 영어 번역 함수
 * 백엔드 material.py의 translate_korean_to_english 로직을 프론트엔드에서 구현
 */
export function translateKoreanToEnglish(text: string): string {
  // 한글이 포함되어 있는지 확인
  const hasKorean = /[가-힣]/.test(text)
  
  if (!hasKorean) {
    return text // 한글이 없으면 원본 반환
  }

  // 간단한 내장 번역 사전 (백엔드와 동일)
  const translationDict: { [key: string]: string } = {
    "자연": "nature",
    "바다": "ocean",
    "산": "mountain",
    "도시": "city",
    "여행": "travel",
    "음식": "food",
    "요리": "cooking",
    "사람": "people",
    "사업": "business",
    "기술": "technology",
    "과학": "science",
    "우주": "space",
    "동물": "animals",
    "강아지": "dog",
    "고양이": "cat",
    "사랑": "love",
    "행복": "happiness",
    "가족": "family",
    "건강": "health",
    "운동": "exercise",
    "공부": "study",
    "학교": "school",
    "직장": "workplace",
    "회사": "company",
    "돈": "money",
    "금융": "finance",
    "투자": "investment",
    "주식": "stocks",
    "부동산": "real estate",
    "라이프스타일": "lifestyle",
    "웰빙": "wellness",
    "명상": "meditation",
    "요가": "yoga",
    "피트니스": "fitness"
  }

  // 사전에서 단어 찾기
  for (const [korean, english] of Object.entries(translationDict)) {
    if (text.includes(korean)) {
      console.log(`번역 사전 사용: '${text}' contains '${korean}', translating to '${english}'`)
      return english
    }
  }

  // 기본값: 감지된 한국어를 'lifestyle'로 변환 (안전한 검색어)
  console.log(`번역을 찾을 수 없음: '${text}', 기본값 'lifestyle' 사용`)
  return "lifestyle"
}

/**
 * 키워드 생성 - OpenAI 직접 호출
 * 기존: 백엔드 /api/v1/terms
 * 개선: 프론트엔드에서 OpenAI 직접 호출 (3초 완료)
 */
export async function generateKeywords(script: string, subject: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: "당신은 비디오 검색에 최적화된 키워드 추출 전문가입니다. 정확하고 검색에 적합한 영어 키워드를 생성합니다."
      }, {
        role: "user",
        content: `
다음 비디오 스크립트에서 영상 검색에 사용할 키워드 5개를 추출해주세요.

주제: ${subject}
스크립트: ${script}

요구사항:
- 영어로 된 키워드 5개
- 비디오 검색에 적합한 키워드
- 쉼표로 구분해서 나열
- 키워드만 작성하고 다른 설명은 필요 없음

예시: healthy lifestyle, balanced diet, exercise, wellness, meditation
        `.trim()
      }],
      temperature: 0.3,
      max_tokens: 100
    })

    const keywordsText = response.choices[0]?.message?.content || ''
    const keywords = keywordsText
      .split(',')
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0)
      .slice(0, 5) // 최대 5개로 제한

    return keywords.length > 0 ? keywords : ['video', 'content', 'lifestyle', 'modern', 'story']
  } catch (error) {
    console.error('키워드 생성 오류:', error)
    // 기본 키워드 반환
    return ['video', 'content', 'lifestyle', 'modern', 'story']
  }
}

/**
 * SerpAPI 이미지 검색 타입 정의
 */
export interface SerpApiImageResult {
  id: string
  url: string
  thumbnail_url: string
  title: string
  source: string
  width: number
  height: number
  format: string
  aspect_ratio: number
}

export interface SerpApiImageSearchOptions {
  search_term: string
  image_aspect?: 'portrait' | 'landscape' | 'square'
  image_size?: 'l' | 'm' | 'i' // large, medium, icon
  image_type?: 'photo' | 'clipart' | 'lineart' | 'animated'
  safe_search?: 'active' | 'off'
  max_results?: number
}

/**
 * SerpAPI 이미지 검색 - Google Images에서 고품질 이미지 검색
 * 백엔드 material.py의 search_images_serpapi를 프론트엔드에서 구현
 */
export async function searchSerpApiImages(options: SerpApiImageSearchOptions): Promise<SerpApiImageResult[]> {
  try {
    const response = await fetch('/api/search-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    const result = await response.json()

    if (result.success) {
      return result.images || []
    } else {
      throw new Error(result.error || 'SerpAPI 이미지 검색 실패')
    }
  } catch (error) {
    console.error('SerpAPI 이미지 검색 오류:', error)
    return []
  }
}

/**
 * 강화된 자막 생성 타입 정의
 */
export interface EnhancedSubtitleOptions {
  text: string
  voice_name?: string
  style?: 'youtube' | 'netflix' | 'anime' | 'aesthetic' | 'custom'
  animation?: 'none' | 'fade_in' | 'fade_out' | 'typewriter' | 'slide_up' | 'zoom_in' | 'glow'
  custom_config?: {
    font_name?: string
    font_size?: number
    primary_color?: string
    outline_color?: string
    bold?: boolean
    italic?: boolean
    alignment?: number
    margin_v?: number
    outline?: number
    shadow?: number
  }
  korean_optimization?: boolean
}

export interface EnhancedSubtitleResult {
  success: boolean
  subtitle_content?: string
  style_info?: any
  processing_time?: number
  message?: string
  error?: string
}

/**
 * 강화된 자막 생성 - 백엔드의 enhanced subtitle 기능을 프론트엔드에서 호출
 */
export async function generateEnhancedSubtitle(options: EnhancedSubtitleOptions): Promise<EnhancedSubtitleResult> {
  try {
    const response = await fetch('/api/generate-enhanced-subtitle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('강화된 자막 생성 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '자막 생성 중 오류가 발생했습니다.'
    }
  }
}

/**
 * 자막 스타일 및 애니메이션 목록 조회
 */
export async function getSubtitleStylesAndAnimations(): Promise<{
  styles: { [key: string]: string }
  animations: { [key: string]: string }
}> {
  try {
    const response = await fetch('/api/generate-enhanced-subtitle', {
      method: 'GET',
    })

    const result = await response.json()

    if (result.success) {
      return {
        styles: result.styles || {},
        animations: result.animations || {}
      }
    } else {
      throw new Error(result.error || '스타일 목록 조회 실패')
    }
  } catch (error) {
    console.error('스타일 목록 조회 오류:', error)
    // 기본 스타일 반환
    return {
      styles: {
        youtube: '반투명 검은 배경의 깔끔한 자막',
        netflix: '그림자가 있는 블록체 자막',
        anime: '테두리가 있는 애니메이션 스타일',
        aesthetic: '노란색 이탤릭체 빈티지 느낌',
        custom: '사용자 정의 스타일'
      },
      animations: {
        none: '애니메이션 없음',
        fade_in: '서서히 나타나는 효과',
        fade_out: '서서히 사라지는 효과',
        typewriter: '글자가 하나씩 나타나는 효과',
        slide_up: '아래에서 위로 슬라이드',
        zoom_in: '확대되면서 나타나는 효과',
        glow: '빛나는 효과'
      }
    }
  }
}

/**
 * TypeCast 음성 생성 타입 정의
 */
export interface TypeCastVoiceOptions {
  text: string
  actorId: string
  lang?: string
  tempo?: number
  volume?: number
  pitch?: number
  audioFormat?: 'wav' | 'mp3'
  maxSeconds?: number
  hdQuality?: boolean
}

export interface TypeCastVoiceResult {
  success: boolean
  audioUrl?: string
  audioBlob?: Blob
  duration?: number
  error?: string
}

/**
 * TypeCast 음성 생성 - TypeCast API 직접 호출
 * 기존: 백엔드 /api/v1/typecast/generate  
 * 개선: 프론트엔드에서 TypeCast API 직접 호출 (10초 완료)
 */
export async function generateTypecastVoice(options: TypeCastVoiceOptions): Promise<TypeCastVoiceResult> {
  try {
    const {
      text,
      actorId,
      lang = 'ko',
      tempo = 1.0,
      volume = 100,
      pitch = 0,
      audioFormat = 'wav',
      maxSeconds = 60,
      hdQuality = true
    } = options

    // TypeCast API 호출
    const response = await fetch('https://typecast.ai/api/speak', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TYPECAST_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        actor_id: actorId,
        lang,
        tempo,
        volume,
        pitch,
        audio_format: audioFormat,
        max_seconds: maxSeconds,
        hd_quality: hdQuality
      })
    })

    if (!response.ok) {
      throw new Error(`TypeCast API 오류: ${response.status} - ${response.statusText}`)
    }

    const result = await response.json()
    
    if (result.success && result.audio_url) {
      // 오디오 파일 다운로드
      const audioResponse = await fetch(result.audio_url)
      const audioBlob = await audioResponse.blob()

      return {
        success: true,
        audioUrl: result.audio_url,
        audioBlob,
        duration: result.duration
      }
    } else {
      return {
        success: false,
        error: result.error || 'TypeCast 음성 생성 실패'
      }
    }
  } catch (error) {
    console.error('TypeCast 음성 생성 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'TypeCast API 호출 실패'
    }
  }
}

/**
 * Pexels 비디오 타입 정의
 */
export interface PexelsVideo {
  id: number
  width: number
  height: number
  duration: number
  url: string
  image: string
  video_files: Array<{
    id: number
    quality: string
    file_type: string
    width: number
    height: number
    link: string
  }>
  video_pictures: Array<{
    id: number
    picture: string
    nr: number
  }>
}

export interface PexelsSearchResult {
  videos: PexelsVideo[]
  total_results: number
  page: number
  per_page: number
}

/**
 * Pexels 비디오 검색 - Pexels API 직접 호출 (한국어 번역 지원)
 * 기존: 백엔드 material.py를 통해 처리
 * 개선: 프론트엔드에서 Pexels API 직접 호출 + 한국어 번역 (즉시 완료)
 */
export async function searchPexelsVideos(keywords: string[], perPage: number = 10): Promise<PexelsVideo[]> {
  try {
    if (!keywords || keywords.length === 0) {
      return []
    }

    // 여러 키워드로 병렬 검색 (한국어 번역 적용)
    const searchPromises = keywords.map(async (keyword) => {
      // 한국어 키워드인 경우 영어로 번역
      const translatedKeyword = translateKoreanToEnglish(keyword)
      
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(translatedKeyword)}&per_page=${perPage}&orientation=portrait`,
        {
          headers: {
            'Authorization': process.env.PEXELS_API_KEY || ''
          }
        }
      )

      if (!response.ok) {
        console.warn(`Pexels API 오류 (키워드: ${keyword} -> ${translatedKeyword}):`, response.status)
        return { videos: [] }
      }

      return await response.json() as PexelsSearchResult
    })

    // 모든 검색 결과 수집
    const results = await Promise.all(searchPromises)
    const allVideos = results.flatMap(result => result.videos || [])

    // 중복 제거 (ID 기준)
    const uniqueVideos = allVideos.filter((video, index, self) =>
      index === self.findIndex(v => v.id === video.id)
    )

    // 세로형 비디오 우선 정렬 (9:16 비율에 가까운 순)
    const sortedVideos = uniqueVideos.sort((a, b) => {
      const ratioA = a.height / a.width
      const ratioB = b.height / b.width
      const targetRatio = 16 / 9 // 세로형 목표 비율

      return Math.abs(ratioA - targetRatio) - Math.abs(ratioB - targetRatio)
    })

    return sortedVideos.slice(0, perPage * 2) // 충분한 수량 반환
  } catch (error) {
    console.error('Pexels 비디오 검색 오류:', error)
    return []
  }
}

/**
 * 비디오 소재 다운로드 및 변환
 */
export async function downloadVideoAsBlob(videoUrl: string): Promise<Blob | null> {
  try {
    const response = await fetch(videoUrl)
    if (!response.ok) {
      throw new Error(`비디오 다운로드 실패: ${response.status}`)
    }
    return await response.blob()
  } catch (error) {
    console.error('비디오 다운로드 오류:', error)
    return null
  }
}

/**
 * TypeCast 액터 목록 조회
 */
export interface TypeCastActor {
  id: string
  name: string
  language: string
  gender: string
  age?: string
  description?: string
  demo_url?: string
}

export async function getTypecastActors(): Promise<TypeCastActor[]> {
  try {
    const response = await fetch('https://typecast.ai/api/actors', {
      headers: {
        'Authorization': `Bearer ${process.env.TYPECAST_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`TypeCast 액터 목록 조회 실패: ${response.status}`)
    }

    const result = await response.json()
    return result.actors || []
  } catch (error) {
    console.error('TypeCast 액터 목록 조회 오류:', error)
    // 기본 액터 목록 반환
    return [
      {
        id: '603fa172a669dfd23f450abd',
        name: '한국어 여성 목소리',
        language: 'ko',
        gender: 'female',
        age: 'adult',
        description: '친근하고 자연스러운 한국어 여성 목소리'
      }
    ]
  }
} 