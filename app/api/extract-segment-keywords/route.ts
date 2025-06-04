import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      script,
      audio_duration,
      language = 'ko',
      segment_duration = 3,
      keywords_per_segment = 3,
      context_subject = ''
    } = body

    // 입력 검증
    if (!script?.trim()) {
      return NextResponse.json({
        status: 400,
        message: "스크립트를 입력해주세요.",
        data: null
      }, { status: 400 })
    }

    if (!audio_duration || audio_duration <= 0) {
      return NextResponse.json({
        status: 400,
        message: "유효한 오디오 길이를 입력해주세요.",
        data: null
      }, { status: 400 })
    }

    console.log('구간별 키워드 추출 시작:', {
      script: script.substring(0, 50) + '...',
      audio_duration,
      segment_duration,
      keywords_per_segment
    })

    // 스크립트를 더 세밀하게 분리 (문장 + 의미 단위)
    const cleanScript = script.replace(/\([^)]*\)/g, '').trim() // 괄호 제거
    const sentences = cleanScript
      .split(/[.!?]+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 10) // 너무 짧은 문장 제거
    
    // 오디오 길이를 기반으로 구간 수 계산
    const totalSegments = Math.ceil(audio_duration / segment_duration)
    
    // 각 구간에 텍스트를 더 균등하게 배분
    const segmentsWithText: Array<{
      id: number
      start_time: number
      end_time: number
      text: string
    }> = []

    // 전체 텍스트를 구간 수만큼 균등 분할
    const wordsPerSegment = Math.ceil(cleanScript.split(' ').length / totalSegments)
    const words = cleanScript.split(' ')

    for (let i = 0; i < totalSegments; i++) {
      const startTime = Math.round(i * segment_duration * 100) / 100
      const endTime = Math.round(Math.min((i + 1) * segment_duration, audio_duration) * 100) / 100
      
      // 단어 기반으로 텍스트 분할
      const startWordIndex = i * wordsPerSegment
      const endWordIndex = Math.min((i + 1) * wordsPerSegment, words.length)
      const segmentWords = words.slice(startWordIndex, endWordIndex)
      const segmentText = segmentWords.join(' ').trim()

      // 빈 구간이면 이전 구간이나 전체 맥락에서 키워드 생성
      const finalText = segmentText.length > 5 ? segmentText : 
        (context_subject || cleanScript.substring(0, 100))

      segmentsWithText.push({
        id: i,
        start_time: startTime,
        end_time: endTime,
        text: finalText
      })
    }

    // 더 간단하고 명확한 프롬프트
    const systemPrompt = `You are a keyword extraction expert for video content. Extract ${keywords_per_segment} specific visual keywords from the given text segment.

Rules:
1. Extract concrete nouns and visual concepts only
2. Focus on searchable terms for images/videos  
3. Avoid abstract concepts, emotions, or explanatory phrases
4. Return ONLY a JSON array format: ["keyword1", "keyword2", "keyword3"]
5. If the text is about numbers or counting, focus on the main subject instead

Subject context: ${context_subject}
Language: ${language}`

    const segmentKeywords = await Promise.all(
      segmentsWithText.map(async (segment) => {
        try {
          const userPrompt = `Extract ${keywords_per_segment} visual keywords from this text segment:

"${segment.text}"

Return only JSON array format: ["keyword1", "keyword2", "keyword3"]`

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              max_tokens: 100,
              temperature: 0.1, // 더 일관된 결과를 위해 낮춤
            }),
          })

          if (!response.ok) {
            throw new Error(`OpenAI API 오류: ${response.status}`)
          }

          const result = await response.json()
          const keywordText = result.choices[0]?.message?.content?.trim()
          
          console.log(`구간 ${segment.id} OpenAI 응답:`, keywordText)
          
          // JSON 배열 파싱
          let keywords: string[] = []
          try {
            // JSON 파싱 시도
            const parsed = JSON.parse(keywordText)
            if (Array.isArray(parsed)) {
              keywords = parsed.filter((k: any) => 
                typeof k === 'string' && 
                k.trim().length > 0 && 
                !k.includes('죄송') && 
                !k.includes('제공') &&
                !k.includes('추출할 수 없') &&
                k.length < 50 // 너무 긴 설명문 제거
              ).map((k: any) => k.trim())
            }
          } catch (parseError) {
            console.warn(`구간 ${segment.id} JSON 파싱 실패, 수동 추출 시도:`, keywordText)
            
            // JSON 파싱 실패 시 수동 키워드 추출
            const manualKeywords = keywordText
              .replace(/[\[\]"]/g, '') // 대괄호, 따옴표 제거
              .split(/[,\n]/) // 쉼표나 줄바꿈으로 분리
              .map((k: string) => k.trim())
              .filter((k: string) => 
                k.length > 0 && 
                k.length < 30 &&
                !k.includes('죄송') && 
                !k.includes('제공') &&
                !k.includes('추출할 수 없')
              )
            
            keywords = manualKeywords.slice(0, keywords_per_segment)
          }

          // 기본 키워드 fallback (빈 경우)
          if (keywords.length === 0) {
            console.warn(`구간 ${segment.id} 키워드 추출 실패, 기본 키워드 사용`)
            
            // 텍스트에서 명사 추출 시도
            const fallbackKeywords = extractFallbackKeywords(segment.text, context_subject)
            keywords = fallbackKeywords.slice(0, keywords_per_segment)
          }

          // 최대 개수로 제한
          keywords = keywords.slice(0, keywords_per_segment)

          console.log(`구간 ${segment.id} 최종 키워드:`, keywords)

          return {
            segment_id: segment.id,
            start_time: segment.start_time,
            end_time: segment.end_time,
            text: segment.text,
            keywords: keywords
          }

        } catch (error) {
          console.error(`구간 ${segment.id} 키워드 추출 오류:`, error)
          
          // 에러 시 기본 키워드 생성
          const fallbackKeywords = extractFallbackKeywords(segment.text, context_subject)
          
          return {
            segment_id: segment.id,
            start_time: segment.start_time,
            end_time: segment.end_time,
            text: segment.text,
            keywords: fallbackKeywords.slice(0, keywords_per_segment),
            error: error instanceof Error ? error.message : '키워드 추출 실패'
          }
        }
      })
    )

    // 전체 통계
    const totalKeywords = segmentKeywords.reduce((sum, seg) => sum + seg.keywords.length, 0)
    const successfulSegments = segmentKeywords.filter(seg => seg.keywords.length > 0).length

    const responseData = {
      total_segments: totalSegments,
      segment_duration: segment_duration,
      audio_duration: audio_duration,
      segments: segmentKeywords,
      summary: {
        total_keywords: totalKeywords,
        successful_segments: successfulSegments,
        failed_segments: totalSegments - successfulSegments,
        average_keywords_per_segment: Math.round((totalKeywords / totalSegments) * 100) / 100
      }
    }

    console.log('키워드 추출 완료:', responseData.summary)

    return NextResponse.json({
      status: 200,
      message: "구간별 키워드 추출이 완료되었습니다.",
      data: responseData
    })

  } catch (error) {
    console.error('구간별 키워드 추출 오류:', error)
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : '구간별 키워드 추출 중 오류가 발생했습니다.',
      data: null
    }, { status: 500 })
  }
}

