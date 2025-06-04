'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 로딩이 완료되고 사용자가 없으면 로그인 페이지로 리다이렉트
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 사용자가 없으면 로그인 안내 또는 커스텀 fallback 표시
  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>로그인이 필요합니다</CardTitle>
              <CardDescription>
                Shot Form AI의 모든 기능을 사용하려면 로그인해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button asChild>
                  <Link href="/auth/login">로그인</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/signup">회원가입</Link>
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  🎉 무료로 시작하세요
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• 월 10회 무료 비디오 생성</li>
                  <li>• AI 스크립트 자동 생성</li>
                  <li>• TypeCast AI 음성 합성</li>
                  <li>• 다양한 비디오 템플릿</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 인증된 사용자에게는 자식 컴포넌트 렌더링
  return <>{children}</>
} 