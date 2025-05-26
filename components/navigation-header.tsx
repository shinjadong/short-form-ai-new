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
import { LogOut, User, Video, Settings, Plus, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavigationHeader() {
  const { user, userProfile, signOut } = useAuth()
  const { usageCount, usageLimit, getUsagePercentage, subscriptionTier } = useUsageLimit()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const isActive = (path: string) => pathname === path

  if (!user) {
    return (
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Shot Form AI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">회원가입</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Shot Form AI
            </Link>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  isActive('/') ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                <Home className="inline h-4 w-4 mr-1" />
                홈
              </Link>
              <Link 
                href="/create" 
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  isActive('/create') ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                <Plus className="inline h-4 w-4 mr-1" />
                비디오 생성
              </Link>
              <Link 
                href="/my-videos" 
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  isActive('/my-videos') ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                <Video className="inline h-4 w-4 mr-1" />
                내 비디오
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Create Button */}
            <Button size="sm" className="hidden sm:flex" asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-1" />
                생성하기
              </Link>
            </Button>

            {/* 사용량 표시 */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{usageCount}</span>
                <span className="text-gray-400">/{usageLimit}</span>
              </div>
              <div className="w-20">
                <Progress value={getUsagePercentage()} className="h-2" />
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {subscriptionTier}
              </div>
            </div>

            {/* 사용자 메뉴 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile?.email || user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {subscriptionTier} 플랜
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* 모바일에서 사용량 표시 */}
                <div className="lg:hidden px-2 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">사용량</span>
                    <span className="font-medium">
                      {usageCount}/{usageLimit}
                    </span>
                  </div>
                  <Progress value={getUsagePercentage()} className="h-2 mt-1" />
                </div>
                <DropdownMenuSeparator className="lg:hidden" />

                {/* 모바일 네비게이션 */}
                <div className="md:hidden">
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>홈</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create" className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>비디오 생성</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-videos" className="cursor-pointer">
                      <Video className="mr-2 h-4 w-4" />
                      <span>내 비디오</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>프로필</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>설정</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
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