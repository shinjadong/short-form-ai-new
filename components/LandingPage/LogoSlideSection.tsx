"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// 로고 데이터
const logos = [
  { name: "네이버", src: "/logos/naver.svg" },
  { name: "카카오", src: "/logos/kakao.svg" },
  { name: "라인", src: "/logos/line.svg" },
  { name: "쿠팡", src: "/logos/coupang.svg" },
  { name: "배달의민족", src: "/logos/baemin.svg" },
  { name: "토스", src: "/logos/toss.svg" },
  { name: "당근마켓", src: "/logos/karrot.svg" },
  { name: "우아한형제들", src: "/logos/woowa.svg" },
];

export default function LogoSlideSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-16 bg-github-light dark:bg-github-dark overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-github-dots bg-center opacity-5 dark:opacity-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-github-purple/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-github-blue/30 to-transparent"></div>
      
      {/* 장식 요소 */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-github-purple/5 dark:bg-github-purple/10 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-github-blue/5 dark:bg-github-blue/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 mb-8 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-semibold text-center theme-aware-white mb-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            수많은 기업들이 자동AI를 신뢰합니다
          </h2>
          <p className="theme-aware-light text-center max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            국내 주요 기업들이 자동AI 플랫폼을 통해 비즈니스를 혁신하고 있습니다
          </p>
        </div>
      </div>
      
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* 로고 슬라이드 - 첫 번째 방향 */}
        <div className="relative flex overflow-x-hidden py-4 bg-gradient-to-r from-transparent via-github-purple/5 to-transparent dark:from-transparent dark:via-github-purple/10 dark:to-transparent">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {logos.map((logo, index) => (
              <div key={`logo1-${index}`} className="mx-8 flex items-center justify-center h-16 w-32 group">
                <div className="relative h-8 w-full transition-all duration-300 transform group-hover:scale-110">
                  <Image
                    src={logo.src}
                    alt={`${logo.name} 로고`}
                    fill
                    className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center">
            {logos.map((logo, index) => (
              <div key={`logo2-${index}`} className="mx-8 flex items-center justify-center h-16 w-32 group">
                <div className="relative h-8 w-full transition-all duration-300 transform group-hover:scale-110">
                  <Image
                    src={logo.src}
                    alt={`${logo.name} 로고`}
                    fill
                    className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 로고 슬라이드 - 반대 방향 */}
        <div className="relative flex overflow-x-hidden py-4 mt-4 bg-gradient-to-r from-transparent via-github-blue/5 to-transparent dark:from-transparent dark:via-github-blue/10 dark:to-transparent">
          <div className="animate-marquee-reverse whitespace-nowrap flex items-center">
            {[...logos].reverse().map((logo, index) => (
              <div key={`logo3-${index}`} className="mx-8 flex items-center justify-center h-16 w-32 group">
                <div className="relative h-8 w-full transition-all duration-300 transform group-hover:scale-110">
                  <Image
                    src={logo.src}
                    alt={`${logo.name} 로고`}
                    fill
                    className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-0 animate-marquee2-reverse whitespace-nowrap flex items-center">
            {[...logos].reverse().map((logo, index) => (
              <div key={`logo4-${index}`} className="mx-8 flex items-center justify-center h-16 w-32 group">
                <div className="relative h-8 w-full transition-all duration-300 transform group-hover:scale-110">
                  <Image
                    src={logo.src}
                    alt={`${logo.name} 로고`}
                    fill
                    className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 하단 장식 */}
      <div className="container mx-auto px-4 md:px-6 mt-8">
        <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-github-purple/30 to-transparent"></div>
      </div>
    </section>
  );
} 