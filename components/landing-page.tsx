'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Mic, 
  Video, 
  Sparkles, 
  Clock, 
  Globe, 
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Crown,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
              🚀 AI 기반 비디오 생성 플랫폼
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              30초 만에<br />
              완벽한 쇼트폼 비디오
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI가 스크립트부터 음성, 편집까지 모든 것을 자동으로 처리합니다.
              <br />
              아이디어만 있으면 프로급 비디오가 완성됩니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100" asChild>
                <Link href="/auth/signup">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Play className="mr-2 h-5 w-5" />
                데모 보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI가 모든 것을 처리합니다
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              복잡한 비디오 편집 지식 없이도 전문가 수준의 쇼트폼 비디오를 만들 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI 스크립트 생성</CardTitle>
                <CardDescription>
                  주제만 입력하면 GPT-4가 매력적인 스크립트를 자동 생성합니다
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>TypeCast AI 음성</CardTitle>
                <CardDescription>
                  자연스러운 AI 음성으로 전문 성우 수준의 나레이션을 생성합니다
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>자동 비디오 편집</CardTitle>
                <CardDescription>
                  배경 영상, 자막, 효과까지 AI가 자동으로 편집하여 완성합니다
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                왜 Shot Form AI인가요?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">시간 절약</h3>
                    <p className="text-gray-600">몇 시간 걸리던 작업을 30초로 단축</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">전문가 품질</h3>
                    <p className="text-gray-600">AI 기술로 프로급 비디오 품질 보장</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">비용 효율적</h3>
                    <p className="text-gray-600">비싼 편집 소프트웨어나 외주 불필요</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">쉬운 사용</h3>
                    <p className="text-gray-600">복잡한 편집 지식 없이도 누구나 사용 가능</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">무료로 시작하세요</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">3회</div>
                <p className="text-gray-600 mb-6">매월 무료 비디오 생성</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">AI 스크립트 생성</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">기본 AI 음성</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">720p HD 품질</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">기본 자막 스타일</span>
                  </li>
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/auth/signup">지금 시작하기</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              다양한 용도로 활용하세요
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>마케팅</span>
                </CardTitle>
                <CardDescription>
                  제품 소개, 브랜드 홍보, 광고 영상을 빠르게 제작하세요
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span>교육</span>
                </CardTitle>
                <CardDescription>
                  강의 요약, 설명 영상, 튜토리얼을 쉽게 만들어보세요
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>소셜미디어</span>
                </CardTitle>
                <CardDescription>
                  인스타그램, 틱톡, 유튜브 쇼츠용 콘텐츠를 대량 생산하세요
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              간단하고 명확한 요금제
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              필요에 맞는 플랜을 선택하고 AI 영상 제작을 시작하세요. 언제든 변경 가능합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 무료 플랜 */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-2xl">무료 플랜</CardTitle>
                <CardDescription>기본 기능을 무료로 체험해보세요</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₩0</span>
                  <span className="text-gray-600">/월</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">월 3개 영상 생성</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">기본 음성 합성</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">720p 해상도</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">기본 자막 스타일</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/signup">무료로 시작하기</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 프로 플랜 */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  🔥 가장 인기
                </Badge>
              </div>
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">프로 플랜</CardTitle>
                <CardDescription>개인 크리에이터를 위한 완벽한 솔루션</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₩29,000</span>
                  <span className="text-gray-600">/월</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">월 50개 영상 생성</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">TypeCast 프리미엄 음성</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">1080p 고화질 출력</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">고급 자막 애니메이션</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">워터마크 제거</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">우선 처리 큐</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/pricing">프로 플랜 시작</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 프리미엄 플랜 */}
            <Card className="border-2 border-purple-200">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">프리미엄 플랜</CardTitle>
                <CardDescription>비즈니스 및 에이전시를 위한 무제한 솔루션</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₩59,000</span>
                  <span className="text-gray-600">/월</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">무제한 영상 생성</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">모든 프리미엄 음성</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">4K 해상도 지원</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">커스텀 브랜딩</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">API 액세스</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">24/7 프리미엄 지원</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/pricing">프리미엄 시작</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">모든 플랜에 7일 무료 체험 포함</p>
            <Button variant="outline" asChild>
              <Link href="/pricing">
                전체 요금제 비교하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            첫 번째 AI 비디오를 30초 만에 만들어보세요. 신용카드 필요 없습니다.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
            <Link href="/auth/signup">
              무료로 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
} 