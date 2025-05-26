import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json(
        { error: '텍스트를 입력해주세요.' },
        { status: 400 }
      )
    }

    // OpenAI를 사용하여 키워드 추출 (gpt-4o 사용)
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 텍스트에서 핵심 키워드를 추출하는 전문가입니다. 주어진 텍스트에서 가장 중요한 키워드 3-5개를 추출해야 합니다."
        },
        {
          role: "user",
          content: `다음 텍스트에서 웹 검색에 활용할 가장 핵심적인 키워드 3-5개를 추출해주세요. 각 키워드는 1-3단어로 구성되어야 하고, 배열 형태로 반환해주세요. 
          
          텍스트: "${text}"`
        }
      ],
      temperature: 0.1,
      max_tokens: 80,
    })

    // 응답에서 키워드 추출 (JSON 형식으로 반환된 경우 처리)
    const content = response.choices[0].message.content
    let keywords: string[] = []

    if (content) {
      try {
        // JSON 형식으로 반환된 경우 파싱 시도
        if (content.includes('[') && content.includes(']')) {
          const jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1)
          keywords = JSON.parse(jsonStr)
        } else {
          // 콤마로 구분된 경우
          keywords = content.split(',').map(kw => kw.trim())
        }
      } catch (e) {
        // 파싱 실패시 텍스트 자체를 하나의 키워드로 사용
        keywords = [text]
      }
    }

    // 키워드가 없으면 텍스트 자체를 키워드로 사용
    if (keywords.length === 0) {
      keywords = [text]
    }

    return NextResponse.json({
      message: '키워드 추출 완료',
      keywords: keywords
    })
  } catch (error: any) {
    console.error('키워드 추출 오류:', error)
    return NextResponse.json(
      { 
        error: `키워드 추출 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}` 
      },
      { status: 500 }
    )
  }
} 