'use client'

import { Suspense } from 'react'
import AuthCallbackContent from './auth-callback-content'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 처리 중...</p>
          <p className="mt-2 text-sm text-gray-500">Google 인증을 확인하고 있습니다.</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 