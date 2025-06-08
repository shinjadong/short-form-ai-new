'use client'

import HybridWorkflowNew from '@/components/fast-gen/hybrid-workflow-new'
import NavigationHeader from '@/components/navigation-header'

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <NavigationHeader />
      <div className="container mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎬 Shot Form AI 영상 생성기
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI 오토매틱 모드로 3초 룰 헌법 기반 고품질 영상을 빠르게 생성하세요
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ⚡ 새로워진 UI - 깔끔하고 직관적인 인터페이스
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <HybridWorkflowNew />
        </div>
      </div>
    </div>
  )
} 