'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react'
import { useOptimizedWorkflow } from '@/hooks/useDirectApiCalls'
import { useToast } from '@/hooks/use-toast'

interface OptimizedWorkflowProps {
  script?: string
  subject?: string
  onComplete?: (result: {
    keywords: string[]
    audio: any
    videos: any[]
  }) => void
}

export function OptimizedWorkflow({ script: initialScript, subject: initialSubject, onComplete }: OptimizedWorkflowProps) {
  const { toast } = useToast()
  const workflow = useOptimizedWorkflow()
  
  // 로컬 상태로 스크립트와 주제 관리
  const [script, setScript] = useState(initialScript || '')
  const [subject, setSubject] = useState(initialSubject || '')
  const [selectedActorId, setSelectedActorId] = useState('603fa172a669dfd23f450abd') // 기본 액터
  const [startTime, setStartTime] = useState<number | null>(null)

  // 워크플로우 스텝 정의
  const steps = [
    {
      id: 1,
      title: '스크립트 준비',
      description: '비디오 스크립트 확인',
      duration: '완료',
      icon: CheckCircle
    },
    {
      id: 2,
      title: '키워드 생성',
      description: 'AI가 검색 키워드 생성',
      duration: '3초',
      icon: Zap
    },
    {
      id: 3,
      title: '음성 생성',
      description: 'TypeCast AI 음성 합성',
      duration: '10초',
      icon: Zap
    },
    {
      id: 4,
      title: '영상 검색',
      description: 'Pexels에서 적합한 영상 검색',
      duration: '즉시',
      icon: Zap
    },
    {
      id: 5,
      title: '최종 합성',
      description: '백엔드에서 비디오 합성',
      duration: '3-5분',
      icon: Clock
    }
  ]

  const getStepStatus = (stepId: number) => {
    if (workflow.completedSteps.includes(stepId)) return 'completed'
    if (workflow.currentStep === stepId) return 'current'
    return 'pending'
  }

  const getStepIcon = (step: any, status: string) => {
    if (status === 'completed') return CheckCircle
    if (status === 'current' && workflow.isProcessing) return Loader2
    return step.icon
  }

  const handleStartWorkflow = async () => {
    if (!script.trim() || !subject.trim()) {
      toast({
        title: '입력 오류',
        description: '스크립트와 주제를 모두 입력해주세요.',
        variant: 'destructive'
      })
      return
    }

    setStartTime(Date.now())
    
    try {
      // 🚀 최적화된 자동 워크플로우 실행
      const result = await workflow.runAutoWorkflow(script, subject, selectedActorId)
      
      const totalTime = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
      
      toast({
        title: '워크플로우 완료! 🎉',
        description: `소재 준비가 ${totalTime}초만에 완료되었습니다. 이제 최종 합성을 진행하세요.`,
      })

      onComplete?.(result)
    } catch (error) {
      toast({
        title: '워크플로우 오류',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive'
      })
    }
  }

  const getProgressPercentage = () => {
    const totalSteps = 4 // 백엔드 합성 제외
    const completed = workflow.completedSteps.filter(step => step <= 4).length
    return (completed / totalSteps) * 100
  }

  return (
    <div className="space-y-6">
      {/* 입력 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 스크립트 및 주제 입력
          </CardTitle>
          <CardDescription>
            비디오에 사용할 스크립트와 주제를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">주제 *</Label>
            <Input
              id="subject"
              placeholder="예: 건강한 라이프스타일, 요리 레시피, 여행 팁 등"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={workflow.isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="script">스크립트 *</Label>
            <Textarea
              id="script"
              placeholder="비디오에서 읽을 스크립트를 입력해주세요. (최대 200자)"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              disabled={workflow.isProcessing}
              rows={4}
              maxLength={200}
            />
            <div className="text-sm text-gray-500 text-right">
              {script.length}/200자
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            최적화된 비디오 생성 워크플로우
          </CardTitle>
          <CardDescription>
            각 단계별로 즉시 피드백을 받으며 효율적으로 비디오를 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 전체 진행률 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>전체 진행률</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {/* 시작 버튼 */}
            <Button 
              onClick={handleStartWorkflow}
              disabled={workflow.isProcessing || !script.trim() || !subject.trim()}
              className="w-full"
            >
              {workflow.isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  즉시 소재 생성 시작
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 워크플로우 스텝 */}
      <div className="grid gap-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const StepIcon = getStepIcon(step, status)
          const isProcessing = status === 'current' && workflow.isProcessing

          return (
            <Card key={step.id} className={`
              transition-all duration-300
              ${status === 'completed' ? 'border-green-500 bg-green-50' : ''}
              ${status === 'current' ? 'border-blue-500 bg-blue-50' : ''}
              ${status === 'pending' ? 'border-gray-200' : ''}
            `}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-full
                      ${status === 'completed' ? 'bg-green-500 text-white' : ''}
                      ${status === 'current' ? 'bg-blue-500 text-white' : ''}
                      ${status === 'pending' ? 'bg-gray-200 text-gray-500' : ''}
                    `}>
                      <StepIcon className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      status === 'completed' ? 'default' :
                      status === 'current' ? 'secondary' : 'outline'
                    }>
                      {step.duration}
                    </Badge>
                    {status === 'completed' && (
                      <Badge variant="outline" className="text-green-600">
                        완료
                      </Badge>
                    )}
                    {isProcessing && (
                      <Badge variant="outline" className="text-blue-600">
                        진행중
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 결과 미리보기 */}
      {workflow.completedSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>생성 결과 미리보기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 키워드 결과 */}
            {workflow.keywordGeneration.keywords.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  생성된 키워드
                </h4>
                <div className="flex flex-wrap gap-2">
                  {workflow.keywordGeneration.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* 음성 결과 */}
            {workflow.voiceGeneration.audioData && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  생성된 음성
                </h4>
                <div className="space-y-2">
                  <audio 
                    controls 
                    src={workflow.voiceGeneration.audioData.audioUrl}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    길이: {workflow.voiceGeneration.audioData.duration}초 | 
                    형식: {workflow.voiceGeneration.audioData.format}
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* 비디오 결과 */}
            {workflow.videoSearch.videos.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  검색된 영상 ({workflow.videoSearch.videos.length}개)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {workflow.videoSearch.videos.slice(0, 8).map((video) => (
                    <div key={video.id} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={`Video ${video.id}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                        {video.duration}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 에러 표시 */}
      {workflow.hasError && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">오류 발생</span>
            </div>
            <div className="mt-2 space-y-1">
              {workflow.errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">{error}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 