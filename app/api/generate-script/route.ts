import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      subject,
      language = 'ko',
      length = 'medium',
      style = 'informative',
      tone = 'friendly',
      target_audience = 'general',
      content_structure = 'hook_content_cta',
      keywords = [],
      custom_requirements = '',
      enable_advanced_hooks = true,
      personality_type = 'curious', // 새로운 옵션
      emotional_trigger = 'curiosity' // 새로운 옵션
    } = body

    // 입력 검증
    if (!subject?.trim()) {
      return NextResponse.json({
        status: 400,
        message: "영상 주제를 입력해주세요.",
        data: null
      }, { status: 400 })
    }

    console.log('🎬 3초 룰 기반 스크립트 생성 시작:', {
      subject,
      language,
      length,
      style,
      tone
    })

    // 🚨 3초 룰 헌법: 길이별 구간 설정 (더욱 엄격하게 강화)
    const THREE_SECOND_RULE_CONFIG = {
      short: { 
        duration: 15, 
        segments: 5, 
        words_per_segment: '6-10단어', // 더 엄격하게
        syllables_per_segment: '8-15음절', // 발음 기준 추가
        structure: '충격후킹-문제제기-해결방법-놀라운결과-즉시행동',
        timing: [0, 3, 6, 9, 12],
        energy_curve: [100, 85, 90, 95, 100] // 각 구간별 에너지 레벨
      },
      medium: { 
        duration: 30, 
        segments: 10, 
        words_per_segment: '6-10단어',
        syllables_per_segment: '8-15음절',
        structure: '충격후킹-관심증폭-문제심화-해결단서-증거제시-혜택강조-사회적증명-긴급성조성-행동유도-강력마무리',
        timing: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27],
        energy_curve: [100, 90, 85, 80, 85, 90, 95, 90, 95, 100]
      },
      long: { 
        duration: 60, 
        segments: 20, 
        words_per_segment: '6-10단어',
        syllables_per_segment: '8-15음절',
        structure: '확장된 스토리텔링 + 완벽한 설득 구조',
        timing: Array.from({length: 20}, (_, i) => i * 3),
        energy_curve: Array.from({length: 20}, (_, i) => 
          i < 5 ? 100 - i * 3 : // 시작 높음 → 점진 하락
          i < 10 ? 85 + (i - 5) * 2 : // 중간 상승
          i < 15 ? 95 - (i - 10) * 1 : // 소폭 하락  
          90 + (i - 15) * 2 // 마지막 급상승
        )
      }
    }

    // 🎯 궁금증 유발 전략 강화
    const CURIOSITY_TRIGGERS = {
      question: ['이것 하나만으로', '진짜 이게 가능할까?', '왜 아무도 말하지 않을까?'],
      secret: ['비밀을 공개합니다', '숨겨진 진실', '전문가들이 감추는'],
      shocking: ['충격적인 사실', '믿기 어려운 결과', '예상과 완전히 다른'],
      comparison: ['99%가 모르는', '일반인 vs 전문가', '전과 후 비교'],
      time_sensitive: ['지금 당장', '단 3일만', '내일까지만'],
      exclusive: ['오직 여기서만', '특별 공개', '한정된 정보']
    }

    // 🧠 감정적 트리거 설정
    const EMOTIONAL_TRIGGERS = {
      curiosity: '궁금증과 의문을 자극하는',
      fear: '놓칠 수 있는 위험을 경고하는',
      desire: '강한 욕구와 열망을 불러일으키는',
      social_proof: '사회적 인정과 소속감을 자극하는',
      urgency: '즉시 행동하게 만드는 긴급함',
      achievement: '성취감과 자부심을 주는'
    }

    // 📱 숏폼 최적화 규칙
    const SHORTFORM_RULES = `
📱 숏폼 영상 3초 룰 헌법:
1. 각 문장은 정확히 3초 안에 읽을 수 있어야 함 (8-12단어)
2. 첫 3초가 전체 영상의 운명을 결정함
3. 매 3초마다 새로운 정보나 자극을 제공
4. 문장은 완결성을 가지되 다음 문장에 대한 궁금증 유발
5. 시각적 컷과 완벽히 동기화되는 구조

🎯 ${length === 'short' ? '15초 5구간' : length === 'medium' ? '30초 10구간' : '60초 20구간'} 전략:
${THREE_SECOND_RULE_CONFIG[length as keyof typeof THREE_SECOND_RULE_CONFIG].structure}

🧠 궁금증 유발 전략:
- ${CURIOSITY_TRIGGERS.question.join(' / ')}
- ${CURIOSITY_TRIGGERS.secret.join(' / ')}
- ${CURIOSITY_TRIGGERS.shocking.join(' / ')}

💭 감정적 트리거: ${EMOTIONAL_TRIGGERS[emotional_trigger as keyof typeof EMOTIONAL_TRIGGERS]}
`

    // 🎨 스타일별 특화 전략
    const STYLE_STRATEGIES = {
      informative: {
        hook: '충격적인 통계나 사실로 시작',
        development: '단계별 정보 전달',
        closure: '핵심 요약과 추가 정보 유도'
      },
      entertaining: {
        hook: '예상치 못한 상황이나 반전',
        development: '재미있는 비교나 상황',
        closure: '웃음과 함께 기억에 남는 마무리'
      },
      educational: {
        hook: '학습자의 현재 문제 지적',
        development: '해결 과정의 단계별 제시',
        closure: '학습 성과와 다음 단계 제시'
      }
    }

    // 🎪 고급 후킹 전략
    const ADVANCED_HOOKS = [
      { name: '패턴 중단', description: '예상과 다른 전개로 주의 집중' },
      { name: '미완성 루프', description: '완결되지 않은 정보로 궁금증 유발' },
      { name: '대비 효과', description: '극명한 차이로 충격 전달' },
      { name: '개인화', description: '시청자 개인의 상황과 연결' },
      { name: '사회적 검증', description: '다른 사람들의 성공 사례' },
      { name: '희소성', description: '제한된 기회나 정보임을 강조' }
    ]

    // 🧠 뇌과학 기반 궁금증 메커니즘
    const NEUROSCIENCE_CURIOSITY = {
      dopamine_triggers: [
        '예상치 못한 반전',
        '미완성 정보 (제이가르닉 효과)',
        '개인 연관성',
        '사회적 비교',
        '즉시 보상 가능성'
      ],
      attention_patterns: [
        '패턴 파괴 (예상과 다른 결과)',
        '신기성 자극 (새로운 정보)',
        '위험 신호 (경고 메시지)',
        '소속감 자극 (사회적 연결)'
      ],
      memory_anchors: [
        '숫자와 통계',
        '시각적 이미지 연상',
        '감각적 표현',
        '개인적 경험 연결'
      ]
    }

    // 🎯 한국어 최적화 언어 패턴
    const KOREAN_LANGUAGE_OPTIMIZATION = {
      high_impact_starters: [
        '진짜로', '정말로', '사실은', '놀랍게도', '믿기 어렵지만',
        '그런데', '하지만', '잠깐만', '이상하게도', '갑자기'
      ],
      curiosity_connectors: [
        '그런데 말이야', '근데 여기서 중요한 건', '하지만 진짜 문제는',
        '그런데 이게 전부가 아니야', '더 놀라운 건', '진짜 비밀은'
      ],
      urgency_closers: [
        '지금 당장', '놓치면 후회할', '마지막 기회야', 
        '더 늦기 전에', '바로 지금', '단 하루만'
      ],
      emotional_amplifiers: [
        '완전히', '완벽하게', '진짜로', '엄청나게', '믿을 수 없을 정도로'
      ]
    }

    // 🎬 시각적 연동 최적화
    const VISUAL_SYNC_STRATEGY = {
      cut_points: THREE_SECOND_RULE_CONFIG[length as keyof typeof THREE_SECOND_RULE_CONFIG].timing.map(time => ({
        timestamp: time,
        visual_cue: time === 0 ? '강력한 오프닝 비주얼' :
                   time === THREE_SECOND_RULE_CONFIG[length as keyof typeof THREE_SECOND_RULE_CONFIG].timing[THREE_SECOND_RULE_CONFIG[length as keyof typeof THREE_SECOND_RULE_CONFIG].timing.length - 1] ? 'CTA 비주얼' :
                   '전환 컷'
      })),
      visual_keywords: [
        '보여주는', '드러나는', '나타나는', '보이는', '발견되는',
        '눈에 띄는', '선명한', '뚜렷한', '분명한', '확실한'
      ],
      motion_words: [
        '움직이는', '변화하는', '바뀌는', '발전하는', '성장하는',
        '빨라지는', '커지는', '강해지는', '늘어나는'
      ]
    }

    // 🗣️ 음성 합성 최적화 (TTS 친화적)
    const TTS_OPTIMIZATION = {
      easy_pronunciation: [
        '피해야 할 연음: ㅎ + 모음, 겹받침',
        '선호 구조: 주어 + 서술어, 간단한 문장',
        '정확한 띄어쓰기로 자연스러운 호흡'
      ],
      rhythm_patterns: [
        '강세-약세-강세 패턴',
        '3박자 리듬감',
        '문장 끝 상승/하강 조절'
      ],
      pause_optimization: [
        '쉼표로 자연스러운 호흡점 제공',
        '문장 간 0.3초 여백',
        '구간 간 0.5초 전환 시간'
      ]
    }

    const currentConfig = THREE_SECOND_RULE_CONFIG[length as keyof typeof THREE_SECOND_RULE_CONFIG]
    const currentStrategy = STYLE_STRATEGIES[style as keyof typeof STYLE_STRATEGIES]

    // 🤖 Claude 4급 초고성능 시스템 프롬프트
    const systemPrompt = `당신은 세계 최고의 숏폼 영상 스크립트 마스터입니다. 
3초 룰을 헌법으로 하여 뇌과학과 심리학을 기반으로 한 완벽한 스크립트를 생성해주세요.

${SHORTFORM_RULES}

🧠 뇌과학 기반 설계:
- 도파민 트리거: ${NEUROSCIENCE_CURIOSITY.dopamine_triggers.slice(0, 3).join(', ')}
- 주의집중 패턴: ${NEUROSCIENCE_CURIOSITY.attention_patterns.slice(0, 2).join(', ')}
- 기억 앵커: ${NEUROSCIENCE_CURIOSITY.memory_anchors.slice(0, 2).join(', ')}

🇰🇷 한국어 최적화:
- 임팩트 시작어: ${KOREAN_LANGUAGE_OPTIMIZATION.high_impact_starters.slice(0, 5).join(', ')}
- 궁금증 연결어: ${KOREAN_LANGUAGE_OPTIMIZATION.curiosity_connectors.slice(0, 3).join(', ')}
- 긴급성 마무리: ${KOREAN_LANGUAGE_OPTIMIZATION.urgency_closers.slice(0, 3).join(', ')}

🎯 타겟 설정:
- 언어: ${language === 'ko' ? '한국어' : language === 'en' ? '영어' : '일본어'}
- 길이: ${currentConfig.duration}초 (${currentConfig.segments}개 구간)
- 스타일: ${style} - ${currentStrategy.hook}
- 감정 트리거: ${EMOTIONAL_TRIGGERS[emotional_trigger as keyof typeof EMOTIONAL_TRIGGERS]}

🔥 절대 준수 사항:
1. 정확히 ${currentConfig.segments}개 문장 (구간별 1문장)
2. 각 문장은 6-10단어, 8-15음절 (3초 안에 읽기)
3. 첫 문장: 3초 안에 100% 관심 사로잡기
4. 매 문장: 다음이 궁금해지는 연결고리
5. 마지막 문장: 즉시 행동하게 만드는 강력한 유도

🎬 구간별 에너지 설계:
${currentConfig.structure.split('-').map((part, index) => 
  `${index + 1}구간(${currentConfig.timing[index]}초): ${part} [에너지: ${currentConfig.energy_curve[index]}%]`
).join('\n')}

🎥 시각적 연동 고려:
- 각 구간마다 강력한 비주얼 컷 변경점
- 시각적 키워드 포함: ${VISUAL_SYNC_STRATEGY.visual_keywords.slice(0, 3).join(', ')}
- 모션 단어 활용: ${VISUAL_SYNC_STRATEGY.motion_words.slice(0, 3).join(', ')}

🗣️ TTS 최적화:
- 발음하기 쉬운 단어 선택
- 자연스러운 호흡점 배치  
- 리듬감 있는 문장 구조

💡 고급 심리학 기법:
- ${ADVANCED_HOOKS.slice(0, 3).map(hook => hook.name).join(', ')}
- 제이가르닉 효과 (미완성 루프)
- 사회적 증명과 권위
- 희소성과 긴급성

${keywords.length > 0 ? `🎯 필수 키워드: ${keywords.join(', ')}` : ''}
${custom_requirements ? `📝 특별 요구사항: ${custom_requirements}` : ''}`

    const userPrompt = `주제: "${subject}"

위의 모든 조건을 완벽히 준수하여 ${currentConfig.segments}개 구간의 초고성능 스크립트를 생성해주세요.

⚡ 초중요: 각 구간은 반드시 6-10단어로 제한하되, 뇌과학적으로 다음 구간이 궁금해지도록 설계하세요.

응답 형식:
[1구간] (0-3초): 문장 (단어수)
[2구간] (3-6초): 문장 (단어수)  
[3구간] (6-9초): 문장 (단어수)
[4구간] (9-12초): 문장 (단어수)
[5구간] (12-15초): 문장 (단어수)

각 구간별로 정확히 6-10단어, 뇌과학 기반 궁금증 유발, 시각적 연동성을 모두 만족시켜 주세요.`

    // 🚀 Claude 4 Sonnet API 호출
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', // 🔥 Claude 4 Sonnet 최신 모델
        max_tokens: 2000,
        temperature: 0.7, // 창의성 향상
        messages: [
          { 
            role: 'user', 
            content: `${systemPrompt}\n\n${userPrompt}` 
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Claude API 오류:', response.status, errorText)
      throw new Error(`Claude API 오류: ${response.status}`)
    }

    const result = await response.json()
    const generatedScript = result.content[0]?.text?.trim()

    if (!generatedScript) {
      throw new Error('스크립트 생성에 실패했습니다.')
    }

    // 🔍 3초 룰 검증 및 구간 분석
    const segments = parseScriptSegments(generatedScript, currentConfig)
    const validation = validateThreeSecondRule(segments)

    // 📊 고급 분석
    const analysis = {
      total_segments: segments.length,
      target_segments: currentConfig.segments,
      three_second_compliance: validation.compliant,
      average_words_per_segment: validation.averageWords,
      curiosity_score: calculateCuriosityScore(segments),
      emotional_intensity: calculateEmotionalIntensity(segments),
      hook_strength: calculateHookStrength(segments[0]?.text || ''),
      readability_score: calculateReadabilityScore(segments),
      estimated_retention: estimateRetention(segments)
    }

    return NextResponse.json({
      status: 200,
      message: "3초 룰 기반 스크립트 생성 완료",
      data: {
        script: segments.map(s => s.text).join(' '),
        segments: segments,
        analysis: analysis,
        compliance: validation,
        config: currentConfig,
        recommendations: generateImprovementRecommendations(analysis)
      }
    })

  } catch (error) {
    console.error('스크립트 생성 오류:', error)
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : '스크립트 생성 중 오류가 발생했습니다.',
      data: null
    }, { status: 500 })
  }
}

