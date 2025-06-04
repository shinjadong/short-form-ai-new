"use client";

import { Suspense, lazy } from 'react';
import NavigationHeader from '@/components/navigation-header';
import { HeroSection } from '@/components/LandingPage';
import LazySection from '@/components/lazy-section';

// 레이지 로딩 적용할 컴포넌트들
const FeaturesSection = lazy(() => import('@/components/LandingPage/FeaturesSection'));
const CTASection = lazy(() => import('@/components/LandingPage/CTASection'));
const FooterSection = lazy(() => import('@/components/LandingPage/FooterSection'));

// 로딩 스켈레톤 컴포넌트
const SectionSkeleton = ({ height = "h-96" }: { height?: string }) => (
  <div className={`w-full ${height} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse`}>
    <div className="container mx-auto px-4 h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-32 h-8 bg-gray-300 rounded mx-auto animate-pulse"></div>
        <div className="w-64 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
        <div className="w-48 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 네비게이션은 즉시 로드 */}
      <NavigationHeader />
      
      {/* 히어로 섹션은 즉시 로드 (Above the fold) */}
      <HeroSection isAuthenticated={false} />
      
      {/* Features 섹션 - 레이지 로딩 */}
      <LazySection rootMargin="200px">
        <Suspense fallback={<SectionSkeleton height="h-screen" />}>
          <FeaturesSection />
        </Suspense>
      </LazySection>
      
      {/* CTA 섹션 - 레이지 로딩 */}
      <LazySection rootMargin="200px">
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <CTASection isAuthenticated={false} />
        </Suspense>
      </LazySection>
      
      {/* Footer 섹션 - 레이지 로딩 */}
      <LazySection rootMargin="100px">
        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          <FooterSection />
        </Suspense>
      </LazySection>
    </div>
  );
}