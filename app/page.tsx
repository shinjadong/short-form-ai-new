"use client";

import { useAuth } from '@/components/providers/auth-provider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavigationHeader from '@/components/navigation-header'
import NewLandingPage from '@/components/new-landing-page'

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // 로그인한 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

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

  // 로그인하지 않은 사용자에게는 랜딩 페이지 표시
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationHeader />
      <NewLandingPage />
    </div>
  )
}