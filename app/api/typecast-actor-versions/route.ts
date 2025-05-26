import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const actorId = searchParams.get('actorId')

    if (!actorId) {
      return NextResponse.json({
        success: false,
        error: 'actorId 매개변수가 필요합니다'
      }, { status: 400 })
    }

    const apiToken = process.env.TYPECAST_API_TOKEN
    if (!apiToken) {
      return NextResponse.json({
        success: false,
        error: 'TypeCast API 토큰이 설정되지 않았습니다'
      }, { status: 500 })
    }

    // TypeCast API 호출
    const response = await fetch(`https://typecast.ai/api/actor/${actorId}/versions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('TypeCast API 오류:', response.status, errorText)
      return NextResponse.json({
        success: false,
        error: `TypeCast API 오류: ${response.status}`
      }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      versions: data.result || []
    })

  } catch (error) {
    console.error('TypeCast 액터 버전 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
    }, { status: 500 })
  }
} 