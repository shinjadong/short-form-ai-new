import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('프론트엔드에서 받은 요청:', JSON.stringify(body, null, 2))

    const {
      subject,
      script,
      keywords,
      videoSource,
      videoMaterials,
      concatMode,
      transitionMode,
      aspectRatio,
      clipDuration,
      videoCount,
      voiceName,
      voiceVolume,
      voiceRate,
      bgmType,
      bgmVolume,
      subtitleEnabled,
      fontName,
      subtitlePosition,
      customPosition,
      textColor,
      textBackgroundColor,
      fontSize,
      strokeColor,
      strokeWidth,
      nThreads,
      paragraphNumber
    } = body

    // 필수 필드 검증
    if (!subject) {
      return NextResponse.json(
        { success: false, error: '비디오 주제를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!script) {
      return NextResponse.json(
        { success: false, error: '스크립트를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 백엔드 VideoParams 스키마에 정확히 맞는 요청 데이터 구성
    const videoParams = {
      // 필수 필드
      video_subject: subject,
      video_script: script,
      
      // 비디오 관련 설정
      video_terms: keywords || null,
      video_aspect: aspectRatio || "9:16",
      video_concat_mode: concatMode || "random",
      video_transition_mode: transitionMode || null,
      video_clip_duration: clipDuration || 5,
      video_count: videoCount || 1,
      video_source: videoSource || "pexels",
      video_materials: videoSource === "local" && videoMaterials ? 
        videoMaterials.map((material: any) => ({
          provider: "local",
          url: material.url,
          duration: 0
        })) : null,
      video_language: "",
      
      // 음성 설정
      voice_name: voiceName || "ko-KR-SunHiNeural-Female",
      voice_volume: voiceVolume || 1.0,
      voice_rate: voiceRate || 1.0,
      
      // 배경음악 설정
      bgm_type: bgmType || "random",
      bgm_file: "",
      bgm_volume: bgmVolume || 0.2,
      
      // 자막 설정
      subtitle_enabled: subtitleEnabled !== false,
      subtitle_position: subtitlePosition || "bottom",
      custom_position: customPosition || 70.0,
      font_name: fontName || "NanumGothic.ttf",
      text_fore_color: textColor || "#FFFFFF",
      text_background_color: textBackgroundColor !== false,
      font_size: fontSize || 60,
      stroke_color: strokeColor || "#000000",
      stroke_width: strokeWidth || 1.5,
      
      // 기타 설정
      n_threads: nThreads || 2,
      paragraph_number: paragraphNumber || 1,
      llm_provider: "openai"
    }

    console.log('백엔드로 보낼 요청:', JSON.stringify(videoParams, null, 2))

    // 백엔드 API 호출
    const response = await fetch(`${BACKEND_URL}/api/v1/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoParams),
    })

    const responseText = await response.text()
    console.log('백엔드 응답 상태:', response.status)
    console.log('백엔드 응답 내용:', responseText)

    if (!response.ok) {
      console.error('Backend error:', responseText)
      return NextResponse.json(
        { 
          success: false, 
          error: `비디오 생성 요청 실패: ${response.status} - ${responseText}` 
        },
        { status: response.status }
      )
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError)
      return NextResponse.json(
        { 
          success: false, 
          error: '백엔드 응답 파싱 오류' 
        },
        { status: 500 }
      )
    }
    
    // 태스크 생성 성공 시 태스크 ID 반환
    if (result.status === 200 && result.data?.task_id) {
      return NextResponse.json({
        success: true,
        task_id: result.data.task_id,
        message: '비디오 생성이 시작되었습니다.'
      })
    } else {
      console.error('예상치 못한 백엔드 응답:', result)
      return NextResponse.json(
        { 
          success: false, 
          error: '비디오 생성 요청이 실패했습니다.' 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('비디오 생성 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '비디오 생성 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
}
