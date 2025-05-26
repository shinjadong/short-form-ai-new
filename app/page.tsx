'use client'

import { useAuth } from '@/components/providers/auth-provider'
import NavigationHeader from '@/components/navigation-header'
import LandingPage from '@/components/landing-page'
import Dashboard from '@/components/dashboard'

export default function Page() {
  const { user, loading } = useAuth()

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
