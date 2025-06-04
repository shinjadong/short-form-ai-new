import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 시크릿 키 가져오기
const secretKey = process.env.TOSS_SECRET_KEY || "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6"

// 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
// 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
// @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
const encryptedSecretKey = "Basic " + Buffer.from(secretKey + ":").toString("base64")

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json()

    // 결제 승인 API를 호출하세요.
    // 결제를 승인하면 결제수단에서 금액이 차감돼요.
    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: encryptedSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      }),
    })

    const paymentData = await response.json()
    console.log('토스페이먼츠 API 응답:', paymentData)

    if (!response.ok) {
      console.error('결제 승인 실패:', paymentData)
      
      // 실패 응답 반환 (리다이렉트가 아닌 JSON)
      return NextResponse.json({
        success: false,
        error: {
          code: paymentData.code || 'PAYMENT_FAILED',
          message: paymentData.message || '결제 승인에 실패했습니다.'
        }
      }, { status: response.status })
    }

    // 결제 완료 - Supabase에 결제 정보 저장
    try {
      // payments 테이블에 결제 정보 저장
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          payment_key: paymentData.paymentKey,
          order_id: paymentData.orderId,
          user_id: paymentData.metadata?.userId || null,
          plan_id: paymentData.metadata?.planId || null,
          billing_period: paymentData.metadata?.billingPeriod || 'monthly',
          amount: paymentData.totalAmount,
          method: paymentData.method,
          status: paymentData.status,
          requested_at: paymentData.requestedAt,
          approved_at: paymentData.approvedAt,
          card_company: paymentData.card?.company || null,
          card_number: paymentData.card?.number || null,
          raw_data: paymentData
        })
        .select()
        .single()

      if (paymentError) {
        console.error('결제 정보 저장 실패:', paymentError)
        // 결제는 성공했지만 DB 저장 실패 - 수동 처리 필요
      }

      // 구독이 있는 경우 subscriptions 테이블 업데이트
      if (paymentData.metadata?.userId && paymentData.metadata?.planId) {
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: paymentData.metadata.userId,
            plan_id: paymentData.metadata.planId,
            payment_id: payment?.id,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: paymentData.metadata.billingPeriod === 'yearly' 
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })

        if (subscriptionError) {
          console.error('구독 정보 업데이트 실패:', subscriptionError)
        }
      }
    } catch (dbError) {
      console.error('DB 처리 중 오류:', dbError)
      // 결제는 성공했으므로 에러를 반환하지 않고 로그만 남김
    }

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      payment: paymentData
    }, { status: 200 })
    
  } catch (error) {
    console.error('결제 승인 처리 중 오류:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '결제 승인 처리 중 오류가 발생했습니다.'
        }
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Payment confirmation endpoint is working' },
    { status: 200 }
  )
}
