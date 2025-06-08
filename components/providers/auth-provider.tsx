'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClientSupabase } from '@/lib/supabase-client'
import type { Database } from '@/types/database'
import { useRouter } from 'next/navigation'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const supabase = createClientSupabase()

  useEffect(() => {
    // 초기 세션 확인
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          if (event === 'SIGNED_IN') {
            await fetchUserProfile(session.user.id)
          }
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // 사용자 프로필이 없는 경우 (Google OAuth 등으로 처음 로그인)
        if (error.code === 'PGRST116') {
          console.log('사용자 프로필이 없어서 새로 생성합니다.')
          await createUserProfile(userId)
          return
        }
        console.error('프로필 조회 오류:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('프로필 조회 중 오류:', error)
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      const email = userData.user?.email || ''
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          subscription_tier: 'free',
          usage_limit: 10,
          usage_count: 0,
        })
        .select()
        .single()

      if (error) {
        console.error('프로필 생성 오류:', error)
        return
      }

      console.log('사용자 프로필이 생성되었습니다:', data)
      setUserProfile(data)
    } catch (error) {
      console.error('프로필 생성 중 오류:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    // 회원가입 성공 시 사용자 프로필 생성
    if (data.user && !error) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email,
          subscription_tier: 'free',
          usage_limit: 10,
          usage_count: 0,
        })

      if (profileError) {
        console.error('프로필 생성 오류:', profileError)
      }
    }

    return { error }
  }

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (!response.ok) {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('로그아웃 오류:', error)
      // 실패하더라도 클라이언트 상태는 초기화 시도
    } finally {
      // 모든 상태 초기화
      setUser(null)
      setSession(null)
      setUserProfile(null)
      // 홈으로 리디렉션하고 서버 상태 갱신
      router.push('/')
      router.refresh()
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        console.error('프로필 업데이트 오류:', error)
        return
      }

      // 로컬 상태 업데이트
      setUserProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('프로필 업데이트 중 오류:', error)
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 사용량 제한 체크 훅
export function useUsageLimit() {
  const { userProfile } = useAuth()
  
  const canCreateVideo = () => {
    if (!userProfile) return false
    return (userProfile.usage_count || 0) < (userProfile.usage_limit || 0)
  }

  const getRemainingUsage = () => {
    if (!userProfile) return 0
    return Math.max(0, (userProfile.usage_limit || 0) - (userProfile.usage_count || 0))
  }

  const getUsagePercentage = () => {
    if (!userProfile || !userProfile.usage_limit) return 0
    return Math.min(100, ((userProfile.usage_count || 0) / userProfile.usage_limit) * 100)
  }

  return {
    canCreateVideo,
    getRemainingUsage,
    getUsagePercentage,
    usageCount: userProfile?.usage_count || 0,
    usageLimit: userProfile?.usage_limit || 0,
    subscriptionTier: userProfile?.subscription_tier || 'free',
  }
}
