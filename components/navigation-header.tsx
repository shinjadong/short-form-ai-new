'use client'

import { useAuth, useUsageLimit } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { LogOut, User, Video, Settings, Plus, Home, Wand2, BarChart3, CreditCard, Crown, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { LOGO_URLS } from '@/lib/constants'

export default function NavigationHeader() {
  const { user, userProfile, signOut } = useAuth()
  const { usageCount, usageLimit, getUsagePercentage, subscriptionTier } = useUsageLimit()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
  }

  const isActive = (path: string) => pathname === path

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'pro':
        return <Zap className="w-4 h-4" />
      case 'premium':
        return <Crown className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const getPlanName = (tier: string) => {
    switch (tier) {
      case 'pro':
        return '프로'
      case 'premium':
        return '프리미엄'
      default:
        return '무료'
    }
  }

  const getPlanBadgeColor = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'bg-blue-100 text-blue-800'
      case 'premium':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <header className="border-b border-gray-700 sticky top-0 z-50" style={{backgroundColor: '#100e0d'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src={LOGO_URLS.logoSmall} 
                  alt="Shot Form AI 로고" 
                  width={40} 
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-white tracking-tight">Shot Form AI</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-white hover:text-gray-300 hover:bg-gray-800">
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button asChild className="bg-white text-black hover:bg-gray-200">
                <Link href="/auth/signup">회원가입</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-gray-700 sticky top-0 z-50" style={{backgroundColor: '#100e0d'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
                          <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src={LOGO_URLS.logoSmall} 
                  alt="Shot Form AI 로고" 
                  width={40} 
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-white tracking-tight">Shot Form AI</span>
              </Link>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium tracking-tight transition-colors hover:text-white ${
                  isActive('/dashboard') ? 'text-white' : 'text-gray-300'
                }`}
              >
                <Home className="inline h-4 w-4 mr-1" />
                대시보드
              </Link>
              <Link 
                href="/script-generator" 
                className={`text-sm font-medium tracking-tight transition-colors hover:text-white ${
                  isActive('/script-generator') ? 'text-white' : 'text-gray-300'
                }`}
              >
                <Wand2 className="inline h-4 w-4 mr-1" />
                스크립트 생성
              </Link>
              <Link 
                href="/create" 
                className={`text-sm font-medium tracking-tight transition-colors hover:text-white ${
                  isActive('/create') ? 'text-white' : 'text-gray-300'
                }`}
              >
                <Plus className="inline h-4 w-4 mr-1" />
                비디오 생성
              </Link>
              <Link 
                href="/my-videos" 
                className={`text-sm font-medium tracking-tight transition-colors hover:text-white ${
                  isActive('/my-videos') ? 'text-white' : 'text-gray-300'
                }`}
              >
                <Video className="inline h-4 w-4 mr-1" />
                내 비디오
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Create Button */}
            <Button size="sm" className="hidden sm:flex bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-1" />
                생성하기
              </Link>
            </Button>

            {/* 사용량 표시 */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-sm text-gray-300">
                <span className="font-medium">{usageCount}</span>
                <span className="text-gray-400">/{usageLimit}</span>
              </div>
              <div className="w-20">
                <Progress value={getUsagePercentage()} className="h-2" />
              </div>
              <div className="text-xs text-gray-400 capitalize tracking-tight">
                {subscriptionTier}
              </div>
            </div>

            {/* 요금제 링크 */}
            <Link 
              href="/pricing" 
              className={`text-sm font-medium tracking-tight transition-colors ${
                isActive('/pricing') 
                  ? 'text-blue-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              요금제
            </Link>

            {/* 사용자 메뉴 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile?.full_name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* 플랜 정보 */}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/pricing" className="flex items-center gap-2">
                    {getPlanIcon(userProfile?.subscription_tier || 'free')}
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {getPlanName(userProfile?.subscription_tier || 'free')} 플랜
                      </span>
                      <span className="text-xs text-gray-500">
                        {userProfile?.usage_count || 0}/{userProfile?.usage_limit || 3} 사용
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>대시보드</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/my-videos" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>내 영상</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 