// 🔍 스크립트 구간 파싱 함수
function parseScriptSegments(script: string, config: any) {
  const segments = []
  const lines = script.split('\n').filter(line => line.trim())
  
  let segmentIndex = 0
  for (const line of lines) {
    const match = line.match(/\[구간(\d+)\].*?:\s*(.+)/)
    if (match) {
      const text = match[2].trim()
      segments.push({
        id: segmentIndex,
        text: text,
        start_time: config.timing[segmentIndex] || segmentIndex * 3,
        end_time: config.timing[segmentIndex + 1] || (segmentIndex + 1) * 3,
        word_count: text.split(/\s+/).length,
        estimated_duration: text.split(/\s+/).length * 0.4 // 초당 2.5단어 기준
      })
      segmentIndex++
    }
  }
  
  return segments
}

// ✅ 3초 룰 검증 함수
function validateThreeSecondRule(segments: any[]) {
  const wordCounts = segments.map(s => s.word_count)
  const compliantSegments = segments.filter(s => s.word_count >= 6 && s.word_count <= 10)
  
  return {
    compliant: compliantSegments.length === segments.length,
    compliance_rate: (compliantSegments.length / segments.length) * 100,
    averageWords: wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length,
    violations: segments.filter(s => s.word_count < 6 || s.word_count > 10)
  }
}

