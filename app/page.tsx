'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { useEffect } from 'react'
import NavigationHeader from '@/components/navigation-header'
import LandingPage from '@/components/landing-page'
import Dashboard from '@/components/dashboard'

export default function Page() {
  const { user, loading } = useAuth()

  useEffect(() => {
    // OAuth 콜백 후 상태 갱신 신호 체크
    const checkAuthRefresh = () => {
      const refreshNeeded = localStorage.getItem('auth_refresh_needed')
      if (refreshNeeded === 'true') {
        console.log('메인 페이지에서 인증 상태 새로고침 감지')
        localStorage.removeItem('auth_refresh_needed')
        // 페이지 새로고침으로 AuthProvider 상태 동기화
        window.location.reload()
      }
    }

    // 페이지 로드 시 체크
    checkAuthRefresh()

    // 주기적으로 체크 (1초마다, 최대 5초)
    let checkCount = 0
    const interval = setInterval(() => {
      checkCount++
      checkAuthRefresh()
      
      if (checkCount >= 5) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      {user ? <Dashboard /> : <LandingPage />}
    </div>
  )
}
