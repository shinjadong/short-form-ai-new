"use client";

import { useState, useEffect } from "react";
import { Star, Quote, User } from "lucide-react";

// 후기 데이터
const testimonials = [
  {
    id: 1,
    name: "김지훈",
    role: "유튜브 크리에이터",
    content: "자동AI를 사용하면서 콘텐츠 제작 시간이 절반으로 줄었어요. 특히 유튜브 분석 기능이 정말 유용합니다.",
    rating: 5,
    bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    id: 2,
    name: "이수진",
    role: "마케팅 매니저",
    content: "블로그 AI 기능으로 SEO에 최적화된 콘텐츠를 빠르게 생성할 수 있어 마케팅 효율이 크게 향상되었습니다.",
    rating: 5,
    bgColor: "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40",
    iconColor: "text-purple-600 dark:text-purple-300",
  },
  {
    id: 3,
    name: "박민준",
    role: "스타트업 CEO",
    content: "작은 팀으로 운영하는 스타트업에서 자동AI는 필수 도구입니다. 비용 효율적이면서도 퀄리티 높은 결과물을 얻을 수 있어요.",
    rating: 4,
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40",
    iconColor: "text-green-600 dark:text-green-300",
  },
  {
    id: 4,
    name: "최예린",
    role: "콘텐츠 마케터",
    content: "다양한 플랫폼에 맞는 콘텐츠를 일관성 있게 제작할 수 있어 브랜드 이미지 관리에 큰 도움이 됩니다.",
    rating: 5,
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40",
    iconColor: "text-pink-600 dark:text-pink-300",
  },
  {
    id: 5,
    name: "정현우",
    role: "프리랜서 디자이너",
    content: "AI가 콘텐츠를 생성해주니 디자인에 더 집중할 수 있어 좋습니다. 특히 블로그 포스팅과 연동이 매끄러워요.",
    rating: 4,
    bgColor: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40",
    iconColor: "text-amber-600 dark:text-amber-300",
  },
  {
    id: 6,
    name: "한소희",
    role: "온라인 쇼핑몰 운영자",
    content: "상품 소싱과 설명 작성에 자동AI를 활용하고 있어요. 시간 절약은 물론 매출도 증가했습니다.",
    rating: 5,
    bgColor: "bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40",
    iconColor: "text-orange-600 dark:text-orange-300",
  },
];

// 이름에서 이니셜을 추출하는 함수
const getInitials = (name: string): string => {
  return name.charAt(0);
};

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-20 bg-github-light dark:bg-github-dark overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-github-dots bg-center opacity-5 dark:opacity-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-github-blue/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-github-purple/30 to-transparent"></div>
      
      {/* 장식 요소 */}
      <div className="absolute top-40 left-10 w-72 h-72 rounded-full bg-github-blue/5 dark:bg-github-blue/10 blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-github-purple/5 dark:bg-github-purple/10 blur-3xl"></div>
      
      {/* 큰 따옴표 장식 */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 opacity-5 dark:opacity-10">
        <Quote className="w-32 h-32 text-github-purple" strokeWidth={1} />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 theme-aware-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            고객 후기
          </h2>
          <p className={`theme-aware-light max-w-2xl mx-auto transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            자동AI를 사용한 고객들의 실제 경험을 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`theme-aware-card p-6 rounded-xl shadow-sm theme-aware-border hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] transition-all duration-1000 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-github-purple/20 shadow-sm ${testimonial.bgColor}`}>
                  <User className={`h-6 w-6 ${testimonial.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold theme-aware-white">{testimonial.name}</h3>
                  <p className="text-sm theme-aware-light">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
              
              <div className="relative">
                <div className="absolute -top-2 -left-2 opacity-10">
                  <Quote className="w-6 h-6 text-github-purple" />
                </div>
                <p className="theme-aware-light pl-4">
                  "{testimonial.content}"
                </p>
              </div>
              
              {/* 장식 요소 */}
              <div className="absolute bottom-2 right-2 w-20 h-20 rounded-full bg-gradient-to-r from-github-purple/5 to-github-blue/5 dark:from-github-purple/10 dark:to-github-blue/10 blur-xl -z-10"></div>
            </div>
          ))}
        </div>
        
        {/* 하단 장식 */}
        <div className="mt-16 flex justify-center">
          <div className="h-1 w-20 bg-gradient-to-r from-github-purple to-github-blue rounded-full"></div>
        </div>
      </div>
    </section>
  );
} 