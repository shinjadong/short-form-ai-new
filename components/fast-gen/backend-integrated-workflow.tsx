'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, CheckCircle, AlertCircle, Loader2, Zap, 
  Image as ImageIcon, Video, Volume2, Subtitles,
  Settings, Sparkles
} from 'lucide-react'
import { useBackendIntegratedWorkflow } from '@/hooks/useDirectApiCalls'
import { useToast } from '@/hooks/use-toast'

interface BackendIntegratedWorkflowProps {
  script?: string
  subject?: string
  onComplete?: (result: {
    keywords: string[]
    audio: any
    videos: any[]
    images?: any[]
    subtitle?: any
  }) => void
}

export function BackendIntegratedWorkflow({ 
  script: initialScript, 
  subject: initialSubject, 
  onComplete 
}: BackendIntegratedWorkflowProps) {
  const { toast } = useToast()
  const workflow = useBackendIntegratedWorkflow()
  
  // 로컬 상태로 스크립트와 주제 관리
  const [script, setScript] = useState(initialScript || '')
  const [subject, setSubject] = useState(initialSubject || '')
  const [selectedActorId, setSelectedActorId] = useState('603fa172a669dfd23f450abd') // 기본 액터
  const [startTime, setStartTime] = useState<number | null>(null)

  // 🆕 백엔드 통합 설정들
  const [includeImages, setIncludeImages] = useState(false)
  const [subtitleStyle, setSubtitleStyle] = useState<'youtube' | 'netflix' | 'anime' | 'aesthetic' | 'custom'>('youtube')
  const [subtitleAnimation, setSubtitleAnimation] = useState('none')
  const [koreanOptimization, setKoreanOptimization] = useState(true)
  const [imageAspect, setImageAspect] = useState<'portrait' | 'landscape' | 'square'>('portrait')
  const [imageSize, setImageSize] = useState<'l' | 'm' | 'i'>('l')

  // 자막 스타일 및 애니메이션 목록 로드
  useEffect(() => {
    workflow.subtitleStyles.fetchStylesAndAnimations()
  }, [])

  // 워크플로우 스텝 정의 (백엔드 기능 포함)
  const steps = [
    {
      id: 1,
      title: '스크립트 준비',
      description: '비디오 스크립트 및 설정 확인',
      duration: '완료',
      icon: CheckCircle
    },
    {
      id: 2,
      title: '키워드 생성',
      description: 'AI가 검색 키워드 생성 (한국어 번역 지원)',
      duration: '3초',
      icon: Zap
    },
    {
      id: 3,
      title: '음성 생성',
      description: 'TypeCast AI 음성 합성',
      duration: '10초',
      icon: Volume2
    },
    {
      id: 4,
      title: '영상 검색',
      description: 'Pexels에서 세로형 영상 검색',
      duration: '즉시',
      icon: Video
    },
    {
      id: 5,
      title: '이미지 검색',
      description: 'Google Images에서 고품질 이미지 검색',
      duration: '즉시',
      icon: ImageIcon,
      optional: true
    },
    {
      id: 6,
      title: '강화된 자막',
      description: '다양한 스타일과 애니메이션 자막 생성',
      duration: '2초',
      icon: Subtitles
    },
    {
      id: 7,
      title: '최종 합성',
      description: '백엔드에서 비디오 합성',
      duration: '3-5분',
      icon: Clock
    }
  ]

  const getStepStatus = (stepId: number) => {
    if (workflow.completedSteps.includes(stepId)) return 'completed'
    if (workflow.currentStep === stepId) return 'current'
    if (stepId === 5 && !includeImages) return 'skipped'
    return 'pending'
  }

  const getStepIcon = (step: any, status: string) => {
    if (status === 'completed') return CheckCircle
    if (status === 'current' && workflow.isProcessing) return Loader2
    if (status === 'skipped') return CheckCircle
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
      // 🚀 백엔드 통합 워크플로우 실행
      const result = await workflow.runFullWorkflow(script, subject, selectedActorId, {
        includeImages,
        subtitleStyle,
        subtitleAnimation,
        korean_optimization: koreanOptimization
      })
      
      const totalTime = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
      
      toast({
        title: '백엔드 통합 워크플로우 완료! 🎉',
        description: `모든 소재가 ${totalTime}초만에 준비되었습니다. 이제 최종 합성을 진행하세요.`,
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
    const totalSteps = includeImages ? 6 : 5 // 백엔드 합성 제외
    const completed = workflow.completedSteps.filter(step => step <= (includeImages ? 6 : 5)).length
    return (completed / totalSteps) * 100
  }

  return (
    <div className="space-y-6">
      {/* 기본 입력 섹션 */}
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
              placeholder="비디오에서 읽을 스크립트를 입력해주세요. (최대 300자)"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              disabled={workflow.isProcessing}
              rows={4}
              maxLength={300}
            />
            <div className="text-sm text-gray-500 text-right">
              {script.length}/300자
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 백엔드 통합 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            백엔드 기능 설정
          </CardTitle>
          <CardDescription>
            어제 개선한 백엔드 기능들을 활용한 고급 설정입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subtitle" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="subtitle">강화된 자막</TabsTrigger>
              <TabsTrigger value="image">이미지 검색</TabsTrigger>
              <TabsTrigger value="korean">한국어 최적화</TabsTrigger>
            </TabsList>

            <TabsContent value="subtitle" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>자막 스타일</Label>
                  <Select value={subtitleStyle} onValueChange={(value: any) => setSubtitleStyle(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube 스타일</SelectItem>
                      <SelectItem value="netflix">Netflix 스타일</SelectItem>
                      <SelectItem value="anime">애니메이션 스타일</SelectItem>
                      <SelectItem value="aesthetic">미적 스타일</SelectItem>
                      <SelectItem value="custom">커스텀 스타일</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>애니메이션 효과</Label>
                  <Select value={subtitleAnimation} onValueChange={setSubtitleAnimation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">없음</SelectItem>
                      <SelectItem value="fade_in">페이드 인</SelectItem>
                      <SelectItem value="fade_out">페이드 아웃</SelectItem>
                      <SelectItem value="typewriter">타이프라이터</SelectItem>
                      <SelectItem value="slide_up">슬라이드 업</SelectItem>
                      <SelectItem value="zoom_in">줌 인</SelectItem>
                      <SelectItem value="glow">글로우</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">✨ 강화된 자막 기능</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• ASS 포맷 지원으로 고품질 자막</li>
                  <li>• 다양한 스타일과 애니메이션</li>
                  <li>• 한국어 최적화 폰트 적용</li>
                  <li>• 실시간 미리보기 가능</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeImages" 
                    checked={includeImages}
                    onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
                  />
                  <Label htmlFor="includeImages">Google Images에서 이미지 검색 (SerpAPI)</Label>
                </div>

                {includeImages && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>이미지 종횡비</Label>
                      <Select value={imageAspect} onValueChange={(value: any) => setImageAspect(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">세로형 (9:16)</SelectItem>
                          <SelectItem value="landscape">가로형 (16:9)</SelectItem>
                          <SelectItem value="square">정사각형 (1:1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>이미지 크기</Label>
                      <Select value={imageSize} onValueChange={(value: any) => setImageSize(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="l">큰 이미지</SelectItem>
                          <SelectItem value="m">중간 이미지</SelectItem>
                          <SelectItem value="i">아이콘</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🖼️ SerpAPI 이미지 검색</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Google Images에서 고품질 이미지</li>
                    <li>• 한국어 검색어 자동 번역</li>
                    <li>• 다양한 크기와 종횡비 지원</li>
                    <li>• 안전 검색 필터 적용</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="korean" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="koreanOptimization" 
                    checked={koreanOptimization}
                    onCheckedChange={(checked) => setKoreanOptimization(checked as boolean)}
                  />
                  <Label htmlFor="koreanOptimization">한국어 콘텐츠 최적화</Label>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">🇰🇷 한국어 최적화 기능</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• 한국어 검색어 자동 영어 번역</li>
                    <li>• 한국어 폰트 (NanumGothic) 적용</li>
                    <li>• 한국어 자막 간격 최적화</li>
                    <li>• 한국 지역 콘텐츠 우선 검색</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 워크플로우 실행 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            백엔드 통합 워크플로우
          </CardTitle>
          <CardDescription>
            어제 개선한 모든 백엔드 기능을 활용한 고품질 비디오 생성
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
              size="lg"
            >
              {workflow.isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  백엔드 기능 실행 중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  백엔드 통합 워크플로우 시작
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
              ${status === 'skipped' ? 'border-gray-300 bg-gray-50' : ''}
              ${status === 'pending' ? 'border-gray-200' : ''}
              ${step.optional && !includeImages ? 'opacity-50' : ''}
            `}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-full
                      ${status === 'completed' ? 'bg-green-500 text-white' : ''}
                      ${status === 'current' ? 'bg-blue-500 text-white' : ''}
                      ${status === 'skipped' ? 'bg-gray-400 text-white' : ''}
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
                      status === 'current' ? 'secondary' : 
                      status === 'skipped' ? 'outline' : 'outline'
                    }>
                      {step.duration}
                    </Badge>
                    {status === 'completed' && (
                      <Badge variant="outline" className="text-green-600">
                        완료
                      </Badge>
                    )}
                    {status === 'skipped' && (
                      <Badge variant="outline" className="text-gray-500">
                        생략
                      </Badge>
                    )}
                    {isProcessing && (
                      <Badge variant="outline" className="text-blue-600">
                        진행중
                      </Badge>
                    )}
                    {step.optional && (
                      <Badge variant="outline" className="text-purple-600">
                        선택사항
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
            <CardTitle>🎬 생성 결과 미리보기</CardTitle>
            <CardDescription>각 단계별로 생성된 결과를 확인할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 키워드 결과 */}
            {workflow.keywordGeneration.keywords.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  생성된 키워드 (한국어 번역 지원)
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

            {workflow.keywordGeneration.keywords.length > 0 && <Separator />}

            {/* 음성 결과 */}
            {workflow.voiceGeneration.audioData && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  생성된 음성 (TypeCast AI)
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

            {workflow.voiceGeneration.audioData && <Separator />}

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

            {workflow.videoSearch.videos.length > 0 && <Separator />}

            {/* 이미지 결과 */}
            {workflow.imageSearch.images.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  검색된 이미지 ({workflow.imageSearch.images.length}개) - SerpAPI
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {workflow.imageSearch.images.slice(0, 12).map((image) => (
                    <div key={image.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={image.thumbnail_url} 
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                        {image.format}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {workflow.imageSearch.images.length > 0 && <Separator />}

            {/* 자막 결과 */}
            {workflow.enhancedSubtitle.subtitleData && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  강화된 자막 생성 완료
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    스타일: {subtitleStyle} | 애니메이션: {subtitleAnimation} | 
                    처리시간: {workflow.enhancedSubtitle.subtitleData.processing_time}ms
                  </p>
                  <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                    <code className="text-xs">
                      {workflow.enhancedSubtitle.subtitleData.subtitle_content?.substring(0, 500)}
                      {workflow.enhancedSubtitle.subtitleData.subtitle_content && 
                       workflow.enhancedSubtitle.subtitleData.subtitle_content.length > 500 && '...'}
                    </code>
                  </div>
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