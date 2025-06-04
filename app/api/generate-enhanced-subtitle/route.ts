import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      audio_url, // 음성 파일 URL (base64 또는 실제 URL)
      audio_data, // base64 오디오 데이터
      style = 'youtube',
      animation = 'fade',
      korean_optimization = true,
      custom_config = null
    } = body

    // 입력 검증
    if (!audio_url && !audio_data) {
      return NextResponse.json({
        status: 400,
        message: "음성 파일 URL 또는 데이터가 필요합니다.",
        data: null
      }, { status: 400 })
    }

    console.log('Whisper 기반 자막 생성 시작...')

    // Whisper API 호출을 위한 음성 데이터 준비
    let audioBuffer: Buffer

    if (audio_data) {
      // base64 데이터에서 Buffer 생성
      audioBuffer = Buffer.from(audio_data, 'base64')
    } else if (audio_url) {
      // URL에서 오디오 다운로드
      if (audio_url.startsWith('data:')) {
        // data URL인 경우
        const base64Data = audio_url.split(',')[1]
        audioBuffer = Buffer.from(base64Data, 'base64')
      } else {
        // 실제 URL인 경우 다운로드
        const audioResponse = await fetch(audio_url)
        audioBuffer = Buffer.from(await audioResponse.arrayBuffer())
      }
    } else {
      throw new Error('유효한 음성 데이터를 찾을 수 없습니다.')
    }

    // OpenAI Whisper API 호출
    const formData = new FormData()
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' })
    formData.append('file', audioBlob, 'audio.wav')
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'verbose_json') // 타임스탬프 포함
    formData.append('language', korean_optimization ? 'ko' : 'en')

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    })

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text()
      console.error('Whisper API 오류:', whisperResponse.status, errorText)
      throw new Error(`Whisper API 오류: ${whisperResponse.status}`)
    }

    const whisperResult = await whisperResponse.json()
    console.log('Whisper 전사 완료:', whisperResult.text)

    // 세그먼트 기반 자막 생성
    const segments = whisperResult.segments || []
    
    // ASS 형식 자막 생성
    const generateASSSubtitle = (segments: any[], style: string) => {
      const styleConfig = getStyleConfig(style, korean_optimization)
      
      let assContent = `[Script Info]
Title: Shot Form AI Generated Subtitle
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${styleConfig.fontname},${styleConfig.fontsize},${styleConfig.primarycolour},${styleConfig.secondarycolour},${styleConfig.outlinecolour},${styleConfig.backcolour},${styleConfig.bold},${styleConfig.italic},0,0,100,100,0,0,1,${styleConfig.outline},${styleConfig.shadow},${styleConfig.alignment},10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`

      segments.forEach((segment: any, index: number) => {
        const startTime = formatTimeForASS(segment.start)
        const endTime = formatTimeForASS(segment.end)
        const text = segment.text.trim()
        
        if (text) {
          // 애니메이션 효과 적용
          const animatedText = applyAnimation(text, animation)
          assContent += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${animatedText}\n`
        }
      })

      return assContent
    }

    // SRT 형식 자막도 생성 (호환성)
    const generateSRTSubtitle = (segments: any[]) => {
      let srtContent = ''
      
      segments.forEach((segment: any, index: number) => {
        const startTime = formatTimeForSRT(segment.start)
        const endTime = formatTimeForSRT(segment.end)
        const text = segment.text.trim()
        
        if (text) {
          srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`
        }
      })

      return srtContent
    }

    const assSubtitle = generateASSSubtitle(segments, style)
    const srtSubtitle = generateSRTSubtitle(segments)

    // 자막 분석 정보
    const analysisInfo = {
      total_segments: segments.length,
      total_duration: whisperResult.duration,
      average_segment_length: segments.length > 0 ? whisperResult.duration / segments.length : 0,
      word_count: whisperResult.text.split(' ').length,
      confidence: segments.reduce((sum: number, seg: any) => sum + (seg.avg_logprob || 0), 0) / segments.length
    }

    return NextResponse.json({
      status: 200,
      message: "Whisper 기반 자막 생성이 완료되었습니다.",
      data: {
        subtitle_content: assSubtitle,
        srt_subtitle: srtSubtitle,
        raw_transcription: whisperResult.text,
        segments: segments,
        style_info: {
          style: style,
          animation: animation,
          korean_optimization: korean_optimization
        },
        analysis: analysisInfo,
        processing_time: whisperResult.duration
      }
    })

  } catch (error) {
    console.error('Whisper 자막 생성 오류:', error)
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : 'Whisper 자막 생성 중 오류가 발생했습니다.',
      data: null
    }, { status: 500 })
  }
}

