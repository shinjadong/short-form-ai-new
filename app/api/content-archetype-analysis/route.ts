import { NextRequest, NextResponse } from 'next/server'

// 콘텐츠 원형 분석 요청 타입
interface ContentArchetypeRequest {
  category: string
  theme: string
  title: string
  videoText: string
  targetAudience: string
  trendElements: string
  successFactors: string
  notes: string
  scriptSettings: {
    length: 'short' | 'medium' | 'long'
    style: string
    tone: string
    target_audience: string
    content_structure: string
    language: string
  }
}

// 아키타입 분석 결과 타입
interface ArchetypeAnalysis {
  archetype_pattern: string
  success_formula: string
  core_message: string
  engagement_triggers: string[]
  script_structure: {
    segments: Array<{
      segment_id: number
      text: string
      start_time: number
      end_time: number
      keywords: string[]
      emotional_intensity: number
    }>
  }
  analysis: {
    three_second_compliance: {
      total_segments: number
      compliant_segments: number
      compliance_rate: number
    }
    curiosity_score: number
    hook_strength: number
    engagement_prediction: number
    recommendations: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContentArchetypeRequest = await request.json()
    
    // Claude Sonnet 4 모델을 사용한 콘텐츠 원형 분석
    const archetypePrompt = `
분석 대상 콘텐츠:
카테고리: ${body.category}
주제: ${body.theme}
원본 제목: ${body.title}
핵심 텍스트: ${body.videoText}
타겟 시청자: ${body.targetAudience}

미션: 위 콘텐츠를 분석하여 ${body.scriptSettings.length === 'short' ? '15초 (5구간)' : body.scriptSettings.length === 'medium' ? '30초 (10구간)' : '60초 (20구간)'} 분량의 3초 룰 헌법 스크립트를 생성하세요.

요구사항:
- 각 구간은 정확히 3초
- 구간당 6-10단어 (한국어)
- 매 구간마다 궁금증 유발
- 스타일: ${body.scriptSettings.style}

아래 JSON 형식으로만 응답하세요:

\`\`\`json
{
  "archetype_pattern": "분석된 성공 패턴",
  "success_formula": "핵심 성공 공식",
  "core_message": "핵심 메시지",
  "engagement_triggers": ["트리거1", "트리거2", "트리거3"],
  "script_structure": {
    "segments": [
      {
        "segment_id": 0,
        "text": "구간별 텍스트 (6-10단어)",
        "start_time": 0,
        "end_time": 3,
        "keywords": ["키워드1", "키워드2", "키워드3"],
        "emotional_intensity": 85
      }
    ]
  },
  "analysis": {
    "three_second_compliance": {
      "total_segments": ${body.scriptSettings.length === 'short' ? 5 : body.scriptSettings.length === 'medium' ? 10 : 20},
      "compliant_segments": ${body.scriptSettings.length === 'short' ? 5 : body.scriptSettings.length === 'medium' ? 10 : 20},
      "compliance_rate": 100
    },
    "curiosity_score": 92,
    "hook_strength": 89,
    "engagement_prediction": 87,
    "recommendations": ["개선사항1", "개선사항2"]
  }
}
\`\`\`

JSON만 응답하고 다른 설명은 하지 마세요.`

    // OpenAI Claude Sonnet 4 API 호출
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: archetypePrompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API Error: ${response.status}`)
    }

    const claudeData = await response.json()
    const claudeResponse = claudeData.content[0].text

    // 🐛 디버깅: Claude 응답 전체 로깅
    console.log('🤖 Claude 전체 응답:', claudeResponse)

    // JSON 응답 파싱 (더 robust한 방법)
    let jsonMatch = claudeResponse.match(/```json\n([\s\S]*?)\n```/)
    
    // 첫 번째 방법이 실패하면 다른 패턴들 시도
    if (!jsonMatch) {
      console.log('❌ 첫 번째 JSON 패턴 매칭 실패, 다른 패턴 시도...')
      
      // ```json (개행 없음)
      jsonMatch = claudeResponse.match(/```json([\s\S]*?)```/)
      
      if (!jsonMatch) {
        // { 로 시작하는 JSON 블록 찾기
        jsonMatch = claudeResponse.match(/(\{[\s\S]*\})/g)
        if (jsonMatch) {
          jsonMatch = [null, jsonMatch[jsonMatch.length - 1]] // 마지막 JSON 블록 사용
        }
      }
    }

    if (!jsonMatch) {
      console.error('❌ 모든 JSON 파싱 시도 실패')
      console.log('Claude 응답 샘플:', claudeResponse.substring(0, 500) + '...')
      throw new Error('Claude 응답에서 JSON을 찾을 수 없습니다. 응답을 확인해주세요.')
    }

    console.log('✅ 추출된 JSON:', jsonMatch[1])
    
    const analysisResult: ArchetypeAnalysis = JSON.parse(jsonMatch[1])

    // 스크립트 생성
    const script = analysisResult.script_structure.segments
      .map(segment => `[${segment.segment_id + 1}구간] (${segment.start_time}-${segment.end_time}초): ${segment.text}`)
      .join('\n')

    return NextResponse.json({
      status: 200,
      message: '콘텐츠 원형 아키타입 분석 완료',
      data: {
        script,
        segments: analysisResult.script_structure.segments,
        analysis: analysisResult.analysis,
        archetype: {
          pattern: analysisResult.archetype_pattern,
          formula: analysisResult.success_formula,
          core_message: analysisResult.core_message,
          engagement_triggers: analysisResult.engagement_triggers
        }
      }
    })

  } catch (error) {
    console.error('콘텐츠 원형 분석 오류:', error)
    return NextResponse.json({
      status: 500,
      message: '콘텐츠 원형 분석에 실패했습니다.',
      data: null
    }, { status: 500 })
  }
} 