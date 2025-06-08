'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Video, 
  Mic, 
  FileText, 
  Search,
  RefreshCcw,
  Zap
} from 'lucide-react'

interface MaterialPreparationPanelProps {
  preparationStep: number
  currentStepDescription: string
  totalProgress: number
  preparationErrors: {[key: number]: string}
  retryCount: {[key: number]: number}
  isStepBlocked: {[key: number]: boolean}
  onRetryStep: (step: number) => void
  preparedMaterials: {
    script: string
    audioFile: any
    subtitleContent: string
    isReady: boolean
  }
  className?: string
}

const MaterialPreparationPanel: React.FC<MaterialPreparationPanelProps> = ({
  preparationStep,
  currentStepDescription,
  totalProgress,
  preparationErrors,
  retryCount,
  isStepBlocked,
  onRetryStep,
  preparedMaterials,
  className = ''
}) => {
  const stepItems = [
    { 
      id: 1, 
      title: '스크립트 생성', 
      icon: FileText, 
      description: '3초 룰 헌법 기반 스크립트 작성',
      estimatedTime: '5초'
    },
    { 
      id: 2, 
      title: '음성 합성', 
      icon: Mic, 
      description: 'TypeCast AI 고품질 음성 생성',
      estimatedTime: '8초'
    },
    { 
      id: 3, 
      title: '자막 생성', 
      icon: Video, 
      description: 'Whisper 기반 정밀 자막 생성',
      estimatedTime: '5초'
    },
    { 
      id: 4, 
      title: '소재 검색', 
      icon: Search, 
      description: '구간별 최적 비디오/이미지 검색',
      estimatedTime: '7초'
    }
  ]

  const getStepStatus = (stepId: number) => {
    if (preparationErrors[stepId]) return 'error'
    if (isStepBlocked[stepId]) return 'blocked'
    if (preparationStep > stepId) return 'completed'
    if (preparationStep === stepId) return 'active'
    return 'pending'
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-300'
      case 'active': return 'text-blue-600 bg-blue-100 border-blue-300'
      case 'error': return 'text-red-600 bg-red-100 border-red-300'
      case 'blocked': return 'text-gray-600 bg-gray-100 border-gray-300'
      default: return 'text-gray-400 bg-gray-50 border-gray-200'
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'error': 
      case 'blocked': return AlertCircle
      case 'active': return Clock
      default: return Clock
    }
  }

  return (
    <Card className={`border-purple-200 bg-purple-50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-purple-600" />
          소재 준비 진행 상황
        </CardTitle>
        <CardDescription>
          AI가 영상 제작에 필요한 모든 소재를 자동으로 준비합니다
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 전체 진행률 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">전체 진행률</span>
            <span className="text-sm text-gray-600">{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-3" />
          <div className="text-xs text-gray-500 text-center">
            {currentStepDescription}
          </div>
        </div>

        {/* 단계별 상세 진행 상황 */}
        <div className="space-y-3">
          {stepItems.map((step) => {
            const status = getStepStatus(step.id)
            const StatusIcon = getStepIcon(status)
            const colorClass = getStepColor(status)
            const hasError = preparationErrors[step.id]
            const retries = retryCount[step.id] || 0

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${colorClass}`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status === 'active' ? 'animate-pulse' : ''
                  }`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="flex items-center gap-2">
                      {status === 'active' && (
                        <Badge variant="outline" className="text-xs">
                          {step.estimatedTime}
                        </Badge>
                      )}
                      {retries > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          재시도 {retries}/3
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {step.description}
                  </div>

                  {/* 에러 메시지 및 재시도 버튼 */}
                  {hasError && (
                    <Alert className="mt-2 p-2">
                      <AlertCircle className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        {hasError}
                        {!isStepBlocked[step.id] && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRetryStep(step.id)}
                            className="ml-2 h-6 text-xs"
                          >
                            <RefreshCcw className="h-3 w-3 mr-1" />
                            재시도
                          </Button>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* 체크마크 */}
                {status === 'completed' && (
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 준비된 소재 요약 */}
        {preparedMaterials.isReady && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">소재 준비 완료!</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span>스크립트: {preparedMaterials.script ? '✅' : '❌'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-gray-600" />
                <span>음성파일: {preparedMaterials.audioFile ? '✅' : '❌'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-gray-600" />
                <span>자막: {preparedMaterials.subtitleContent ? '✅' : '❌'}</span>
              </div>
            </div>
          </div>
        )}

        {/* 예상 시간 안내 */}
        {preparationStep > 0 && preparationStep < 5 && (
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              ⏱️ 예상 완료시간: 약 {25 - (preparationStep * 6)}초 남음
            </div>
            <div className="text-xs text-blue-600 mt-1">
              AI가 최고 품질의 소재를 준비하고 있습니다
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MaterialPreparationPanel 