// ASS 시간 형식 변환 (0:00:00.00)
function formatTimeForASS(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`
}

// SRT 시간 형식 변환 (00:00:00,000)
function formatTimeForSRT(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
}

// 스타일 설정
function getStyleConfig(style: string, korean_optimization: boolean) {
  const koreanFont = korean_optimization ? 'NanumGothic' : 'Arial'
  
  const styles = {
    youtube: {
      fontname: koreanFont,
      fontsize: 20,
      primarycolour: '&Hffffff',
      secondarycolour: '&Hffffff', 
      outlinecolour: '&H000000',
      backcolour: '&H80000000',
      bold: 1,
      italic: 0,
      outline: 2,
      shadow: 0,
      alignment: 2
    },
    netflix: {
      fontname: koreanFont,
      fontsize: 18,
      primarycolour: '&Hffffff',
      secondarycolour: '&Hffffff',
      outlinecolour: '&H000000', 
      backcolour: '&H00000000',
      bold: 0,
      italic: 0,
      outline: 1,
      shadow: 1,
      alignment: 2
    },
    anime: {
      fontname: korean_optimization ? 'NanumGothic' : 'Comic Sans MS',
      fontsize: 22,
      primarycolour: '&H00ffff',
      secondarycolour: '&H00ffff',
      outlinecolour: '&H000000',
      backcolour: '&H80000000',
      bold: 1,
      italic: 0,
      outline: 3,
      shadow: 0,
      alignment: 2
    },
    aesthetic: {
      fontname: korean_optimization ? 'NanumMyeongjo' : 'Georgia',
      fontsize: 19,
      primarycolour: '&Hf0f0f0',
      secondarycolour: '&Hf0f0f0',
      outlinecolour: '&H202020',
      backcolour: '&H60000000',
      bold: 0,
      italic: 1,
      outline: 1,
      shadow: 2,
      alignment: 2
    }
  }
  
  return styles[style as keyof typeof styles] || styles.youtube
}

// 애니메이션 효과 적용
function applyAnimation(text: string, animation: string): string {
  switch (animation) {
    case 'fade':
      return `{\\fad(300,300)}${text}`
    case 'typewriter':
      return `{\\k0}${text.split('').map(char => `{\\k20}${char}`).join('')}`
    case 'slide':
      return `{\\move(0,0,0,0,0,500)}${text}`
    case 'zoom':
      return `{\\t(\\fscx120\\fscy120)\\t(300,500,\\fscx100\\fscy100)}${text}`
    case 'glow':
      return `{\\blur3\\t(0,300,\\blur0)}${text}`
    default:
      return text
  }
}

export async function GET() {
  return NextResponse.json({
    status: 200,
    message: "사용 가능한 자막 스타일과 애니메이션 목록",
    data: {
      styles: {
        youtube: "YouTube 스타일 (두꺼운 외곽선)",
        netflix: "Netflix 스타일 (얇은 외곽선)", 
        anime: "애니메이션 스타일 (화려한 색상)",
        aesthetic: "미적 스타일 (우아한 폰트)"
      },
      animations: {
        none: "애니메이션 없음",
        fade: "페이드 인/아웃",
        typewriter: "타이프라이터 효과",
        slide: "슬라이드 효과", 
        zoom: "줌 효과",
        glow: "글로우 효과"
      }
    }
  })
} 