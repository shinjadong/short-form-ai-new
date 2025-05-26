'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientSupabase } from '@/lib/supabase-client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const supabase = createClientSupabase()

  useEffect(() => {
    // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (user) {
    return null // 리다이렉트 중
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Shot Form AI
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            AI 기반 쇼트폼 비디오 생성 플랫폼
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              계정에 로그인하여 AI 비디오 생성을 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              view="sign_in"
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#000000',
                      brandAccent: '#333333',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors',
                  input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent',
                  label: 'block text-sm font-medium text-gray-700 mb-1',
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: '이메일',
                    password_label: '비밀번호',
                    button_label: '로그인',
                    loading_button_label: '로그인 중...',
                    social_provider_text: '{{provider}}로 로그인',
                    link_text: '이미 계정이 있으신가요? 로그인',
                    email_input_placeholder: '이메일을 입력하세요',
                    password_input_placeholder: '비밀번호를 입력하세요',
                  },
                },
              }}
              providers={[]}
              redirectTo={`${window.location.origin}/auth/callback`}
            />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <Link 
                  href="/auth/signup" 
                  className="font-medium text-black hover:text-gray-800"
                >
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 