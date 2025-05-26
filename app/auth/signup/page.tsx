'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Sparkles, Clock, Video } from 'lucide-react'

export default function SignupPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      
      if (error) {
        console.error('Google 회원가입 오류:', error)
      }
    } catch (error) {
      console.error('Google 회원가입 처리 중 오류:', error)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">리다이렉트 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shot Form AI 시작하기
          </h1>
          <p className="text-xl text-gray-600">
            AI로 30초 만에 프로급 쇼트폼 비디오를 만들어보세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 왼쪽: 혜택 소개 */}
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">무료</Badge>
                  <CardTitle className="text-green-900">무료로 시작하세요!</CardTitle>
                </div>
                <CardDescription className="text-green-700">
                  신용카드 없이 바로 시작할 수 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">10회</div>
                  <p className="text-green-800">매월 무료 비디오 생성</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-800">AI 스크립트 자동 생성</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-800">TypeCast AI 음성 합성</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-800">HD 품질 비디오 출력</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-800">다양한 템플릿 제공</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">AI 스크립트</h3>
                <p className="text-sm text-gray-600">GPT-4 기반 매력적인 스크립트</p>
              </Card>
              
              <Card className="text-center p-4">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">30초 완성</h3>
                <p className="text-sm text-gray-600">빠른 비디오 생성</p>
              </Card>
              
              <Card className="text-center p-4">
                <Video className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">프로급 품질</h3>
                <p className="text-sm text-gray-600">전문가 수준의 결과물</p>
              </Card>
            </div>
          </div>

          {/* 오른쪽: 회원가입 폼 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>간편 회원가입</CardTitle>
                <CardDescription>
                  소셜 계정으로 빠르게 시작하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google 회원가입 버튼 */}
                <Button
                  onClick={handleGoogleSignup}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 h-12"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Google로 회원가입</span>
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 기존 이메일 회원가입 */}
            <Card>
              <CardHeader>
                <CardTitle>이메일 회원가입</CardTitle>
              </CardHeader>
              <CardContent>
                <Auth
                  supabaseClient={supabase}
                  view="sign_up"
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#1f2937',
                          brandAccent: '#374151',
                        },
                      },
                    },
                  }}
                  localization={{
                    variables: {
                      sign_up: {
                        email_label: '이메일',
                        password_label: '비밀번호',
                        button_label: '회원가입',
                        loading_button_label: '가입 중...',
                        social_provider_text: '{{provider}}로 가입',
                        link_text: '계정이 없으신가요? 회원가입',
                        confirmation_text: '이메일을 확인해주세요',
                      },
                    },
                  }}
                  redirectTo={`${window.location.origin}/auth/callback`}
                  providers={[]}
                />
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  로그인
                </Link>
              </p>
            </div>

            <div className="text-xs text-gray-500 text-center">
              회원가입 시 <Link href="/terms" className="underline">이용약관</Link> 및{' '}
              <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의하는 것으로 간주됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 