import { NextRequest, NextResponse } from 'next/server'

// Pexels API를 위한 타입 정의
interface PexelsVideo {
  id: number
  url: string
  duration: number
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
  user: {
    id: number
    name: string
    url: string
  }
}

interface PexelsResponse {
  videos: PexelsVideo[]
  page: number
  per_page: number
  total_results: number
  prev_page?: string
  next_page?: string
}

// 표준화된 비디오 결과 타입
interface VideoResult {
  id: string
  url: string
  thumbnail: string
  duration: number
  source: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keywords, source = 'pexels', orientation = 'portrait', per_page = 20 } = body

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: '키워드가 필요합니다.' },
        { status: 400 }
      )
    }

    // 키워드를 하나의 검색어로 결합
    const searchQuery = keywords.join(' ')

    let videos: VideoResult[] = []

    if (source === 'pexels') {
      videos = await searchPexelsVideos(searchQuery, orientation, per_page)
    } else if (source === 'pixabay') {
      videos = await searchPixabayVideos(searchQuery, orientation, per_page)
    } else {
      return NextResponse.json(
        { error: '지원되지 않는 비디오 소스입니다.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      videos,
      query: searchQuery,
      source,
      orientation,
      total: videos.length
    })

  } catch (error) {
    console.error('영상 검색 오류:', error)
    return NextResponse.json(
      { error: '영상 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

async function searchPexelsVideos(
  query: string, 
  orientation: string, 
  perPage: number
): Promise<VideoResult[]> {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY

  if (!PEXELS_API_KEY) {
    console.warn('PEXELS_API_KEY가 설정되지 않았습니다. 더미 데이터를 반환합니다.')
    return generateDummyVideos(query, 'pexels', perPage)
  }

  try {
    const orientationParam = orientation === 'portrait' ? 'portrait' : 
                           orientation === 'landscape' ? 'landscape' : 'square'

    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=${orientationParam}&per_page=${perPage}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Pexels API 오류: ${response.status}`)
    }

    const data: PexelsResponse = await response.json()

    return data.videos.map((video) => ({
      id: `pexels_${video.id}`,
      url: video.video_files[0]?.link || video.url,
      thumbnail: video.video_pictures[0]?.picture || '',
      duration: video.duration,
      source: 'pexels'
    }))

  } catch (error) {
    console.error('Pexels API 호출 오류:', error)
    return generateDummyVideos(query, 'pexels', perPage)
  }
}

async function searchPixabayVideos(
  query: string, 
  orientation: string, 
  perPage: number
): Promise<VideoResult[]> {
  const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY

  if (!PIXABAY_API_KEY) {
    console.warn('PIXABAY_API_KEY가 설정되지 않았습니다. 더미 데이터를 반환합니다.')
    return generateDummyVideos(query, 'pixabay', perPage)
  }

  try {
    const url = `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=${perPage}&video_type=film`
    
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Pixabay API 오류: ${response.status}`)
    }

    const data = await response.json()

    return data.hits.map((video: any) => ({
      id: `pixabay_${video.id}`,
      url: video.videos?.large?.url || video.videos?.medium?.url || '',
      thumbnail: video.picture_id || '',
      duration: video.duration || 10,
      source: 'pixabay'
    }))

  } catch (error) {
    console.error('Pixabay API 호출 오류:', error)
    return generateDummyVideos(query, 'pixabay', perPage)
  }
}

// API 키가 없을 때 더미 데이터 생성
function generateDummyVideos(query: string, source: string, count: number): VideoResult[] {
  const dummyVideos: VideoResult[] = []
  
  for (let i = 1; i <= Math.min(count, 10); i++) {
    dummyVideos.push({
      id: `${source}_dummy_${i}`,
      url: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
      thumbnail: `https://picsum.photos/320/180?random=${i}`,
      duration: Math.floor(Math.random() * 20) + 5, // 5-25초 랜덤
      source: source
    })
  }

  return dummyVideos
}
