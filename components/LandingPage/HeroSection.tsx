"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Sparkles, Play, Zap, Clock, Wand2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [stars, setStars] = useState<Array<{
    top: string;
    left: string;
    width: string;
    height: string;
    animation: string;
  }>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // 클라이언트 사이드에서만 별 생성
    const starsArray = [...Array(20)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite ${Math.random() * 2}s`
    }));
    
    setStars(starsArray);
  }, []);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* 별 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars-container">
          {stars.map((star, i) => (
            <div 
              key={i} 
              className="absolute rounded-full bg-white/30"
              style={{
                top: star.top,
                left: star.left,
                width: star.width,
                height: star.height,
                animation: star.animation
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* 히어로 콘텐츠 */}
      <div className={`container mx-auto px-4 md:px-6 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col items-center text-center pb-8 md:pb-12">
          {/* 프리미엄 배지 */}
          <div className="mb-6 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full flex items-center space-x-2 group hover:shadow-sm transition-all duration-300">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              AI 기반 쇼트폼 비디오 생성 🚀
            </span>
            <ArrowRight className="w-3 h-3 text-blue-400/70 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto mb-6">
            30초 만에 완성되는<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">프로급 쇼트폼 비디오</span>
          </h1>
          
          <p className="text-gray-300 max-w-2xl text-lg mb-10">
            AI가 스크립트부터 음성, 편집까지 모든 것을 자동으로 처리합니다.
            아이디어만 있으면 바이럴 비디오가 완성됩니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Video className="mr-2 h-4 w-4" />
                    대시보드로 이동
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/script-generator" className="flex-1">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    <Wand2 className="mr-2 h-4 w-4" />
                    스크립트 생성
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    무료로 시작하기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/script-generator" className="flex-1">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    <Wand2 className="mr-2 h-4 w-4" />
                    스크립트 생성
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 통계 정보 */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12 text-gray-300 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500/80 mr-2"></div>
            <span>10,000+ 생성된 비디오</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500/80 mr-2"></div>
            <span>평균 30초 생성 시간</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500/80 mr-2"></div>
            <span>99% 사용자 만족도</span>
          </div>
        </div>

        {/* 기능 미리보기 카드들 */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Link href="/script-generator" className="block group">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center group-hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI 스크립트 생성</h3>
              <p className="text-gray-300 text-sm">GPT-4가 매력적인 스크립트를 자동 생성</p>
              <div className="mt-3 text-xs text-blue-400 group-hover:text-blue-300 transition-colors">
                바로 시작하기 →
              </div>
            </div>
          </Link>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">AI 음성</h3>
            <p className="text-gray-300 text-sm">TypeCast로 자연스러운 나레이션 생성</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">자동 편집</h3>
            <p className="text-gray-300 text-sm">배경 영상과 자막을 자동으로 편집</p>
          </div>
        </div>
      </div>
      
      {/* 물결 모양 구분선 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path className="fill-white" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
} 