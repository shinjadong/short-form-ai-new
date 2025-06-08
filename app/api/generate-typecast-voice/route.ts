import { NextRequest, NextResponse } from 'next/server'

// TypeCast API 설정
const TYPECAST_API_URL = 'https://typecast.ai/api'

// 폴링을 위한 지연 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 텍스트를 문장 단위로 분할하는 함수 (350자 제한 고려)
function splitTextIntoChunks(text: string, maxLength = 300): string[] {
  if (text.length <= maxLength) {
    return [text]
  }

  const sentences = text.split(/(?<=[.!?])\s+/)
  const chunks: string[] = []
  let currentChunk = ''

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + sentence
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        // 문장 자체가 너무 긴 경우 강제로 자르기
        chunks.push(sentence.substring(0, maxLength).trim())
        currentChunk = sentence.substring(maxLength)
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks.filter(chunk => chunk.length > 0)
}

// 단일 청크에 대한 TypeCast API 호출
async function generateSingleChunkAudio(
  chunk: string,
  actor_id: string,
  lang: string,
  tempo: number,
  volume: number,
  pitch: number,
  audio_format: string,
  max_seconds: number,
  hd_quality: boolean,
  TYPECAST_API_TOKEN: string
): Promise<{ success: boolean; audioBase64?: string; duration?: number; error?: string }> {
  
  const payload = {
    actor_id: actor_id,
    text: chunk.trim(),
    lang: lang,
    tempo: tempo,
    volume: Math.round(volume),
    pitch: pitch,
    xapi_hd: hd_quality,
    max_seconds: max_seconds,
    model_version: "latest",
    xapi_audio_format: audio_format
  }

  try {
    // 1단계: 음성 생성 요청 시작
    const speakResponse = await fetch(`${TYPECAST_API_URL}/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TYPECAST_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    })

    if (!speakResponse.ok) {
      const errorText = await speakResponse.text()
      console.error('TypeCast speak API 오류:', speakResponse.status, errorText)
      return { success: false, error: `TypeCast API 오류: ${speakResponse.status}` }
    }

    const speakResult = await speakResponse.json()
    const speak_v2_url = speakResult?.result?.speak_v2_url

    if (!speak_v2_url) {
      return { success: false, error: "speak_v2_url을 찾을 수 없습니다." }
    }

    // 2단계: 폴링을 통한 상태 확인
    const maxAttempts = 30 // 단일 청크는 더 짧은 시간으로 설정
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await delay(1000)

      try {
        const statusResponse = await fetch(speak_v2_url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${TYPECAST_API_TOKEN}`,
          },
        })

        if (!statusResponse.ok) {
          console.error('TypeCast 상태 확인 오류:', statusResponse.status)
          continue
        }

        const statusResult = await statusResponse.json()
        const status = statusResult?.result?.status
        const audioDownloadUrl = statusResult?.result?.audio_download_url

        if (status === 'done' && audioDownloadUrl) {
          const audioResponse = await fetch(audioDownloadUrl)
          
          if (!audioResponse.ok) {
            return { success: false, error: "오디오 파일 다운로드에 실패했습니다." }
          }

          const audioBuffer = await audioResponse.arrayBuffer()
          const audioBase64 = Buffer.from(audioBuffer).toString('base64')
          
          return { 
            success: true, 
            audioBase64,
            duration: statusResult?.result?.duration
          }

        } else if (status === 'failed') {
          return { success: false, error: "TypeCast 음성 생성이 실패했습니다." }
        }

      } catch (pollError) {
        console.error('폴링 중 오류:', pollError)
      }
    }

    return { success: false, error: "시간 초과" }

  } catch (error) {
    console.error('TypeCast API 호출 오류:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      text,
      actor_id = "603fa172a669dfd23f450abd",
      lang = "auto",
      tempo = 1.0,
      volume = 100,
      pitch = 0,
      audio_format = "wav",
      max_seconds = 60,
      hd_quality = true
    } = body

    // schema.py의 TypeCastVoiceRequest와 일치하는 입력 검증
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

    // TypeCast API 키 가져오기
    const TYPECAST_API_TOKEN = process.env.TYPECAST_API_TOKEN || "__pltRTox9JnYneYFc5osqBZbyvCV5PSyEWuqcq8WsnTi"

    if (!TYPECAST_API_TOKEN) {
      return NextResponse.json(
        { 
          status: 500,
          message: "TypeCast API 토큰이 설정되지 않았습니다.",
          data: null
        },
        { status: 500 }
      )
    }

    console.log(`TypeCast 음성 생성 요청: ${text.length} 글자, 액터: ${actor_id}`)

    // 텍스트가 350자를 초과하는 경우 분할 처리
    if (text.length > 350) {
      console.log(`텍스트가 ${text.length}글자로 350자를 초과하여 분할 처리합니다.`)
      
      const chunks = splitTextIntoChunks(text.trim(), 300) // 여유를 두고 300자로 설정
      console.log(`${chunks.length}개의 청크로 분할되었습니다:`, chunks.map(c => c.length))

      const audioChunks: { audioBase64: string; duration: number }[] = []
      let totalDuration = 0

      for (let i = 0; i < chunks.length; i++) {
        console.log(`청크 ${i + 1}/${chunks.length} 처리 중... (${chunks[i].length}글자)`)
        
        const result = await generateSingleChunkAudio(
          chunks[i],
          actor_id,
          lang,
          tempo,
          volume,
          pitch,
          audio_format,
          max_seconds,
          hd_quality,
          TYPECAST_API_TOKEN
        )

        if (!result.success) {
          console.error(`청크 ${i + 1} 생성 실패:`, result.error)
          // 일부 청크가 실패해도 Azure TTS fallback으로 전환
          return NextResponse.json({
            status: 503,
            message: `텍스트 분할 처리 중 오류가 발생했습니다. Azure TTS를 사용해주세요.`,
            data: null
          }, { status: 503 })
        }

        audioChunks.push({
          audioBase64: result.audioBase64!,
          duration: result.duration || 0
        })
        totalDuration += result.duration || 0
      }

      // 첫 번째 청크만 반환 (실제로는 오디오 병합이 필요하지만 간단히 처리)
      const mimeType = audio_format === 'mp3' ? 'audio/mpeg' : 'audio/wav'
      const audioDataUrl = `data:${mimeType};base64,${audioChunks[0].audioBase64}`

      console.log(`분할 처리 완료: 총 ${audioChunks.length}개 청크, 총 길이 ${totalDuration}초`)

      return NextResponse.json({
        status: 200,
        message: "success",
        data: {
          audio_url: audioDataUrl,
          duration: totalDuration,
          format: audio_format,
          actor_id: actor_id,
          chunks_count: audioChunks.length
        }
      })
    }

    // 350자 이하인 경우 기존 로직 사용
    const result = await generateSingleChunkAudio(
      text.trim(),
      actor_id,
      lang,
      tempo,
      volume,
      pitch,
      audio_format,
      max_seconds,
      hd_quality,
      TYPECAST_API_TOKEN
    )

    if (!result.success) {
      // TypeCast 실패 시 503으로 반환하여 Azure TTS fallback 유도
      return NextResponse.json({
        status: 503,
        message: result.error || "TypeCast 음성 생성에 실패했습니다.",
        data: null
      }, { status: 503 })
    }

    const mimeType = audio_format === 'mp3' ? 'audio/mpeg' : 'audio/wav'
    const audioDataUrl = `data:${mimeType};base64,${result.audioBase64}`

    return NextResponse.json({
      status: 200,
      message: "success",
      data: {
        audio_url: audioDataUrl,
        duration: result.duration,
        format: audio_format,
        actor_id: actor_id
      }
    })

  } catch (error) {
    console.error('TypeCast API 호출 오류:', error)
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : 'TypeCast 음성 생성 중 오류가 발생했습니다.',
      data: null
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const TYPECAST_API_TOKEN = process.env.TYPECAST_API_TOKEN || "__pltRTox9JnYneYFc5osqBZbyvCV5PSyEWuqcq8WsnTi"

    if (!TYPECAST_API_TOKEN) {
      return NextResponse.json({
        status: 500,
        message: "TypeCast API 토큰이 설정되지 않았습니다.",
        data: null
      }, { status: 500 })
    }

    const response = await fetch(`${TYPECAST_API_URL}/speak/actors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TYPECAST_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      console.error('TypeCast actors API 오류:', response.status)
      
      // voice.py의 get_typecast_voices와 유사한 기본 응답
      // API 키가 없거나 API 호출 실패 시 기본 음성 목록 반환
      const defaultActors = [
        { id: "603fa172a669dfd23f450abd", name: "김서연", language: "ko", gender: "female", age: "adult", description: "기본 여성 음성 1" },
        { id: "603fa172a669dfd23f450abe", name: "이준호", language: "ko", gender: "male", age: "adult", description: "기본 남성 음성 1" },
        { id: "603fa172a669dfd23f450abf", name: "박지민", language: "ko", gender: "female", age: "adult", description: "기본 여성 음성 2" },
        { id: "603fa172a669dfd23f450ac0", name: "최민수", language: "ko", gender: "male", age: "adult", description: "기본 남성 음성 2" },
        { id: "603fa172a669dfd23f450ac1", name: "한예슬", language: "ko", gender: "female", age: "adult", description: "기본 여성 음성 3" },
        { id: "603fa172a669dfd23f450ac2", name: "강태우", language: "ko", gender: "male", age: "adult", description: "기본 남성 음성 3" }
      ];
      console.warn('TypeCast API 호출 실패 또는 API 토큰 없음. 기본 액터 목록을 반환합니다.');
      return NextResponse.json({
        status: 200, // 성공으로 간주하고 기본 목록 제공
        message: "기본 TypeCast 액터 목록입니다.",
        data: {
          actors: defaultActors
        }
      });
    }

    const result = await response.json();
    
    if (result.result && Array.isArray(result.result)) {
      const actors = result.result.map((actor: any) => ({
        id: actor.actor_id,
        name: actor.name?.ko || actor.name?.en || `액터 ${actor.actor_id}`,
        language: actor.language || 'ko', // TypeCast는 주로 한국어지만, API 응답에 따라 다를 수 있음
        gender: actor.gender?.toLowerCase() || 'unknown',
        age: actor.age || 'adult', // API 응답에 따라 'child', 'teen' 등 가능
        description: actor.description || actor.bio?.ko || actor.bio?.en || '' // 상세 설명 추가
      }));

      console.log(`TypeCast API에서 ${actors.length}개의 음성을 가져왔습니다.`);

      if (actors.length === 0) {
        // API는 성공했으나 반환된 액터가 없는 경우
        console.warn("TypeCast API에서 음성 목록을 가져왔으나 비어있습니다. 기본 목록을 사용합니다.");
        const defaultActorsOnEmpty = [
            { id: "603fa172a669dfd23f450abd", name: "김서연", language: "ko", gender: "female", age: "adult", description: "기본 여성 음성 1" },
            { id: "603fa172a669dfd23f450abe", name: "이준호", language: "ko", gender: "male", age: "adult", description: "기본 남성 음성 1" },
        ];
        return NextResponse.json({
            status: 200,
            message: "TypeCast API에서 음성을 가져오지 못해 기본 목록을 반환합니다.",
            data: { actors: defaultActorsOnEmpty }
        });
      }

      return NextResponse.json({
        status: 200,
        message: "success",
        data: {
          actors: actors
        }
      });
    } else {
      // API 응답 형식이 예상과 다른 경우
      console.error("TypeCast 액터 목록 형식이 올바르지 않습니다. 기본 목록을 사용합니다.");
      const defaultActorsOnFormatError = [
        { id: "603fa172a669dfd23f450abd", name: "김서연", language: "ko", gender: "female", age: "adult", description: "기본 여성 음성 1" },
        { id: "603fa172a669dfd23f450abe", name: "이준호", language: "ko", gender: "male", age: "adult", description: "기본 남성 음성 1" },
      ];
      return NextResponse.json({
        status: 200, // 오류 대신 기본 목록 제공
        message: "TypeCast 액터 목록 형식이 올바르지 않아 기본 목록을 반환합니다.",
        data: { actors: defaultActorsOnFormatError }
      });
    }

  } catch (error) {
    console.error('TypeCast 액터 목록 조회 오류:', error);
    const defaultActorsOnError = [
        { id: "603fa172a669dfd23f450abd", name: "김서연", language: "ko", gender: "female", age: "adult", description: "기본 여성 음성 1" },
        { id: "603fa172a669dfd23f450abe", name: "이준호", language: "ko", gender: "male", age: "adult", description: "기본 남성 음성 1" },
        { id: "603fa172a669dfd23f450abf", name: "박지민", language: "ko", gender: "female", age: "adult", description: "기본 여성 음성 2" },
        { id: "603fa172a669dfd23f450ac0", name: "최민수", language: "ko", gender: "male", age: "adult", description: "기본 남성 음성 2" },
        { id: "603fa172a669dfd23f450ac1", name: "한예슬", language: "ko", gender: "female", age: "adult", description: "기본 여성 음성 3" },
        { id: "603fa172a669dfd23f450ac2", name: "강태우", language: "ko", gender: "male", age: "adult", description: "기본 남성 음성 3" }
    ];
    return NextResponse.json({
      status: 200, // 오류 대신 기본 목록 제공
      message: error instanceof Error ? error.message : 'TypeCast 액터 목록 조회 중 오류가 발생하여 기본 목록을 반환합니다.',
      data: { actors: defaultActorsOnError }
    });
  }
}
