import { NextRequest, NextResponse } from 'next/server'
import { createApiSupabase } from '@/lib/supabase-server'

// SerpAPI 이미지 검색 결과 타입
interface SerpApiImageResult {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      search_term, 
      image_aspect = 'portrait', 
      image_size = 'l',
      image_type = 'photo',
      safe_search = 'active',
      max_results = 20 
    } = body

    if (!search_term) {
      return NextResponse.json(
        { success: false, error: '검색어를 입력해주세요.' },
        { status: 400 }
      )
    }

    // Supabase 클라이언트 생성 (인증 확인용)
    const supabase = createApiSupabase(request)

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // SerpAPI 키 확인
    const SERPAPI_KEY = process.env.SERPAPI_API_KEY
    if (!SERPAPI_KEY) {
      return NextResponse.json(
        { success: false, error: 'SerpAPI 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 🚀 SerpAPI를 사용한 Google Images 검색
    console.log('SerpAPI 이미지 검색 시작:', { search_term, image_aspect, image_size })
    
    const startTime = Date.now()
    
    // 종횡비 매핑
    const aspectRatioMap: { [key: string]: string } = {
      'portrait': 't',  // tall (세로형)
      'landscape': 'w', // wide (가로형) 
      'square': 's'     // square (정사각형)
    }

    // SerpAPI 파라미터 설정
    const params = new URLSearchParams({
      engine: 'google_images',
      q: search_term,
      imgar: aspectRatioMap[image_aspect] || 's',
      imgsz: image_size,
      image_type: image_type,
      safe: safe_search,
      ijn: '0',
      api_key: SERPAPI_KEY
    })

    // 한국어 검색인 경우 지역 설정 추가
    if (/[가-힣]/.test(search_term)) {
      params.append('gl', 'kr')  // 한국 지역
      params.append('hl', 'ko')  // 한국어 언어
    }

    const response = await fetch(`https://serpapi.com/search?${params}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Shot-Form-AI/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`SerpAPI 오류: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    const duration = Date.now() - startTime

    // 이미지 결과 처리
    const images: SerpApiImageResult[] = []
    
    if (data.images_results && Array.isArray(data.images_results)) {
      for (const img of data.images_results.slice(0, max_results)) {
        try {
          // 이미지 정보 추출
          const imageResult: SerpApiImageResult = {
            id: `serpapi_${images.length + 1}`,
            url: img.original || '',
            thumbnail_url: img.thumbnail || '',
            title: img.title || '',
            source: img.link || '',
            width: parseInt(img.original_width) || 0,
            height: parseInt(img.original_height) || 0,
            format: getImageFormat(img.original || ''),
            aspect_ratio: 0
          }

          // 종횡비 계산
          if (imageResult.width && imageResult.height) {
            imageResult.aspect_ratio = imageResult.height / imageResult.width
          }

          // 유효한 URL이 있는 경우에만 추가
          if (imageResult.url && imageResult.url.startsWith('http')) {
            images.push(imageResult)
          }
        } catch (error) {
          console.warn('이미지 처리 오류:', error)
          continue
        }
      }
    }

    console.log(`SerpAPI 이미지 검색 완료 (${duration}ms): ${images.length}개 이미지 발견`)

    return NextResponse.json({
      success: true,
      images,
      query: search_term,
      source: 'serpapi',
      aspect: image_aspect,
      total: images.length,
      processing_time: duration,
      message: `${images.length}개의 이미지를 찾았습니다.`
    })

  } catch (error) {
    console.error('SerpAPI 이미지 검색 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '이미지 검색 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
}

// 이미지 포맷 추출 함수
function getImageFormat(url: string): string {
  const urlLower = url.toLowerCase()
  if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return 'jpg'
  if (urlLower.includes('.png')) return 'png'
  if (urlLower.includes('.gif')) return 'gif'
  if (urlLower.includes('.webp')) return 'webp'
  return 'unknown'
} 