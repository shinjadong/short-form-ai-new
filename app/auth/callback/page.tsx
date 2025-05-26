'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase-client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientSupabase()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('인증 콜백 오류:', error)
          router.push('/auth/login?error=callback_error')
          return
        }

        if (data.session) {
          // 로그인 성공 - 메인 페이지로 리다이렉트
          router.push('/')
        } else {
          // 세션이 없으면 로그인 페이지로
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('인증 처리 중 오류:', error)
        router.push('/auth/login?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">인증 처리 중...</p>
      </div>
    </div>
  )
} 