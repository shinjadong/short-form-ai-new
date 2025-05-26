import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createApiSupabase } from '@/lib/supabase-server'
import { Database } from '@/types/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, title, language = 'ko-KR' } = body

    if (!subject) {
      return NextResponse.json(
        { success: false, error: '주제를 입력해주세요.' },
        { status: 400 }
      )
    }

    // Supabase 클라이언트 생성
    const supabase = createApiSupabase(request)

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // 사용자 프로필 및 사용량 확인
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 사용량 제한 체크
    const { data: canCreate, error: usageError } = await supabase
      .rpc('check_user_usage_limit', { user_uuid: user.id })

    if (usageError) {
      console.error('사용량 체크 오류:', usageError)
      return NextResponse.json(
        { success: false, error: '사용량 확인 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (!canCreate) {
      return NextResponse.json(
        { 
          success: false, 
          error: `월 사용량 한도(${userProfile.usage_limit}회)에 도달했습니다. 구독을 업그레이드하거나 다음 달을 기다려주세요.`,
          usage_limit_reached: true 
        },
        { status: 429 }
      )
    }

    // OpenAI로 스크립트 생성
    const scriptPrompt = `
다음 주제로 쇼트폼 비디오용 스크립트를 작성해주세요.

주제: ${subject}
언어: ${language}

요구사항:
- 30초 내외 분량의 스크립트
- 짧고 임팩트 있는 문장들로 구성
- 시청자의 관심을 끌 수 있는 내용
- 자연스럽고 대화체로 작성
- 5-7개 단락으로 구성

스크립트만 작성해주세요. 다른 설명은 필요 없습니다.
    `.trim()

    const scriptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system", 
          content: "당신은 전문 쇼트폼 비디오 스크립트 작가입니다. 간결하고 임팩트 있는 스크립트를 작성합니다."
        },
        {
          role: "user",
          content: scriptPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const script = scriptResponse.choices[0]?.message?.content || ''

    if (!script) {
      throw new Error('스크립트 생성에 실패했습니다.')
    }

    // 키워드 생성
    const keywordsPrompt = `
다음 비디오 스크립트에서 영상 검색에 사용할 키워드 5개를 추출해주세요.

주제: ${subject}
스크립트: ${script}

요구사항:
- 영어로 된 키워드 5개
- 비디오 검색에 적합한 키워드
- 쉼표로 구분해서 나열
- 키워드만 작성하고 다른 설명은 필요 없음

예시: healthy lifestyle, balanced diet, exercise, wellness, meditation
    `.trim()

    const keywordsResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "당신은 비디오 키워드 추출 전문가입니다. 정확하고 검색에 적합한 키워드를 생성합니다."
        },
        {
          role: "user", 
          content: keywordsPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    })

    const keywordsText = keywordsResponse.choices[0]?.message?.content || ''
    const keywords = keywordsText.split(',').map(k => k.trim()).filter(k => k.length > 0)

    // 비디오 프로젝트 생성
    const projectData: Database['public']['Tables']['video_projects']['Insert'] = {
      user_id: user.id,
      title: title || `${subject} - ${new Date().toLocaleDateString()}`,
      subject: subject,
      script: script,
      status: 'draft',
      settings: {
        language: language,
        keywords: keywords,
        generated_at: new Date().toISOString()
      }
    }

    const { data: project, error: projectError } = await supabase
      .from('video_projects')
      .insert(projectData)
      .select()
      .single()

    if (projectError) {
      console.error('프로젝트 생성 오류:', projectError)
      return NextResponse.json(
        { success: false, error: '프로젝트 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 사용량 증가
    const { error: incrementError } = await supabase
      .rpc('increment_user_usage', { user_uuid: user.id })

    if (incrementError) {
      console.error('사용량 증가 오류:', incrementError)
      // 사용량 증가 실패는 치명적이지 않으므로 경고만 로그
    }

    return NextResponse.json({
      success: true,
      project: project,
      script: script,
      keywords: keywords,
      remaining_usage: Math.max(0, (userProfile.usage_limit || 0) - (userProfile.usage_count || 0) - 1)
    })

  } catch (error) {
    console.error('스크립트 생성 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '스크립트 생성 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
}
