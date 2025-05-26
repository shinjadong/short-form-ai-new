'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase-client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientSupabase()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 코드와 에러 파라미터 확인
        const code = searchParams.get('code')
        const errorParam = searchParams.get('error')
        
        console.log('콜백 처리 시작:', { code: !!code, error: errorParam })
        
        if (errorParam) {
          console.error('OAuth 에러:', errorParam)
          setError('인증 중 오류가 발생했습니다.')
          setTimeout(() => {
            window.location.href = '/auth/login?error=oauth_error'
          }, 2000)
          return
        }

        if (code) {
          console.log('OAuth 코드 교환 시작...')
          // OAuth 코드를 세션으로 교환
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('코드 교환 오류:', error)
            setError('인증 처리 중 오류가 발생했습니다.')
            setTimeout(() => {
              window.location.href = '/auth/login?error=code_exchange_error'
            }, 2000)
            return
          }

          if (data.session) {
            console.log('로그인 성공:', data.user?.email)
            setSuccess(true)
            
            // 세션 확인을 위한 추가 체크
            const { data: sessionCheck } = await supabase.auth.getSession()
            console.log('세션 확인:', !!sessionCheck.session)
            
            // AuthProvider에게 상태 갱신 신호 보내기
            localStorage.setItem('auth_refresh_needed', 'true')
            
            // 로그인 성공 - 메인 페이지로 이동
            setTimeout(() => {
              console.log('메인 페이지로 리다이렉트...')
              window.location.href = '/'
            }, 1500)
          } else {
            setError('세션 생성에 실패했습니다.')
            setTimeout(() => {
              window.location.href = '/auth/login'
            }, 2000)
          }
        } else {
          console.log('코드 없음, 일반 세션 확인...')
          // 코드가 없으면 일반 세션 확인
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('세션 확인 오류:', error)
            setError('세션 확인 중 오류가 발생했습니다.')
            setTimeout(() => {
              window.location.href = '/auth/login?error=session_error'
            }, 2000)
            return
          }

          if (data.session) {
            console.log('기존 세션 발견, 메인으로 이동')
            setSuccess(true)
            setTimeout(() => {
              window.location.href = '/'
            }, 1000)
          } else {
            console.log('세션 없음, 로그인으로 이동')
            setTimeout(() => {
              window.location.href = '/auth/login'
            }, 1000)
          }
        }
      } catch (error) {
        console.error('인증 처리 중 예외:', error)
        setError('예상치 못한 오류가 발생했습니다.')
        setTimeout(() => {
          window.location.href = '/auth/login?error=unexpected_error'
        }, 2000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {success ? (
          <>
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">로그인 성공!</p>
            <p className="text-gray-600">대시보드로 이동 중...</p>
            <div className="mt-4">
              <div className="animate-pulse bg-blue-200 h-2 rounded-full"></div>
            </div>
            <p className="mt-2 text-xs text-gray-500">잠시만 기다려주세요...</p>
          </>
        ) : error ? (
          <>
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">{error}</p>
            <p className="text-sm text-gray-500">잠시 후 로그인 페이지로 이동합니다.</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">인증 처리 중...</p>
            <p className="mt-2 text-sm text-gray-500">Google 인증을 확인하고 있습니다.</p>
          </>
        )}
      </div>
    </div>
  )
} 