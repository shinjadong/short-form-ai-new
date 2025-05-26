"use client";

import { useAuth } from '@/components/providers/auth-provider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavigationHeader from '@/components/navigation-header'
import NewLandingPage from '@/components/new-landing-page'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // 로그인한 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white mx-auto mb-4"></div>
          <p className="text-white/80">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인하지 않은 사용자에게는 랜딩 페이지 표시
  return (
    <div className="min-h-screen">
      <NavigationHeader />
      <NewLandingPage />
    </div>
  )
}