// 🧠 궁금증 점수 계산
function calculateCuriosityScore(segments: any[]) {
  const curiosityWords = ['왜', '어떻게', '무엇', '언제', '어디서', '비밀', '숨겨진', '놀라운', '충격적인']
  let score = 0
  
  segments.forEach(segment => {
    curiosityWords.forEach(word => {
      if (segment.text.includes(word)) score += 10
    })
    
    // 물음표로 끝나는 문장
    if (segment.text.endsWith('?')) score += 15
    
    // 미완성 문장 패턴
    if (segment.text.includes('그런데') || segment.text.includes('하지만')) score += 10
  })
  
  return Math.min(100, score)
}

// 💫 감정 강도 계산
function calculateEmotionalIntensity(segments: any[]) {
  const emotionalWords = ['놀라운', '충격적인', '위험한', '특별한', '독특한', '필수적인', '중요한']
  let intensity = 0
  
  segments.forEach(segment => {
    emotionalWords.forEach(word => {
      if (segment.text.includes(word)) intensity += 5
    })
    
    // 감탄사
    if (segment.text.includes('!')) intensity += 3
  })
  
  return Math.min(100, intensity)
}

// 🎣 후킹 강도 계산
function calculateHookStrength(firstSegment: string) {
  let strength = 0
  
  // 질문으로 시작
  if (firstSegment.includes('?')) strength += 25
  
  // 충격적인 단어
  const shockWords = ['믿기', '놀라운', '충격', '비밀', '금지된']
  shockWords.forEach(word => {
    if (firstSegment.includes(word)) strength += 15
  })
  
  // 숫자나 통계
  if (/\d+/.test(firstSegment)) strength += 10
  
  return Math.min(100, strength)
}

