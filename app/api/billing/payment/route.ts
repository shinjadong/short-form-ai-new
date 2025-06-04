import { NextRequest, NextResponse } from 'next/server'

// 토스페이먼츠 시크릿 키 (계약 완료 후 실제 키로 변경 필요)
// 실제 상점아이디(MID): jadongvb49
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6'

export async function POST(request: NextRequest) {
  try {
    const { customerKey, amount, orderId, orderName, plan, userId } = await request.json()

    console.log('빌링 결제 실행 요청:', { customerKey, amount, orderId, orderName, plan, userId })

    // 토스페이먼츠 빌링 결제 실행 API 호출
    const tossResponse = await fetch(`https://api.tosspayments.com/v1/billing/${customerKey}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderId,
        orderName,
        customerEmail: '', // 실제로는 사용자 이메일 사용
        customerName: '', // 실제로는 사용자 이름 사용
      }),
    })

    const paymentData = await tossResponse.json()

    if (!tossResponse.ok) {
      console.error('빌링 결제 실행 실패:', paymentData)
      return NextResponse.json({
        success: false,
        message: paymentData.message || '결제 실행에 실패했습니다.',
        error: paymentData
      }, { status: 400 })
    }

    console.log('빌링 결제 실행 성공:', paymentData)

    // TODO: 실제로는 데이터베이스에 결제 정보를 저장해야 합니다
    // 예시:
    // await savePayment({
    //   userId,
    //   paymentKey: paymentData.paymentKey,
    //   orderId,
    //   amount,
    //   plan,
    //   status: 'DONE',
    //   paidAt: new Date(paymentData.approvedAt),
    //   method: 'billing'
    // })

    return NextResponse.json({
      success: true,
      payment: paymentData
    })

  } catch (error) {
    console.error('빌링 결제 실행 중 오류:', error)
    return NextResponse.json({
      success: false,
      message: '결제 실행 중 서버 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}