// 기본 키워드 추출 함수 (fallback)
function extractFallbackKeywords(text: string, contextSubject: string): string[] {
  const fallbackKeywords: string[] = []
  
  // 맥락 주제에서 키워드 추출
  if (contextSubject) {
    const contextWords = contextSubject.split(' ').filter(w => w.length > 2)
    fallbackKeywords.push(...contextWords.slice(0, 2))
  }
  
  // 텍스트에서 주요 단어 추출
  const commonWords = ['것', '그', '이', '수', '있', '하', '을', '를', '에', '의', '가', '와', '으로', '에서', '더']
  const words = text.split(/\s+/)
    .filter(word => 
      word.length > 1 && 
      !commonWords.includes(word) &&
      !word.match(/^\d+$/) // 숫자 제거
    )
    .slice(0, 3)
  
  fallbackKeywords.push(...words)
  
  // 기본 키워드 (최후의 수단)
  if (fallbackKeywords.length === 0) {
    fallbackKeywords.push('라이프스타일', '성공', '건강')
  }
  
  return fallbackKeywords.filter((word, index, arr) => arr.indexOf(word) === index) // 중복 제거
}

// 키워드 추출 옵션 조회 (GET 요청)
export async function GET() {
  return NextResponse.json({
    status: 200,
    message: "키워드 추출 옵션 정보",
    data: {
      segment_durations: [3, 5, 10],
      keywords_per_segment_options: [2, 3, 4, 5],
      supported_languages: ["ko", "en", "ja"],
      extraction_criteria: [
        "구체적인 명사 우선",
        "시각적 표현 가능성",
        "검색 효과성",
        "맥락 관련성"
      ]
    }
  })
} 