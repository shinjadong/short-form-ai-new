'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase-client'

export default function AuthCallbackContent() {
  const router = useRouter()
  const supabase = createClientSupabase()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Google 인증을 확인하고 있습니다...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 코드와 에러 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const errorParam = urlParams.get('error')
        
        console.log('콜백 처리 시작:', { code: !!code, error: errorParam })
        setProgress(20)
        
        if (errorParam) {
          console.error('OAuth 에러:', errorParam)
          setError('인증 중 오류가 발생했습니다.')
          setTimeout(() => {
            window.location.href = '/auth/login?error=oauth_error'
          }, 2000)
          return
        }

        if (code) {
          setStatusMessage('인증 코드를 처리하고 있습니다...')
          setProgress(40)
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
            setProgress(70)
            setStatusMessage('사용자 정보를 확인하고 있습니다...')
            console.log('로그인 성공:', data.user?.email)
            
            // 세션 확인을 위한 추가 체크
            const { data: sessionCheck } = await supabase.auth.getSession()
            console.log('세션 확인:', !!sessionCheck.session)
            
            setProgress(90)
            setStatusMessage('로그인 완료! 대시보드로 이동 중...')
            setSuccess(true)
            
            // 로그인 성공 - 무조건 대시보드로 이동
            setTimeout(() => {
              console.log('대시보드로 리다이렉트')
              window.location.replace('/')
            }, 1500)
          } else {
            setError('세션 생성에 실패했습니다.')
            setTimeout(() => {
              window.location.href = '/auth/login'
            }, 2000)
          }
        } else {
          setStatusMessage('기존 세션을 확인하고 있습니다...')
          setProgress(50)
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
            console.log('기존 세션 발견, 대시보드로 이동')
            setProgress(100)
            setSuccess(true)
            setTimeout(() => {
              window.location.replace('/')
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
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        {success ? (
          <>
            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <div className="relative">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인 성공!</h2>
            <p className="text-gray-600 mb-4">환영합니다! 대시보드로 이동합니다.</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: '100%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">대시보드 이동 중...</p>
          </>
        ) : error ? (
          <>
            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인 실패</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">잠시 후 로그인 페이지로 이동합니다.</p>
          </>
        ) : (
          <>
            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <div className="absolute inset-0 rounded-full border-2 border-blue-200"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">인증 처리 중</h2>
            <p className="text-gray-600 mb-6">{statusMessage}</p>
            
            {/* 진행률 표시 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">{progress}% 완료</p>
          </>
        )}
      </div>
    </div>
  )
} 