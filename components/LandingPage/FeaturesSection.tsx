"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Mic, Video, Clock, Zap, FileText, Globe, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            AI가 모든 것을 처리합니다
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            복잡한 비디오 편집 지식 없이도 전문가 수준의 쇼트폼 비디오를 만들 수 있습니다
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* AI 스크립트 생성 */}
          <Card 
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '0.1s' }}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>AI 스크립트 생성</CardTitle>
              <CardDescription>
                주제만 입력하면 GPT-4가 매력적인 스크립트를 자동 생성합니다. 
                시청자의 관심을 끄는 완벽한 구조의 대본이 완성됩니다.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* TypeCast AI 음성 */}
          <Card 
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>TypeCast AI 음성</CardTitle>
              <CardDescription>
                자연스러운 AI 음성으로 전문 성우 수준의 나레이션을 생성합니다. 
                다양한 목소리와 톤으로 브랜드에 맞는 음성을 선택할 수 있습니다.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 자동 비디오 편집 */}
          <Card 
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>자동 비디오 편집</CardTitle>
              <CardDescription>
                배경 영상, 자막, 효과까지 AI가 자동으로 편집하여 완성합니다. 
                프로급 편집 기술 없이도 완벽한 비디오를 만들 수 있습니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 혜택 섹션 */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
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
          
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">무료로 시작하세요</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">10회</div>
                <p className="text-gray-600 mb-6">매월 무료 비디오 생성</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">AI 스크립트 생성</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">TypeCast AI 음성</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">HD 품질 비디오</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">다양한 템플릿</span>
                  </li>
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/auth/signup">지금 시작하기</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 사용 사례 섹션 */}
        <div className="mt-20">
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
      </div>
    </section>
  );
} 