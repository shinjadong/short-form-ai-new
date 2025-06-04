'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Shield, Check } from 'lucide-react'
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk'

interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'hobby',
    name: 'Hobby',
    description: 'AI 영상 제작 기본 기능',
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    features: [
      '월 10개 영상 생성',
      '기본 템플릿 제공',
      'HD 화질 다운로드',
      '기본 고객 지원'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Shot Form AI의 모든 기능',
    monthlyPrice: 99000,
    yearlyPrice: 990000,
    popular: true,
    features: [
      '무제한 영상 생성',
      '프리미엄 템플릿',
      '4K 화질 다운로드',
      'AI 음성 생성',
      '우선 고객 지원',
      '상업적 이용 가능'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: '대규모 팀을 위한 고급 기능',
    monthlyPrice: 299000,
    yearlyPrice: 2990000,
    features: [
      'Pro의 모든 기능',
      '팀 협업 도구',
      '전용 계정 매니저',
      'API 접근',
      '맞춤형 브랜딩',
      '24/7 프리미엄 지원'
    ]
  }
]

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [paymentWidget, setPaymentWidget] = useState<any | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const agreementRef = useRef<HTMLDivElement>(null)

  // URL 파라미터에서 플랜 정보 가져오기
  useEffect(() => {
    const planId = searchParams.get('plan') || 'pro'
    const billing = searchParams.get('billing') || 'monthly'
    
    const plan = PRICING_PLANS.find(p => p.id === planId) || PRICING_PLANS[1]
    setSelectedPlan(plan)
    setBillingPeriod(billing as 'monthly' | 'yearly')
  }, [searchParams])

  // 로그인 체크
  useEffect(() => {
    if (!user && customerInfo.email === '') {
      // 비로그인 사용자의 경우 기본값 설정
      setCustomerInfo(prev => ({
        ...prev,
        name: '',
        email: '',
        phone: ''
      }))
    } else if (user) {
      // 로그인한 사용자의 경우 정보 자동 입력
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || '',
        // name과 phone은 사용자가 직접 입력하도록 유지
      }))
    }
  }, [user])

  // 토스페이먼츠 위젯 초기화
  useEffect(() => {
    async function initializePaymentWidgets() {
      if (!selectedPlan) return

      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
        const customerKey = user?.id || 'customer_' + Date.now()
        
        const tossPayments = await loadTossPayments(clientKey)
        
        // 일반 결제 위젯 (월간/연간 모두 사용)
        const paymentWidget = tossPayments.widgets({
          customerKey: customerKey,
        })

        setPaymentWidget(paymentWidget)
      } catch (error) {
        console.error('결제 위젯 초기화 실패:', error)
      }
    }

    initializePaymentWidgets()
  }, [selectedPlan, user])

  // 위젯 렌더링
  useEffect(() => {
    async function renderWidget() {
      if (!selectedPlan || !paymentWidget) return

      try {
        const amount = billingPeriod === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice

        // 금액 설정
        await paymentWidget.setAmount({
          currency: 'KRW',
          value: amount,
        })

        // 결제 UI 렌더링 - CSS 선택자 문자열 사용
        await paymentWidget.renderPaymentMethods({
          selector: '#payment-widget',
          variantKey: 'DEFAULT',
        })

        // 이용약관 UI 렌더링 - CSS 선택자 문자열 사용
        await paymentWidget.renderAgreement({
          selector: '#agreement-widget',
          variantKey: 'AGREEMENT'
        })
      } catch (error) {
        console.error('위젯 렌더링 실패:', error)
      }
    }

    renderWidget()
  }, [billingPeriod, selectedPlan, paymentWidget])

  const handlePayment = async () => {
    if (!selectedPlan || !customerInfo.name || !customerInfo.email) {
      alert('고객 정보를 모두 입력해주세요.')
      return
    }

    setIsProcessing(true)

    try {
      const amount = billingPeriod === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice
      const orderId = 'order_' + Date.now()
      const orderName = `${selectedPlan.name} ${billingPeriod === 'monthly' ? '월간' : '연간'} 구독`

      // 결제 요청
      await paymentWidget.requestPayment({
        orderId: orderId,
        orderName: orderName,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerMobilePhone: customerInfo.phone,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        // 메타데이터 추가 - 결제 승인 시 사용
        metadata: {
          userId: user?.id || null,
          planId: selectedPlan.id,
          billingPeriod: billingPeriod,
        }
      })
    } catch (error: any) {
      console.error('결제 요청 실패:', error)
      
      // 에러 처리
      if (error.code === 'USER_CANCEL') {
        // 사용자가 결제를 취소한 경우
        alert('결제를 취소하셨습니다.')
      } else {
        alert('결제 요청 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  if (!selectedPlan) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">로딩 중...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로가기
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">SSL 보안 결제</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">결제하기</h1>
          <p className="text-lg text-gray-600">
            Shot Form AI {selectedPlan.name} 플랜으로 시작하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 플랜 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h2>
              {selectedPlan.popular && (
                <Badge className="bg-blue-100 text-blue-800">인기</Badge>
              )}
            </div>
            <p className="text-gray-600 mb-6">{selectedPlan.description}</p>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  ₩{formatPrice(billingPeriod === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice)}
                </span>
                <span className="text-gray-500">
                  {billingPeriod === 'monthly' ? '/월' : '/년'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="text-sm text-green-600 mt-2">
                  월간 대비 {Math.round((1 - (selectedPlan.yearlyPrice / 12) / selectedPlan.monthlyPrice) * 100)}% 절약
                </p>
              )}
            </div>

            <div className="space-y-3 mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">포함된 기능:</h4>
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* 결제 방식 설명 */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {billingPeriod === 'monthly' ? '정기결제' : '일괄결제'}
                </span>
              </div>
              <p className="text-xs text-blue-700">
                {billingPeriod === 'monthly' 
                  ? '매월 자동으로 결제되며, 언제든지 취소할 수 있습니다.'
                  : '1년치 금액을 한 번에 결제하고 서비스를 이용합니다.'
                }
              </p>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">결제 정보</h2>
            
            {/* 고객 정보 입력 */}
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="010-1234-5678"
                />
              </div>
            </div>

            {/* 결제 위젯 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">결제 수단</h4>
              <div id="payment-widget" className="min-h-[200px] bg-gray-50 rounded-lg border border-gray-200 p-4">
                {/* 토스페이먼츠 위젯이 여기에 렌더링됩니다 */}
              </div>
            </div>

            {/* 약관 동의 */}
            <div id="agreement-widget" className="mb-6">
              {/* 토스페이먼츠 약관 동의 위젯이 여기에 렌더링됩니다 */}
            </div>

            {/* 결제 버튼 */}
            <Button 
              onClick={handlePayment}
              disabled={isProcessing || !customerInfo.name || !customerInfo.email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold disabled:bg-gray-400 disabled:text-gray-200"
              size="lg"
            >
              {isProcessing 
                ? '결제 처리 중...' 
                : `₩${formatPrice(billingPeriod === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice)} 결제하기`
              }
            </Button>

            {/* 보안 정보 */}
            <div className="text-center text-xs text-gray-500 mt-4">
              <p>이 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.</p>
              <p className="mt-1">
                결제 완료 후 즉시 서비스를 이용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 판매자 정보 (토스페이먼츠 심사 요구사항) */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>판매자: 제이앤유통 (대표: 신예준) | 사업자등록번호: 609-41-95762</p>
          <p className="mt-1">서비스 문의: support@shotform.ai | 환불 정책: 이용약관 참조</p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">로딩 중...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
