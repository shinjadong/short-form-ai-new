'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createClientSupabase } from '@/lib/supabase-client'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'

export default function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, signIn } = useAuth()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClientSupabase()

  useEffect(() => {
    // 이미 로그인된 경우 대시보드로 이동
    if (user) {
      router.push('/')
      return
    }

    // URL 에러 파라미터 처리
    const errorParam = searchParams.get('error')
    if (errorParam) {
      const errorMessages = {
        'oauth_error': 'Google 로그인 중 오류가 발생했습니다.',
        'code_exchange_error': '인증 처리 중 문제가 발생했습니다.',
        'session_error': '세션 확인 중 오류가 발생했습니다.',
        'unexpected_error': '예상치 못한 오류가 발생했습니다.'
      }
      const errorMessage = errorMessages[errorParam as keyof typeof errorMessages] || '로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      addToast({
        type: 'error',
        title: '로그인 실패',
        message: errorMessage
      })
    }
  }, [user, router, searchParams, addToast])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      if (error) {
        const errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
        setError(errorMessage)
        addToast({
          type: 'error',
          title: '로그인 실패',
          message: errorMessage
        })
      } else {
        addToast({
          type: 'success',
          title: '로그인 성공',
          message: '환영합니다!'
        })
        // 무조건 대시보드로 이동
        router.push('/')
      }
    } catch (error) {
      const errorMessage = '로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      addToast({
        type: 'error',
        title: '로그인 오류',
        message: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')

    try {
      addToast({
        type: 'info',
        title: 'Google 로그인',
        message: 'Google 인증 페이지로 이동합니다...'
      })

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // 무조건 대시보드로 리다이렉트
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        const errorMessage = 'Google 로그인을 시작할 수 없습니다.'
        setError(errorMessage)
        addToast({
          type: 'error',
          title: 'Google 로그인 실패',
          message: errorMessage
        })
        setGoogleLoading(false)
      }
      // 성공 시 Google로 리다이렉트되므로 로딩 상태 유지
    } catch (error) {
      const errorMessage = 'Google 로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      addToast({
        type: 'error',
        title: 'Google 로그인 오류',
        message: errorMessage
      })
      setGoogleLoading(false)
    }
  }

  const clearError = () => setError('')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            계정에 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            또는{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              새 계정 만들기
            </Link>
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearError}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google 로그인 버튼 */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {googleLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                Google로 로그인 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 로그인
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">또는</span>
          </div>
        </div>

        {/* 이메일 로그인 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일 주소
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
          </div>
        </form>

        {/* 추가 링크 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 