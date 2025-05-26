import { NextRequest, NextResponse } from 'next/server'

// TypeCast API 설정
const TYPECAST_API_URL = 'https://typecast.ai/api'
const TYPECAST_API_TOKEN = process.env.TYPECAST_API_TOKEN

// 폴링을 위한 지연 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      text,
      tts_mode = 'actor',
      actor_id,
      speak_resource_id,
      lang = 'auto',
      xapi_hd = true,
      xapi_audio_format = 'wav',
      model_version = 'latest',
      emotion_tone_preset,
      emotion_prompt,
      volume = 100,
      speed_x = 1.0,
      tempo = 1.0,
      pitch = 0,
      max_seconds = 30,
      duration,
      last_pitch = 0
    } = body

    // 입력 검증
    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, error: '텍스트를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (text.length > 350) {
      return NextResponse.json(
        { success: false, error: 'TypeCast는 최대 350자까지 지원합니다.' },
        { status: 400 }
      )
    }

    if (!TYPECAST_API_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'TypeCast API 토큰이 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    if (tts_mode === 'actor' && !actor_id) {
      return NextResponse.json(
        { success: false, error: 'actor 모드에서는 actor_id가 필요합니다.' },
        { status: 400 }
      )
    }

    if (tts_mode === 'audio_file' && !speak_resource_id) {
      return NextResponse.json(
        { success: false, error: 'audio_file 모드에서는 speak_resource_id가 필요합니다.' },
        { status: 400 }
      )
    }

    // TypeCast API 요청 데이터 구성
    const typecastRequest: any = {
      text: text.trim(),
      tts_mode,
      lang,
      xapi_hd,
      xapi_audio_format,
      model_version,
      volume,
      speed_x,
      tempo,
      pitch,
      max_seconds,
      last_pitch
    }

    // 모드별 필수 매개변수 추가
    if (tts_mode === 'actor') {
      typecastRequest.actor_id = actor_id
    } else if (tts_mode === 'audio_file') {
      typecastRequest.speak_resource_id = speak_resource_id
    }

    // 선택적 매개변수 추가
    if (emotion_tone_preset) {
      typecastRequest.emotion_tone_preset = emotion_tone_preset
    }

    if (emotion_prompt && emotion_tone_preset === 'emotion-prompt') {
      typecastRequest.emotion_prompt = emotion_prompt
    }

    if (duration) {
      typecastRequest.duration = duration
    }

    console.log('TypeCast API 요청:', JSON.stringify(typecastRequest, null, 2))

    // 1단계: 음성 합성 요청 시작
    const speakResponse = await fetch(`${TYPECAST_API_URL}/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TYPECAST_API_TOKEN}`,
      },
      body: JSON.stringify(typecastRequest),
    })

    if (!speakResponse.ok) {
      const errorText = await speakResponse.text()
      console.error('TypeCast speak API 오류:', speakResponse.status, errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        return NextResponse.json({
          success: false,
          error: `TypeCast 오류: ${errorJson.message?.msg || errorText}`
        }, { status: speakResponse.status })
      } catch {
        return NextResponse.json({
          success: false,
          error: `TypeCast API 오류: ${speakResponse.status} ${errorText}`
        }, { status: speakResponse.status })
      }
    }

    const speakResult = await speakResponse.json()
    
    if (!speakResult.result?.speak_v2_url) {
      return NextResponse.json({
        success: false,
        error: 'TypeCast API 응답에서 speak_v2_url을 찾을 수 없습니다.'
      }, { status: 500 })
    }

    const speakV2Url = speakResult.result.speak_v2_url
    console.log('TypeCast speak_v2_url:', speakV2Url)

    // 2단계: 폴링을 통한 상태 확인 (최대 120초)
    let attempts = 0
    const maxAttempts = 120 // 120초
    
    while (attempts < maxAttempts) {
      await delay(1000) // 1초 대기
      attempts++

      try {
        const statusResponse = await fetch(speakV2Url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${TYPECAST_API_TOKEN}`,
          },
        })

        if (!statusResponse.ok) {
          console.error('상태 확인 실패:', statusResponse.status)
          continue
        }

        const statusResult = await statusResponse.json()
        console.log(`폴링 시도 ${attempts}:`, statusResult.result?.status)

        if (statusResult.result?.status === 'done') {
          // 3단계: 완료된 오디오 파일 다운로드
          const audioUrl = statusResult.result.audio_download_url
          
          if (!audioUrl) {
            return NextResponse.json({
              success: false,
              error: '오디오 다운로드 URL을 찾을 수 없습니다.'
            }, { status: 500 })
          }

          // 오디오 파일 다운로드
          const audioResponse = await fetch(audioUrl)
          if (!audioResponse.ok) {
            return NextResponse.json({
              success: false,
              error: '오디오 파일 다운로드에 실패했습니다.'
            }, { status: 500 })
          }

          const audioBuffer = await audioResponse.arrayBuffer()
          const audioBase64 = Buffer.from(audioBuffer).toString('base64')
          
          // Base64 데이터 URL 생성
          const mimeType = xapi_audio_format === 'mp3' ? 'audio/mpeg' : 'audio/wav'
          const audioDataUrl = `data:${mimeType};base64,${audioBase64}`
          
          return NextResponse.json({
            success: true,
            audio_url: audioDataUrl,
            audio_data: audioBase64,
            format: xapi_audio_format,
            actor_id: actor_id,
            duration: statusResult.result.duration,
            text_count: statusResult.result.text_count,
            message: 'TypeCast 음성 생성이 완료되었습니다.'
          })

        } else if (statusResult.result?.status === 'failed') {
          return NextResponse.json({
            success: false,
            error: 'TypeCast 음성 생성이 실패했습니다.'
          }, { status: 500 })
        }
        // 'progress' 또는 'started' 상태면 계속 폴링

      } catch (pollError) {
        console.error('폴링 중 오류:', pollError)
        // 폴링 오류는 무시하고 계속 시도
      }
    }

    // 타임아웃
    return NextResponse.json({
      success: false,
      error: 'TypeCast 음성 생성 시간이 초과되었습니다. 다시 시도해주세요.'
    }, { status: 408 })

  } catch (error) {
    console.error('TypeCast API 호출 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'TypeCast 음성 생성 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!TYPECAST_API_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'TypeCast API 토큰이 설정되지 않았습니다.'
      }, { status: 500 })
    }

    // TypeCast 액터 목록 조회
    const response = await fetch(`${TYPECAST_API_URL}/actor`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TYPECAST_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('TypeCast actors API 오류:', response.status, errorText)
      return NextResponse.json({
        success: false,
        error: `TypeCast 액터 목록 조회 실패: ${response.status}`
      }, { status: response.status })
    }

    const result = await response.json()
    
    // TypeCast API 응답 구조에 맞게 파싱
    if (result.result && Array.isArray(result.result)) {
      const actors = result.result.map((actor: any) => ({
        actor_id: actor.actor_id,
        name: actor.name || { en: `Actor ${actor.actor_id}`, ko: `액터 ${actor.actor_id}` },
        language: actor.language || 'ko',
        gender: actor.gender || 'unknown',
        description: actor.description || '',
        age: actor.age || 'adult'
      }))

      return NextResponse.json({
        success: true,
        actors: actors,
        message: 'TypeCast 액터 목록 조회가 완료되었습니다.'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'TypeCast 액터 목록 형식이 올바르지 않습니다.'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('TypeCast 액터 목록 조회 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'TypeCast 액터 목록 조회 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
}
