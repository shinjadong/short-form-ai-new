import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      text,
      voice_name = 'ko-KR-SunHiNeural-Female',
      voice_rate = 1.0,
      voice_volume = 1.0,
      audio_format = 'wav'
    } = body

    // 입력 검증
    if (!text || !text.trim()) {
      return NextResponse.json(
        { 
          status: 400,
          message: "텍스트를 입력해주세요.",
          data: null
        },
        { status: 400 }
      )
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Azure TTS는 최대 1000자까지 지원합니다.",
          data: null
        },
        { status: 400 }
      )
    }

    console.log(`Azure TTS 음성 생성 요청: ${text.length} 글자, 음성: ${voice_name}`)

    // Azure Speech Service 키 확인
    const speechKey = process.env.AZURE_SPEECH_KEY
    const speechRegion = process.env.AZURE_SPEECH_REGION || 'koreacentral'

    if (!speechKey) {
      console.error('Azure Speech Service 키가 설정되지 않았습니다.')
      return NextResponse.json(
        { 
          status: 500,
          message: "Azure Speech Service 키가 설정되지 않았습니다.",
          data: null
        },
        { status: 500 }
      )
    }

    // SSML 형식으로 변환 (더 안전한 XML 생성)
    const rateValue = Math.max(0.5, Math.min(2.0, voice_rate))
    const volumeValue = Math.max(0.0, Math.min(1.0, voice_volume))
    
    const ssml = `<?xml version="1.0" encoding="UTF-8"?>
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ko-KR">
  <voice name="${voice_name}">
    <prosody rate="${rateValue * 100}%" volume="${Math.round(volumeValue * 100)}%">
      ${text.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    </prosody>
  </voice>
</speak>`

    const outputFormat = audio_format === 'mp3' 
      ? 'audio-16khz-128kbitrate-mono-mp3' 
      : 'riff-16khz-16bit-mono-pcm'

    console.log(`Azure TTS 요청: 지역=${speechRegion}, 포맷=${outputFormat}`)

    try {
      const response = await fetch(
        `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': speechKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': outputFormat,
            'User-Agent': 'ShotFormAI/1.0'
          },
          body: ssml
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Azure TTS API 오류:', response.status, errorText)
        
        let errorMessage = `Azure TTS API 오류: ${response.status}`
        if (response.status === 401) {
          errorMessage = "Azure Speech Service 인증에 실패했습니다."
        } else if (response.status === 403) {
          errorMessage = "Azure Speech Service 권한이 없습니다."
        } else if (response.status === 429) {
          errorMessage = "Azure Speech Service 요청 한도를 초과했습니다."
        }

        return NextResponse.json({
          status: response.status,
          message: errorMessage,
          data: null
        }, { status: response.status })
      }

      // 오디오 데이터 처리
      const audioBuffer = await response.arrayBuffer()
      
      if (audioBuffer.byteLength === 0) {
        console.error('Azure TTS에서 빈 오디오 데이터를 반환했습니다.')
        return NextResponse.json({
          status: 500,
          message: "Azure TTS에서 오디오 생성에 실패했습니다.",
          data: null
        }, { status: 500 })
      }

      const audioBase64 = Buffer.from(audioBuffer).toString('base64')
      
      // Base64 데이터 URL 생성
      const mimeType = audio_format === 'mp3' ? 'audio/mpeg' : 'audio/wav'
      const audioDataUrl = `data:${mimeType};base64,${audioBase64}`
      
      // 간단한 duration 추정 (텍스트 길이 기반)
      const estimatedDuration = Math.max(3, Math.round(text.length * 0.08)) // 대략 분당 750글자 기준
      
      console.log(`Azure TTS 음성 생성 완료: ${audioBuffer.byteLength} bytes, 예상 길이: ${estimatedDuration}초`)

      return NextResponse.json({
        status: 200,
        message: "Azure TTS 음성 생성이 완료되었습니다.",
        data: {
          audio_url: audioDataUrl,
          duration: estimatedDuration,
          format: audio_format,
          voice_name: voice_name,
          provider: 'azure'
        }
      })

    } catch (fetchError) {
      console.error('Azure TTS API 요청 중 네트워크 오류:', fetchError)
      return NextResponse.json({
        status: 503,
        message: "Azure TTS 서비스에 연결할 수 없습니다.",
        data: null
      }, { status: 503 })
    }

  } catch (error) {
    console.error('Azure TTS API 호출 오류:', error)
    return NextResponse.json(
      { 
        status: 500,
        message: error instanceof Error ? error.message : 'Azure TTS 음성 생성 중 알 수 없는 오류가 발생했습니다.',
        data: null
      },
      { status: 500 }
    )
  }
} 