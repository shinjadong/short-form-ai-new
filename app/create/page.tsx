'use client'

import HybridWorkflow from '@/components/fast-gen/hybrid-workflow'
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
            프론트엔드 소재 준비 + 백엔드 최종 합성으로 빠르고 고품질 영상을 생성하세요
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ⚡ 소요시간: 50초 (준비 20초 + 합성 30초)
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <HybridWorkflow />
        </div>
      </div>
    </div>
  )
} 