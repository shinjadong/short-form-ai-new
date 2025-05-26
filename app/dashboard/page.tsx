'use client'

import { useAuth, useUsageLimit } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Video, 
  Clock, 
  TrendingUp, 
  Zap,
  PlayCircle,
  FileText,
  Mic,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import NavigationHeader from '@/components/navigation-header'
import AuthGuard from '@/components/auth-guard'

export default function DashboardPage() {
  const { user, userProfile } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  let usageCount = 0
  let usageLimit = 0
  let getUsagePercentage = () => 0
  let subscriptionTier = 'free'

  try {
    const usageData = useUsageLimit()
    usageCount = usageData.usageCount
    usageLimit = usageData.usageLimit
    getUsagePercentage = usageData.getUsagePercentage
    subscriptionTier = usageData.subscriptionTier
  } catch (err: any) {
    console.error('사용량 데이터 로딩 오류:', err)
    setError('사용량 정보를 불러오는 중 오류가 발생했습니다.')
  }

  const remainingUsage = usageLimit - usageCount

  useEffect(() => {
    // 사용자 프로필이 로드되면 로딩 상태 해제
    if (userProfile !== null) {
      setIsLoading(false)
    }
  }, [userProfile])

  // 에러 상태
  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <NavigationHeader />
          <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">대시보드 로딩 오류</h2>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    페이지 새로고침
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  // 사용자 프로필이 아직 로딩 중인 경우
  if (isLoading || !userProfile) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <NavigationHeader />
          <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">대시보드를 준비하고 있습니다...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                안녕하세요, {user?.email?.split('@')[0]}님! 👋
              </h1>
              <p className="text-gray-600">
                오늘도 멋진 비디오를 만들어보세요
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">이번 달 사용량</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageCount}</div>
                  <p className="text-xs text-muted-foreground">
                    총 {usageLimit}회 중
                  </p>
                  <Progress value={getUsagePercentage()} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">남은 횟수</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{remainingUsage}</div>
                  <p className="text-xs text-muted-foreground">
                    무료 생성 가능
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">구독 플랜</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{subscriptionTier}</div>
                  <p className="text-xs text-muted-foreground">
                    현재 플랜
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 생성 비디오</CardTitle>
                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageCount}</div>
                  <p className="text-xs text-muted-foreground">
                    누적 생성 수
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <span>빠른 비디오 생성</span>
                    </CardTitle>
                    <CardDescription>
                      주제만 입력하면 30초 만에 완성되는 AI 비디오
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button className="h-20 flex flex-col space-y-2" asChild>
                        <Link href="/create">
                          <Plus className="h-6 w-6" />
                          <span>새 비디오 생성</span>
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
                        <Link href="/my-videos">
                          <Video className="h-6 w-6" />
                          <span>내 비디오</span>
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="h-20 flex flex-col space-y-2">
                        <FileText className="h-6 w-6" />
                        <span>템플릿</span>
                      </Button>
                    </div>

                    {remainingUsage <= 2 && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <p className="text-sm text-orange-800">
                            <strong>사용량 부족:</strong> 남은 생성 횟수가 {remainingUsage}회입니다. 
                            <Link href="/pricing" className="underline ml-1">플랜 업그레이드</Link>
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>💡 오늘의 팁</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">스크립트 최적화</h4>
                      <p className="text-sm text-blue-800">
                        30초 분량에는 약 75-80단어가 적당합니다. 간결하고 임팩트 있는 메시지를 전달하세요.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">키워드 활용</h4>
                      <p className="text-sm text-green-800">
                        구체적인 키워드를 사용하면 더 정확한 배경 영상을 찾을 수 있습니다.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>
                  최근에 생성한 비디오들을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">아직 생성된 비디오가 없습니다</p>
                  <p className="text-sm mb-4">첫 번째 AI 비디오를 만들어보세요!</p>
                  <Button asChild>
                    <Link href="/create">
                      <Plus className="mr-2 h-4 w-4" />
                      비디오 생성하기
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Showcase */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-900">AI 스크립트</CardTitle>
                  <CardDescription className="text-blue-700">
                    GPT-4가 매력적인 스크립트를 자동 생성
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Mic className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">AI 음성</CardTitle>
                  <CardDescription className="text-green-700">
                    TypeCast로 자연스러운 나레이션 생성
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-purple-900">자동 편집</CardTitle>
                  <CardDescription className="text-purple-700">
                    배경 영상과 자막을 자동으로 편집
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
} 