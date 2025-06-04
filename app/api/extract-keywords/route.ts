import { NextRequest, NextResponse } from 'next/server'
import { createApiSupabase } from '@/lib/supabase-server'
import { generateKeywords } from '@/lib/api-clients'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { script, subject } = body

    if (!script) {
      return NextResponse.json(
        { success: false, error: '스크립트를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!subject) {
      return NextResponse.json(
        { success: false, error: '주제를 입력해주세요.' },
        { status: 400 }
      )
    }

    // Supabase 클라이언트 생성 (인증 확인용)
    const supabase = createApiSupabase(request)

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // 🚀 OpenAI 직접 호출로 키워드 생성 (3초 완료)
    console.log('키워드 생성 시작:', { script: script.substring(0, 100) + '...', subject })
    
    const startTime = Date.now()
    const keywords = await generateKeywords(script, subject)
    const duration = Date.now() - startTime

    console.log(`키워드 생성 완료 (${duration}ms):`, keywords)

    return NextResponse.json({
      success: true,
      keywords,
      processing_time: duration,
      message: `키워드 ${keywords.length}개가 생성되었습니다.`
    })

  } catch (error) {
    console.error('키워드 추출 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '키워드 추출 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
} 