// 📖 가독성 점수 계산
function calculateReadabilityScore(segments: any[]) {
  const avgWordsPerSegment = segments.reduce((sum, s) => sum + s.word_count, 0) / segments.length
  const idealRange = avgWordsPerSegment >= 6 && avgWordsPerSegment <= 10
  
  return idealRange ? 100 : Math.max(0, 100 - Math.abs(avgWordsPerSegment - 8) * 10)
}

// 📈 시청 지속률 예측
function estimateRetention(segments: any[]) {
  let retention = 100
  
  segments.forEach((segment, index) => {
    // 각 구간마다 관심도 하락 계산
    if (segment.word_count > 10) retention -= 5 // 너무 긴 문장
    if (index > 0 && !hasConnectionWord(segment.text)) retention -= 3 // 연결성 부족
  })
  
  return Math.max(20, retention) // 최소 20% 보장
}

// 🔗 연결어 확인
function hasConnectionWord(text: string) {
  const connectionWords = ['그런데', '하지만', '그리고', '그래서', '또한', '심지어']
  return connectionWords.some(word => text.includes(word))
}

// 💡 개선 제안 생성
function generateImprovementRecommendations(analysis: any) {
  const recommendations = []
  
  if (analysis.three_second_compliance < 100) {
    recommendations.push('일부 구간이 3초 룰을 위반했습니다. 6-10단어로 조정하세요.')
  }
  
  if (analysis.curiosity_score < 70) {
    recommendations.push('궁금증 유발 요소를 더 추가하세요. (질문, 미완성 정보 등)')
  }
  
  if (analysis.hook_strength < 80) {
    recommendations.push('첫 구간의 후킹 강도를 높이세요. (충격적 사실, 질문 등)')
  }
  
  if (analysis.estimated_retention < 80) {
    recommendations.push('구간 간 연결성을 강화하여 시청 지속률을 높이세요.')
  }
  
  return recommendations
}

// GET 요청: 설정 옵션들 반환
export async function GET() {
  return NextResponse.json({
    status: 200,
    message: "3초 룰 기반 스크립트 생성 옵션",
    data: {
      three_second_rule: "각 구간 6-10단어, 3초 안에 읽기 가능",
      lengths: {
        short: "15초 (5구간)",
        medium: "30초 (10구간)",
        long: "60초 (20구간)"
      },
      advanced_features: {
        curiosity_triggers: "궁금증 유발 전략",
        emotional_triggers: "감정적 트리거",
        hook_strategies: "고급 후킹 기법",
        retention_optimization: "시청 지속률 최적화"
      }
    }
  })
}