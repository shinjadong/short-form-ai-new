import { NextRequest, NextResponse } from 'next/server'

// 토스페이먼츠 시크릿 키 (계약 완료 후 실제 키로 변경 필요)
// 실제 상점아이디(MID): jadongvb49
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6'

export async function POST(request: NextRequest) {
  try {
    const { customerKey, authKey, plan, amount, userId } = await request.json()

    console.log('빌링키 발급 요청:', { customerKey, authKey, plan, amount, userId })

    // 토스페이먼츠 빌링키 발급 API 호출
    const tossResponse = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey,
        authKey,
      }),
    })

    const billingData = await tossResponse.json()

    if (!tossResponse.ok) {
      console.error('빌링키 발급 실패:', billingData)
      return NextResponse.json({
        success: false,
        message: billingData.message || '빌링키 발급에 실패했습니다.',
        error: billingData
      }, { status: 400 })
    }

    console.log('빌링키 발급 성공:', billingData)

    // TODO: 실제로는 데이터베이스에 빌링키와 사용자 정보를 저장해야 합니다
    // 예시:
    // await saveBillingKey({
    //   userId,
    //   billingKey: billingData.billingKey,
    //   customerKey,
    //   plan,
    //   cardInfo: billingData.card,
    //   createdAt: new Date()
    // })

    return NextResponse.json({
      success: true,
      billingKey: billingData.billingKey,
      card: billingData.card,
      customerKey: billingData.customerKey,
      createdAt: billingData.createdAt
    })

  } catch (error) {
    console.error('빌링키 발급 처리 중 오류:', error)
    return NextResponse.json({
      success: false,
      message: '빌링키 발급 중 서버 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}