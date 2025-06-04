'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Calendar, CreditCard, ArrowLeft } from 'lucide-react'

function BillingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, userProfile } = useAuth()
  
  const [responseData, setResponseData] = useState<any>(null)
  const [billingConfirmed, setBillingConfirmed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const customerKey = searchParams.get('customerKey')
  const authKey = searchParams.get('authKey')
  const plan = searchParams.get('plan')
  const period = searchParams.get('period')

  useEffect(() => {
    // 빌링키 발급
    async function issueBillingKey() {
      if (!customerKey || !authKey) {
        throw new Error('필수 파라미터가 누락되었습니다.')
      }

      const requestData = {
        customerKey: customerKey,
        authKey: authKey,
      }

      const response = await fetch('/api/billing/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const json = await response.json()

      if (!response.ok) {
        throw { message: json.message, code: json.code }
      }

      return json
    }

    if (customerKey && authKey) {
      issueBillingKey()
        .then(function (data) {
          setResponseData(data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message || '빌링키 발급에 실패했습니다.')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [customerKey, authKey])

  // 정기결제 강제 실행 (테스트용)
  const handleConfirmBilling = async () => {
    if (!customerKey) return

    try {
      const requestData = {
        customerKey: customerKey,
        amount: plan === 'pro' ? 99000 : plan === 'hobby' ? 15000 : 299000,
        orderId: 'monthly_' + Date.now(),
        orderName: `Shot Form AI ${plan} 월간 구독`,
        customerEmail: user?.email || 'customer@example.com',
        customerName: userProfile?.full_name || user?.email?.split('@')[0] || '고객',
      }

      const response = await fetch('/api/billing/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const json = await response.json()

      if (!response.ok) {
        throw { message: json.message, code: json.code }
      }

      setBillingConfirmed(true)
      setResponseData(json)
    } catch (err: any) {
      setError(err.message || '정기결제 실행에 실패했습니다.')
    }
  }

  const getPlanName = (planId: string) => {
    switch (planId) {
      case 'hobby': return 'Hobby'
      case 'pro': return 'Pro'
      case 'enterprise': return 'Enterprise'
      default: return 'Pro'
    }
  }

  const getPlanPrice = (planId: string) => {
    switch (planId) {
      case 'hobby': return 15000
      case 'pro': return 99000
      case 'enterprise': return 299000
      default: return 99000
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>빌링키 발급 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/checkout')} className="bg-blue-600 hover:bg-blue-700 text-white">
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              대시보드로 이동
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {billingConfirmed ? '정기결제가 완료되었습니다!' : '빌링키 발급이 완료되었습니다!'}
          </h1>
          <p className="text-gray-600">
            {billingConfirmed 
              ? 'Shot Form AI 구독이 활성화되었습니다.' 
              : 'Shot Form AI 정기결제 설정이 완료되었습니다.'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <CreditCard className="w-5 h-5" />
            구독 정보
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">플랜</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{getPlanName(plan || 'pro')}</span>
                <Badge className="bg-blue-100 text-blue-800">월간 구독</Badge>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제 금액</span>
              <span className="font-semibold text-gray-900">₩{getPlanPrice(plan || 'pro').toLocaleString()}/월</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">다음 결제일</span>
              <span className="font-semibold text-gray-900">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상태</span>
              <span className="text-green-600 font-semibold">활성</span>
            </div>
          </div>
        </div>

        {/* 테스트용 정기결제 실행 버튼 */}
        {!billingConfirmed && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-4">
              * 테스트 환경에서는 아래 버튼으로 정기결제를 강제 실행할 수 있습니다.
            </p>
            <Button 
              onClick={handleConfirmBilling}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              정기결제 강제 실행하기 (테스트)
            </Button>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            대시보드로 이동
          </Button>
          <Button 
            onClick={() => window.open('https://docs.tosspayments.com/guides/v2/billing/integration', '_blank')}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            연동 문서 보기
          </Button>
        </div>

        {/* 응답 데이터 (개발용) */}
        {responseData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Response Data (개발용)</h3>
            <pre className="text-xs text-gray-600 overflow-auto bg-gray-50 p-3 rounded">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}

        {/* 판매자 정보 */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>판매자: 제이앤유통 (대표: 신예준) | 사업자등록번호: 609-41-95762</p>
          <p className="mt-1">
            정기결제는 매월 같은 날짜에 자동으로 진행됩니다. 
            구독 취소는 언제든지 대시보드에서 가능합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">로딩 중...</div>}>
      <BillingContent />
    </Suspense>
  )
}
