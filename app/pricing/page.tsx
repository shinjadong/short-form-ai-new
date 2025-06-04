'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import NavigationHeader from '@/components/navigation-header'

interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
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

export default function PricingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleSubscribe = (planId: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // billing period와 plan을 checkout으로 전달
    router.push(`/checkout?plan=${planId}&billing=${billingPeriod}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    return Math.round((1 - (yearlyPrice / 12) / monthlyPrice) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      {/* 메인 콘텐츠 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              간단하고 투명한 요금제
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
              필요에 맞는 플랜을 선택하고 AI 영상 제작을 시작하세요
            </p>

            {/* Billing Period 토글 */}
            <div className="inline-flex bg-gray-100 rounded-lg p-1 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                월간 결제
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                연간 결제
              </button>
            </div>

            {billingPeriod === 'yearly' && (
              <div className="mt-4">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  🎉 연간 결제 시 최대 17% 할인!
                </Badge>
              </div>
            )}
          </div>

          {/* 요금제 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan) => {
              const currentPrice = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
              const isPopular = plan.popular
              
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-lg shadow-sm border relative ${
                    isPopular ? 'border-blue-500 border-2 scale-105 shadow-lg' : 'border-gray-200'
                  } transition-all duration-200 hover:shadow-md`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1">
                        가장 인기 있는 플랜
                      </Badge>
                    </div>
                  )}

                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">
                          ₩{formatPrice(currentPrice)}
                        </span>
                        <span className="text-gray-500 ml-1">
                          /{billingPeriod === 'monthly' ? '월' : '년'}
                        </span>
                      </div>
                      
                      {billingPeriod === 'yearly' && (
                        <p className="text-sm text-green-600 mt-2">
                          월간 대비 {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}% 절약
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full mb-8 ${
                        isPopular 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                      size="lg"
                    >
                      시작하기
                    </Button>

                    {/* 기능 목록 */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        포함된 기능
                      </h3>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 mr-3 mt-0.5" />
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* FAQ 섹션 */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              자주 묻는 질문
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  언제든 플랜을 변경할 수 있나요?
                </h3>
                <p className="text-gray-600 text-sm">
                  네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경사항은 다음 결제 주기부터 적용됩니다.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  무료 체험 기간은 어떻게 되나요?
                </h3>
                <p className="text-gray-600 text-sm">
                  모든 유료 플랜에 7일 무료 체험이 제공됩니다. 체험 기간 중 언제든 취소할 수 있습니다.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  환불 정책은 어떻게 되나요?
                </h3>
                <p className="text-gray-600 text-sm">
                  서비스에 만족하지 않으시면 첫 결제 후 14일 이내에 전액 환불을 받으실 수 있습니다.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  생성된 영상의 저작권은 누구에게 있나요?
                </h3>
                <p className="text-gray-600 text-sm">
                  생성된 모든 영상의 저작권은 사용자에게 있습니다. 상업적 용도로도 자유롭게 사용 가능합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 지원 연락처 */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              더 궁금한 점이 있으시거나 맞춤 플랜이 필요하신가요?
            </p>
            <Button variant="outline" onClick={() => window.location.href = 'mailto:support@shotform.ai'}>
              문의하기
            </Button>
          </div>

          {/* 판매자 정보 */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>판매자: 제이앤유통 (대표: 신예준) | 사업자등록번호: 609-41-95762</p>
            <p className="mt-1">서비스 문의: support@shotform.ai | 환불 정책: 이용약관 참조</p>
          </div>
        </div>
      </div>
    </div>
  )
} 