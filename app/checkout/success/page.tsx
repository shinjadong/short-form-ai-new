'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Home, FileText } from 'lucide-react'
import Link from 'next/link'

interface PaymentData {
  paymentKey: string
  orderId: string
  paymentType: string
  status: string
  requestedAt: string
  approvedAt: string
  card?: {
    company: string
    number: string
    installmentPlanMonths: number
    isInterestFree: boolean
    approveNo: string
  }
  virtualAccount?: {
    accountNumber: string
    bank: string
    customerName: string
    dueDate: string
  }
  transfer?: {
    bank: string
    settlementStatus: string
  }
  mobilePhone?: {
    customerMobilePhone: string
    settlementStatus: string
    receiptUrl: string
  }
  receipt: {
    url: string
  }
  totalAmount: number
  method: string
  orderName: string
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [responseData, setResponseData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function confirmPayment() {
      try {
        const paymentKey = searchParams.get('paymentKey')
        const orderId = searchParams.get('orderId')
        const amount = searchParams.get('amount')

        if (!paymentKey || !orderId || !amount) {
          throw new Error('필수 파라미터가 누락되었습니다.')
        }

        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || '결제 승인에 실패했습니다.')
        }

        setResponseData(data.payment)
      } catch (error: any) {
        setError(error.message)
        // 에러 발생 시 실패 페이지로 리다이렉트
        setTimeout(() => {
          router.push(`/checkout/fail?code=PAYMENT_CONFIRM_ERROR&message=${encodeURIComponent(error.message)}`)
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [searchParams, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <div className="text-red-500 text-lg font-semibold mb-2">오류가 발생했습니다</div>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">잠시 후 실패 페이지로 이동합니다...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!responseData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 성공 메시지 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
          <p className="text-lg text-gray-600">Shot Form AI 서비스를 이용해 주셔서 감사합니다.</p>
        </div>

        {/* 결제 정보 카드 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">결제 상세 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">주문명</p>
                <p className="font-medium text-gray-900">{responseData.orderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">결제 금액</p>
                <p className="font-medium text-gray-900">₩{formatPrice(responseData.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">주문번호</p>
                <p className="font-medium text-gray-900 text-sm">{responseData.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">결제 일시</p>
                <p className="font-medium text-gray-900 text-sm">{formatDate(responseData.approvedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">결제 수단</p>
                <p className="font-medium text-gray-900">{responseData.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">결제 상태</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {responseData.status === 'DONE' ? '완료' : responseData.status}
                </Badge>
              </div>
            </div>

            {/* 카드 결제 정보 */}
            {responseData.card && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">카드 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">카드사</p>
                    <p className="font-medium text-gray-900">{responseData.card.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">카드 번호</p>
                    <p className="font-medium text-gray-900">{responseData.card.number}</p>
                  </div>
                  {responseData.card.installmentPlanMonths > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">할부</p>
                      <p className="font-medium text-gray-900">{responseData.card.installmentPlanMonths}개월</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">승인 번호</p>
                    <p className="font-medium text-gray-900">{responseData.card.approveNo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 가상계좌 정보 */}
            {responseData.virtualAccount && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">가상계좌 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">입금 은행</p>
                    <p className="font-medium text-gray-900">{responseData.virtualAccount.bank}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">계좌 번호</p>
                    <p className="font-medium text-gray-900">{responseData.virtualAccount.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">예금주</p>
                    <p className="font-medium text-gray-900">{responseData.virtualAccount.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">입금 기한</p>
                    <p className="font-medium text-gray-900">{formatDate(responseData.virtualAccount.dueDate)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 영수증 */}
            {responseData.receipt && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={responseData.receipt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <FileText className="w-4 h-4" />
                  영수증 보기
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 다음 단계 안내 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">다음 단계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <p className="text-gray-700">
                  가입하신 이메일로 결제 확인서와 서비스 이용 안내가 발송되었습니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <p className="text-gray-700">
                  대시보드에서 구독 정보를 확인하고 서비스를 이용할 수 있습니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <p className="text-gray-700">
                  문의사항이 있으시면 support@shotform.ai로 연락해 주세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              대시보드로 이동
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 판매자 정보 */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>판매자: 제이앤유통 (대표: 신예준) | 사업자등록번호: 609-41-95762</p>
          <p className="mt-1">서비스 문의: support@shotform.ai | 환불 정책: 이용약관 참조</p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">로딩 중...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
