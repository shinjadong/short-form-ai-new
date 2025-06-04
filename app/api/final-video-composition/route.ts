import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      taskId,
      videoSubject,
      videoScript,
      audioFile,
      videoClips,
      imageAssets = [],
      subtitleContent,
      videoSettings,
      subtitleSettings,
      bgmSettings = { type: 'none', volume: 0.2 }
    } = body

    // 입력 검증
    if (!taskId || !videoScript || !audioFile || !subtitleContent) {
      return NextResponse.json({
        status: 400,
        message: "필수 매개변수가 누락되었습니다.",
        data: null
      }, { status: 400 })
    }

    console.log('최종 비디오 합성 시작:', {
      taskId,
      videoSubject,
      audioFile: audioFile.url ? 'URL 제공됨' : '데이터 없음',
      videoClips: videoClips?.length || 0,
      imageAssets: imageAssets?.length || 0,
      subtitleContent: subtitleContent ? '자막 제공됨' : '자막 없음'
    })

    // 백엔드 API 호출을 위한 데이터 준비
    const backendPayload = {
      video_subject: videoSubject,
      video_script: videoScript,
      video_aspect: videoSettings.aspect,
      video_clip_duration: videoSettings.clipDuration,
      video_concat_mode: videoSettings.concatMode,
      video_transition_mode: videoSettings.transitionMode,
      
      // 음성 설정
      voice_name: 'typecast-generated',
      voice_volume: 1.0,
      voice_rate: 1.0,
      
      // 자막 설정
      subtitle_enabled: true,
      subtitle_position: subtitleSettings.position,
      font_name: 'NanumGothic.ttf',
      font_size: subtitleSettings.fontSize,
      text_fore_color: subtitleSettings.fontColor,
      text_background_color: subtitleSettings.useBackground ? subtitleSettings.backgroundColor : false,
      stroke_color: '#000000',
      stroke_width: 1.5,
      
      // 배경음악 설정
      bgm_type: bgmSettings.type,
      bgm_volume: bgmSettings.volume,
      
      // 소재 정보
      video_materials: videoClips.map((clip: any) => ({
        provider: clip.source || 'pexels',
        url: clip.downloadUrl || clip.url,
        duration: clip.duration || 3.0
      })),
      
      // 이미지 소재 (필요시)
      image_materials: imageAssets.map((image: any) => ({
        provider: image.source || 'serpapi',
        url: image.url,
        thumbnail_url: image.thumbnail_url,
        title: image.title || '',
        width: image.width || 0,
        height: image.height || 0
      })),
      
      // 사전 생성된 파일들
      pre_generated_audio: audioFile.url,
      pre_generated_subtitle: subtitleContent,
      
      // 기타 설정
      video_count: 1,
      n_threads: 2
    }

    // 백엔드 API 호출
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080'
    const response = await fetch(`${backendUrl}/api/v1/video/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
      signal: AbortSignal.timeout(300000) // 5분 타임아웃
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('백엔드 API 오류:', response.status, errorText)
      throw new Error(`백엔드 API 오류: ${response.status}`)
    }

    const result = await response.json()
    console.log('백엔드 응답:', result)

    // schema.py BaseResponse 구조에 맞춘 응답
    if (result.status === 200 && result.data) {
      return NextResponse.json({
        status: 200,
        message: "최종 비디오 합성이 성공적으로 시작되었습니다.",
        data: {
          task_id: result.data.task_id || taskId,
          status: 'processing',
          progress: 0,
          current_step: '백엔드에서 비디오 합성 중...',
          estimated_time: 30 // 30초 예상
        }
      })
    } else {
      throw new Error(result.message || '백엔드에서 비디오 합성을 시작할 수 없습니다.')
    }

  } catch (error) {
    console.error('최종 비디오 합성 오류:', error)
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : '최종 비디오 합성 중 오류가 발생했습니다.',
      data: null
    }, { status: 500 })
  }
}

// 작업 상태 조회 (GET 요청)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json({
        status: 400,
        message: "작업 ID가 필요합니다.",
        data: null
      }, { status: 400 })
    }

    // 백엔드에서 작업 상태 조회
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080'
    const response = await fetch(`${backendUrl}/api/v1/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`백엔드 상태 조회 오류: ${response.status}`)
    }

    const result = await response.json()

    // schema.py BaseResponse 구조에 맞춘 응답
    if (result.status === 200 && result.data) {
      const taskData = result.data
      
      return NextResponse.json({
        status: 200,
        message: "작업 상태 조회 성공",
        data: {
          task_id: taskId,
          status: taskData.state === 1 ? 'completed' : taskData.state === -1 ? 'failed' : 'processing',
          progress: taskData.progress || 0,
          current_step: getStepDescription(taskData.progress),
          videos: taskData.videos || [],
          combined_videos: taskData.combined_videos || [],
          error: taskData.error || null
        }
      })
    } else {
      throw new Error('백엔드에서 작업 상태를 가져올 수 없습니다.')
    }

  } catch (error) {
    console.error('작업 상태 조회 오류:', error)
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : '작업 상태 조회 중 오류가 발생했습니다.',
      data: null
    }, { status: 500 })
  }
}

// 진행률에 따른 단계 설명
function getStepDescription(progress: number): string {
  if (progress < 20) return '비디오 소재 처리 중...'
  if (progress < 40) return '음성 파일 처리 중...'
  if (progress < 60) return '자막 적용 중...'
  if (progress < 80) return '비디오 합성 중...'
  if (progress < 100) return '최종 처리 중...'
  return '완료'
} 