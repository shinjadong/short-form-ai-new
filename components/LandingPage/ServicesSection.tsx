"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Youtube, FileText, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="services" className="relative py-20 bg-github-light dark:bg-github-dark overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-github-dots bg-center opacity-5 dark:opacity-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-github-purple/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-github-blue/30 to-transparent"></div>
      
      {/* 장식 요소 */}
      <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-github-purple/5 dark:bg-github-purple/10 blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-github-blue/5 dark:bg-github-blue/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold theme-aware-white mb-6">
            당신이 잠든 사이에도 일하는 AI 비즈니스 엔진
          </h2>
          <p className="theme-aware-light max-w-3xl mx-auto">
            "하루 24시간이 부족하다고요?" 이제 AI가 당신의 비즈니스를 자동화합니다. 
            인간의 창의력과 AI의 효율성이 만나 시간, 비용, 노력을 획기적으로 절감하세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 유튜브 AI */}
          <div 
            className={`theme-aware-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 hover:translate-y-[-5px] theme-aware-border relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '0.1s' }}
          >
            {/* 이미지 영역 */}
            <div className="mb-6 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
              <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://dx0dfo0jqbjn4wwt.public.blob.vercel-storage.com/%EC%9E%90%EB%8F%99ai%EC%9C%A0%ED%8A%9C%EB%B8%8C%EC%8B%9C%EC%97%B0-DB7eBCa4wIANQSl3Q74wWDQuCRBrH3-YoJbrxUZBlGIrExFWXQMGxlBTprdcM.gif" 
                    alt="유튜브 AI 서비스 데모"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-github-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            <div className="bg-github-purple/10 dark:bg-github-purple/20 p-3 rounded-full w-fit mx-auto mb-4">
              <Youtube className="h-6 w-6 text-github-purple" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 theme-aware-white text-center">유튜브 AI 분석기</h3>
            <p className="theme-aware-light mb-6 text-center">
              <span className="font-semibold text-github-purple dark:text-github-purple">단 5분 만에 100만 구독자의 비밀을 해독합니다.</span> 10년 노하우가 담긴 채널 전략, 최적 썸네일, 시청자 심리까지 - AI가 모든 경쟁사 분석을 완료합니다.
            </p>
            <Link href="/youtube">
              <Button variant="outline" className="w-full border-github-purple/30 text-github-purple hover:bg-github-purple/10 dark:border-github-purple/50 dark:text-github-purple dark:hover:bg-github-purple/20 transition-colors">
                성공 채널의 비밀 파헤치기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            {/* 장식 요소 */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-github-purple/5 to-github-blue/5 dark:from-github-purple/10 dark:to-github-blue/10 blur-2xl -z-10"></div>
          </div>
          
          {/* 블로그 AI */}
          <div 
            className={`theme-aware-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 hover:translate-y-[-5px] theme-aware-border relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '0.2s' }}
          >
            {/* 이미지 영역 */}
            <div className="mb-6 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
              <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://dx0dfo0jqbjn4wwt.public.blob.vercel-storage.com/KakaoTalk_20250401_112657654-zfguOQRL0UKaTuiEgpu3iamypXQW68.gif" 
                    alt="블로그 AI 서비스 데모"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-github-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            <div className="bg-github-blue/10 dark:bg-github-blue/20 p-3 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-6 w-6 text-github-blue" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 theme-aware-white text-center">블로그 AI 작성기</h3>
            <p className="theme-aware-light mb-6 text-center">
              <span className="font-semibold text-github-blue dark:text-github-blue">3일이 걸리는 작업을 30초 만에 완성합니다.</span> 키워드 한 번 입력으로 검색 1페이지급 SEO 최적화 콘텐츠가 자동 생성됩니다. 매출 상승의 비밀 무기를 지금 경험하세요.
            </p>
            <Link href="/aiblog">
              <Button variant="outline" className="w-full border-github-blue/30 text-github-blue hover:bg-github-blue/10 dark:border-github-blue/50 dark:text-github-blue dark:hover:bg-github-blue/20 transition-colors">
                30초 안에 콘텐츠 받기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            {/* 장식 요소 */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-github-blue/5 to-github-green/5 dark:from-github-blue/10 dark:to-github-green/10 blur-2xl -z-10"></div>
          </div>
          
          {/* 유튜브 대본 생성기 */}
          <div 
            className={`theme-aware-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 hover:translate-y-[-5px] theme-aware-border relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '0.3s' }}
          >
            {/* 이미지 영역 */}
            <div className="mb-6 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group relative">
              <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://dx0dfo0jqbjn4wwt.public.blob.vercel-storage.com/script-demo-RXqHxXRproTQ9PpiLH8CBJA5JPUA2N.gif" 
                    alt="유튜브 대본 생성기 데모"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-github-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            <div className="bg-github-green/10 dark:bg-github-green/20 p-3 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-6 w-6 text-github-green" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 theme-aware-white text-center">"딸깍" 클릭 한 번으로 대본 완성</h3>
            <p className="theme-aware-light mb-6 text-center">
              <span className="font-semibold text-github-green/80 dark:text-github-green/80">시선을 사로잡는 유튜브 대본이 즉시 생성됩니다.</span> 도입부터 결론까지 완벽한 구조의 매력적인 대본이 클릭 한 번으로 완성! 이제 촬영과 편집에만 집중하세요.
            </p>
            <Link href="/youtube">
              <Button variant="outline" className="w-full border-github-green/30 text-github-green hover:bg-github-green/10 dark:border-github-green/50 dark:text-github-green dark:hover:bg-github-green/20 transition-colors">
                지금 바로 대본 생성하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            {/* 장식 요소 */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-github-green/5 to-github-yellow/5 dark:from-github-green/10 dark:to-github-yellow/10 blur-2xl -z-10"></div>
          </div>
        </div>
        
        {/* 하단 장식 */}
        <div className="mt-16 flex flex-col items-center">
          <div className="h-1 w-20 bg-gradient-to-r from-github-purple to-github-blue rounded-full"></div>
          <p className="mt-8 text-sm theme-aware-light max-w-md text-center italic">
            "자동AI를 도입한 후 콘텐츠 제작 시간이 87% 감소했고, 매출은 3.5배 증가했습니다."
            <span className="block mt-2 font-medium not-italic">- 실제 사용자 후기</span>
          </p>
        </div>
      </div>
    </section>
  );
} 
