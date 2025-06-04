'use client'

import { lazy, Suspense, memo, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Video, PlayCircle, Zap } from 'lucide-react'
import Link from 'next/link'

// 레이지 로딩으로 무거운 컴포넌트들 분리
const NavigationHeader = lazy(() => import('@/components/navigation-header'))
const AuthGuard = lazy(() => import('@/components/auth-guard'))

// 메모이제이션된 간단한 액션 버튼들
const ActionButton = memo(({ 
  href, 
  onClick, 
  icon, 
  title, 
  subtitle, 
  disabled = false,
  variant = 'default' 
}: {
  href?: string
  onClick?: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
  disabled?: boolean
  variant?: 'default' | 'outline'
}) => {
  const buttonContent = (
    <>
      {icon}
      <span>{title}</span>
      <span className="text-xs opacity-70">{subtitle}</span>
    </>
  )

  const buttonClass = "h-32 flex flex-col space-y-3 text-lg font-semibold"

  if (href) {
    return (
      <Button 
        className={buttonClass}
        variant={variant}
        asChild
        disabled={disabled}
        size="lg"
      >
        <Link href={href}>
          {buttonContent}
        </Link>
      </Button>
    )
  }

  return (
    <Button 
      className={buttonClass}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      size="lg"
    >
      {buttonContent}
    </Button>
  )
})

ActionButton.displayName = 'ActionButton'

// 메모이제이션된 사용량 표시
const UsageDisplay = memo(({ usageCount, usageLimit }: { usageCount: number, usageLimit: number }) => {
  const isLimitReached = usageCount >= usageLimit

  if (isLimitReached) {
    return (
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
        <p className="text-center text-red-800 font-medium">
          😱 이번 달 사용량을 모두 사용했습니다!<br />
          <Link href="/pricing" className="underline hover:text-red-600">
            플랜 업그레이드
          </Link>하여 계속 이용해보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 text-center text-gray-600">
      <p>이번 달 {usageCount}/{usageLimit}회 사용 중</p>
    </div>
  )
})

UsageDisplay.displayName = 'UsageDisplay'

// 메인 대시보드 컴포넌트 (최소한의 로직만)
function DashboardContent() {
  const { user, userProfile } = useAuth()
  
  // 최소한의 계산만 수행
  const userName = user?.email?.split('@')[0] || '사용자'
  const usageCount = userProfile?.usage_count || 0
  const usageLimit = userProfile?.usage_limit || 3
  const isUsageLimitReached = usageCount >= usageLimit

  // 템플릿 클릭 핸들러 메모이제이션
  const handleTemplateClick = useCallback(() => {
    alert('준비 중인 기능입니다')
  }, [])

  // 로딩 상태 (userProfile이 없으면 로딩)
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="h-16 bg-white border-b"></div>}>
        <NavigationHeader />
      </Suspense>
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              안녕하세요, {userName}님! 👋
            </h1>
            <p className="text-xl text-gray-600">
              오늘도 멋진 비디오를 만들어보세요
            </p>
          </div>

          {/* Main Actions Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Zap className="h-6 w-6 text-blue-600" />
                <span>Shot Form AI</span>
              </CardTitle>
              <CardDescription className="text-lg">
                AI가 만드는 30초 완성 비디오
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <ActionButton
                  href="/create"
                  icon={<Plus className="h-8 w-8" />}
                  title="새 비디오 생성"
                  subtitle="AI 자동 제작"
                  disabled={isUsageLimitReached}
                />
                
                <ActionButton
                  href="/my-videos"
                  icon={<Video className="h-8 w-8" />}
                  title="내 비디오"
                  subtitle="만든 영상 보기"
                  variant="outline"
                />
                
                <ActionButton
                  onClick={handleTemplateClick}
                  icon={<PlayCircle className="h-8 w-8" />}
                  title="템플릿"
                  subtitle="빠른 제작"
                  variant="outline"
                />
              </div>

              <UsageDisplay usageCount={usageCount} usageLimit={usageLimit} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// 메모이제이션된 메인 컴포넌트
const MemoizedDashboardContent = memo(DashboardContent)

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AuthGuard>
        <MemoizedDashboardContent />
      </AuthGuard>
    </Suspense>
  )
} 