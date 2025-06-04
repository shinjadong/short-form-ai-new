import { NextRequest, NextResponse } from 'next/server'
import { createApiSupabase } from '@/lib/supabase-server'
import { searchPexelsVideos, PexelsVideo } from '@/lib/api-clients'

// 표준화된 비디오 결과 타입
interface VideoResult {
  id: string
  url: string
  thumbnail: string
  duration: number
  source: string
  width: number
  height: number
  downloadUrl: string
  aspectRatio: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keywords, orientation = 'portrait', per_page = 20 } = body

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: '키워드가 필요합니다.' },
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

    // 🚀 Pexels API 직접 호출로 비디오 검색 (즉시 완료)
    console.log('비디오 검색 시작:', { keywords, orientation, per_page })
    
    const startTime = Date.now()
    const pexelsVideos = await searchPexelsVideos(keywords, per_page)
    const duration = Date.now() - startTime

    // Pexels 비디오를 표준 형식으로 변환
    const videos: VideoResult[] = pexelsVideos.map((video: PexelsVideo) => {
      // 최적 품질의 비디오 파일 선택 (세로형 우선)
      const portraitFile = video.video_files.find(file => 
        file.height > file.width && file.quality === 'hd'
      )
      const hdFile = video.video_files.find(file => file.quality === 'hd')
      const bestFile = portraitFile || hdFile || video.video_files[0]

      const aspectRatio = video.height / video.width
      
      return {
        id: `pexels_${video.id}`,
        url: video.url,
        thumbnail: video.video_pictures[0]?.picture || '',
        duration: video.duration,
        source: 'pexels',
        width: video.width,
        height: video.height,
        downloadUrl: bestFile?.link || '',
        aspectRatio
      }
    })

    // 세로형 영상 우선 정렬 (orientation이 portrait인 경우)
    const sortedVideos = orientation === 'portrait' 
      ? videos.sort((a, b) => b.aspectRatio - a.aspectRatio)
      : videos

    console.log(`비디오 검색 완료 (${duration}ms): ${videos.length}개 영상 발견`)

    return NextResponse.json({
      success: true,
      videos: sortedVideos,
      query: keywords.join(' '),
      source: 'pexels',
      orientation,
      total: videos.length,
      processing_time: duration,
      message: `${videos.length}개의 영상을 찾았습니다.`
    })

  } catch (error) {
    console.error('비디오 검색 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '비디오 검색 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
} 