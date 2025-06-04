import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 백엔드 API 호출 (로컬 개발 환경에서는 localhost:8000)
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000"
    const response = await fetch(`${backendUrl}/content-analyzer/suggest-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || "콘텐츠 분석 요청 처리 중 오류가 발생했습니다." 
        },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("콘텐츠 분석 API 오류:", error)
    return NextResponse.json(
      { success: false, message: "콘텐츠 분석 처리 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get("taskId")
    
    if (!taskId) {
      return NextResponse.json(
        { success: false, message: "작업 ID가 제공되지 않았습니다." },
        { status: 400 }
      )
    }
    
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000"
    const response = await fetch(`${backendUrl}/content-analyzer/task-status/${taskId}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || "작업 상태 조회 중 오류가 발생했습니다." 
        },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("작업 상태 조회 API 오류:", error)
    return NextResponse.json(
      { success: false, message: "작업 상태 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 