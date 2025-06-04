import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 서버 사이드용 Supabase 클라이언트 (Server Components)
export const createServerSupabase = async () => {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// API 라우트용 Supabase 클라이언트
export const createApiSupabase = (req: Request) => {
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          const cookies = req.headers.get('cookie')
          if (!cookies) return undefined
          
          const value = cookies
            .split(';')
            .find(cookie => cookie.trim().startsWith(`${name}=`))
            ?.split('=')[1]
          
          return value
        },
        set(name: string, value: string, options: any) {
          // API 라우트에서는 쿠키 설정이 복잡하므로 일단 비워둡니다.
          // 필요시 Response 헤더에 직접 설정해야 합니다.
        },
        remove(name: string, options: any) {
          // API 라우트에서는 쿠키 삭제가 복잡하므로 일단 비워둡니다.
        },
      },
    }
  )
}
