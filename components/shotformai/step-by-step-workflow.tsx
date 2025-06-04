'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Circle, 
  FileText, 
  Video, 
  Music, 
  MessageSquare, 
  Rocket,
  Sparkles,
  Play,
  Loader2,
  Download,
  ArrowRight,
  ArrowLeft,
  Brain,
  Hash,
  Eye
} from 'lucide-react'

interface StepData {
  subject: string
  language: string
  script: string
  keywords: string
  videoSource: string
  concatMode: string
  transitionMode: string
  aspectRatio: string
  clipDuration: number
  videoCount: number
  voiceName: string
  voiceVolume: number
  voiceRate: number
  bgmType: string
  bgmVolume: number
  subtitleEnabled: boolean
  fontName: string
  subtitlePosition: string
  customPosition: number
  textColor: string
  textBackgroundColor: boolean
  fontSize: number
  strokeColor: string
  strokeWidth: number
  nThreads: number
  paragraphNumber: number
}

const initialStepData: StepData = {
  subject: '',
  language: 'ko-KR',
  script: '',
  keywords: '',
  videoSource: 'pexels',
  concatMode: 'random',
  transitionMode: 'None',
  aspectRatio: '9:16',
  clipDuration: 3,
  videoCount: 1,
  voiceName: '',
  voiceVolume: 1.0,
  voiceRate: 1.0,
  bgmType: 'random',
  bgmVolume: 0.2,
  subtitleEnabled: true,
  fontName: 'MicrosoftYaHeiBold.ttc',
  subtitlePosition: 'bottom',
  customPosition: 70.0,
  textColor: '#FFFFFF',
  textBackgroundColor: true,
  fontSize: 60,
  strokeColor: '#000000',
  strokeWidth: 1.5,
  nThreads: 2,
  paragraphNumber: 1
}

export default function StepByStepWorkflow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepData, setStepData] = useState<StepData>(initialStepData)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingStep, setGeneratingStep] = useState('')
  const [taskId, setTaskId] = useState<string | null>(null)
  const [videoProgress, setVideoProgress] = useState(0)
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [useTypecast, setUseTypecast] = useState(false)
  const [typecastActors, setTypecastActors] = useState<any[]>([])
  const [selectedTypecastActor, setSelectedTypecastActor] = useState('')
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState<string | null>(null)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)

  const steps = [
    { id: 1, title: '스크립트 생성', icon: FileText, description: '주제를 입력하고 AI가 스크립트를 생성합니다' },
    { id: 2, title: '비디오 설정', icon: Video, description: '비디오 소스와 설정을 선택합니다' },
    { id: 3, title: '오디오 설정', icon: Music, description: '음성과 배경음악을 설정합니다' },
    { id: 4, title: '자막 설정', icon: MessageSquare, description: '자막 스타일을 커스터마이징합니다' },
    { id: 5, title: '비디오 생성', icon: Rocket, description: '최종 비디오를 생성합니다' }
  ]

  const koreanExamples = [
    "행복한 삶을 위한 5가지 습관",
    "건강한 라이프스타일의 비밀", 
    "성공하는 사람들의 아침 루틴",
    "효율적인 시간 관리 방법",
    "마음의 평화를 찾는 법"
  ]

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'pending'
  }

  const validateStep = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return stepData.subject.trim() !== '' && stepData.script.trim() !== ''
      case 2:
        return stepData.videoSource !== '' && stepData.aspectRatio !== ''
      case 3:
        if (useTypecast) {
          return selectedTypecastActor !== ''
        } else {
          return stepData.voiceName !== ''
        }
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateScript = async () => {
    setIsGenerating(true)
    setGeneratingStep('OpenAI로 스크립트 생성 중...')
    setError(null)
    
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: stepData.subject,
          language: stepData.language || 'ko-KR'
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setStepData(prev => ({
          ...prev,
          script: result.script,
          keywords: Array.isArray(result.keywords) ? result.keywords.join(', ') : result.keywords || ''
        }))
      } else {
        throw new Error(result.error || '스크립트 생성에 실패했습니다')
      }
    } catch (error) {
      console.error('스크립트 생성 실패:', error)
      setError(error instanceof Error ? error.message : '스크립트 생성에 실패했습니다')
    } finally {
      setIsGenerating(false)
      setGeneratingStep('')
    }
  }

  const generateVideo = async () => {
    setIsGenerating(true)
    setGeneratingStep('비디오 생성 요청 중...')
    setError(null)
    setVideoProgress(0)
    
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stepData)
      })
      
      const result = await response.json()
      if (result.success && result.task_id) {
        setTaskId(result.task_id)
        setGeneratingStep('비디오 생성 중...')
        startPollingTaskStatus(result.task_id)
      } else {
        throw new Error(result.error || '비디오 생성에 실패했습니다')
      }
    } catch (error) {
      console.error('비디오 생성 실패:', error)
      setError(error instanceof Error ? error.message : '비디오 생성에 실패했습니다')
      setIsGenerating(false)
      setGeneratingStep('')
    }
  }

  const startPollingTaskStatus = (taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/task-status?taskId=${taskId}`)
        const result = await response.json()
        
        if (result.success && result.data) {
          const { state, progress, videos, error: taskError } = result.data
          
          setVideoProgress(progress || 0)
          
          if (state === 2) { // 완료
            setGeneratedVideos(videos || [])
            setCompletedSteps(prev => [...prev, 5])
            setIsGenerating(false)
            setGeneratingStep('')
            clearInterval(pollInterval)
          } else if (state === 3) { // 오류
            setError(taskError || '비디오 생성 중 오류가 발생했습니다')
            setIsGenerating(false)
            setGeneratingStep('')
            clearInterval(pollInterval)
          }
          // state === 1은 진행 중이므로 계속 polling
        }
      } catch (error) {
        console.error('상태 확인 실패:', error)
        setError('비디오 생성 상태를 확인할 수 없습니다')
        setIsGenerating(false)
        setGeneratingStep('')
        clearInterval(pollInterval)
      }
    }, 3000) // 3초마다 상태 확인
  }

  // TypeCast 액터 목록 로드
  useEffect(() => {
    const loadTypecastActors = async () => {
      try {
        const response = await fetch('/api/generate-typecast-voice')
        const result = await response.json()
        if (result.success && result.actors) {
          setTypecastActors(result.actors)
        }
      } catch (error) {
        console.error('TypeCast 액터 목록 로드 실패:', error)
      }
    }

    loadTypecastActors()
  }, [])

  // TypeCast 음성 생성
  const generateTypecastVoice = async () => {
    console.log('TypeCast 음성 생성 시작:', {
      hasScript: !!stepData.script,
      selectedActor: selectedTypecastActor,
      scriptLength: stepData.script?.length || 0
    })

    if (!stepData.script || !selectedTypecastActor) {
      setError('스크립트와 액터를 선택해주세요.')
      return
    }

    setIsGeneratingVoice(true)
    setError(null)

    try {
      const requestData = {
        text: stepData.script.slice(0, 1000), // 1000자 제한
        actor_id: selectedTypecastActor,
        lang: 'auto',
        xapi_hd: true,
        model_version: 'latest'
      }
      
      console.log('TypeCast API 요청 데이터:', requestData)

      // TypeCast 공식 API 형식으로 요청
      const response = await fetch('/api/generate-typecast-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      console.log('TypeCast API 응답 상태:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('TypeCast API 응답 오류:', errorText)
        throw new Error(`API 요청 실패: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log('TypeCast API 응답 결과:', result)

      if (result.success && result.audio_url) {
        setGeneratedVoiceUrl(result.audio_url)
        console.log('TypeCast 음성 생성 성공:', {
          format: result.format,
          actor_id: result.actor_id,
          audio_size: result.audio_data?.length || 0
        })
      } else {
        throw new Error(result.error || 'TypeCast 음성 생성에 실패했습니다')
      }
    } catch (error) {
      console.error('TypeCast 음성 생성 전체 오류:', error)
      const errorMessage = error instanceof Error ? error.message : 'TypeCast 음성 생성에 실패했습니다'
      setError(`TypeCast 오류: ${errorMessage}`)
    } finally {
      setIsGeneratingVoice(false)
    }
  }

  const progressPercentage = (completedSteps.length / 5) * 100

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 진행률 표시 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            숏폼AI 비디오 생성
          </CardTitle>
          <CardDescription>
            단계별로 설정을 완료하여 고품질 숏폼 비디오를 생성하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>진행률</span>
              <span>{completedSteps.length}/5 단계 완료</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 단계 네비게이션 */}
      <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const Icon = step.icon
          
          return (
            <div key={step.id} className="flex items-center">
              <Button
                variant={status === 'current' ? 'default' : status === 'completed' ? 'secondary' : 'outline'}
                size="sm"
                className="flex items-center gap-2 min-w-0"
                onClick={() => setCurrentStep(step.id)}
              >
                {status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : status === 'current' ? (
                  <Icon className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
              </Button>
              {index < steps.length - 1 && (
                <div className="h-px bg-border w-4 mx-2" />
              )}
            </div>
          )
        })}
      </div>

      {/* 에러 표시 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 현재 단계 콘텐츠 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">단계 {currentStep}</Badge>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </div>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* 단계 1: 스크립트 생성 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* 비디오 주제 입력 */}
              <div className="space-y-3">
                <Label htmlFor="subject">비디오 주제</Label>
                <div className="space-y-2">
                  <Select onValueChange={(value: string) => setStepData(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="예시 주제를 선택하거나 직접 입력하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {koreanExamples.map((example, index) => (
                        <SelectItem key={index} value={example}>
                          {example}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="subject"
                    placeholder="또는 직접 주제를 입력하세요..."
                    value={stepData.subject}
                    onChange={(e) => setStepData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
              </div>

              {/* 스크립트 생성 버튼 */}
              <Button 
                onClick={generateScript} 
                disabled={!stepData.subject.trim() || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    OpenAI로 스크립트 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    OpenAI로 스크립트 생성
                  </>
                )}
              </Button>

              {/* 생성된 스크립트 */}
              {stepData.script && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label htmlFor="script">생성된 스크립트</Label>
                    <Textarea
                      id="script"
                      value={stepData.script}
                      onChange={(e) => setStepData(prev => ({ ...prev, script: e.target.value }))}
                      rows={8}
                      placeholder="스크립트가 여기에 나타납니다..."
                    />
                  </div>
                </>
              )}

              {/* 생성된 키워드 */}
              {stepData.keywords && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    생성된 키워드
                  </Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{stepData.keywords}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    이 키워드들은 다음 단계에서 관련 배경 영상을 찾는데 사용됩니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 단계 2: 비디오 설정 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>비디오 소스</Label>
                  <Select 
                    value={stepData.videoSource} 
                    onValueChange={(value: string) => setStepData(prev => ({ ...prev, videoSource: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pexels">Pexels (무료 고품질)</SelectItem>
                      <SelectItem value="pixabay">Pixabay (다양한 선택)</SelectItem>
                      <SelectItem value="local">로컬 파일</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>화면 비율</Label>
                  <Select 
                    value={stepData.aspectRatio} 
                    onValueChange={(value: string) => setStepData(prev => ({ ...prev, aspectRatio: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:16">세로 (9:16) - 모바일 최적화</SelectItem>
                      <SelectItem value="16:9">가로 (16:9) - 데스크톱 최적화</SelectItem>
                      <SelectItem value="1:1">정사각형 (1:1) - SNS 최적화</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>클립 길이: {stepData.clipDuration}초</Label>
                  <Slider
                    value={[stepData.clipDuration]}
                    onValueChange={(value) => setStepData(prev => ({ ...prev, clipDuration: value[0] }))}
                    max={10}
                    min={2}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>연결 모드</Label>
                  <Select 
                    value={stepData.concatMode} 
                    onValueChange={(value: string) => setStepData(prev => ({ ...prev, concatMode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">랜덤 순서</SelectItem>
                      <SelectItem value="sequential">순차 연결</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert>
                <Video className="h-4 w-4" />
                <AlertDescription>
                  키워드를 기반으로 자동으로 관련 영상을 찾아서 매칭합니다.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* 단계 3: 오디오 설정 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* 음성 엔진 선택 */}
              <div className="space-y-4">
                <Label className="text-base font-medium">음성 엔진 선택</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="azure-tts"
                      name="voice-engine"
                      checked={!useTypecast}
                      onChange={() => setUseTypecast(false)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="azure-tts">Azure TTS (기본)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="typecast-ai"
                      name="voice-engine"
                      checked={useTypecast}
                      onChange={() => setUseTypecast(true)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="typecast-ai">TypeCast AI (고품질)</Label>
                  </div>
                </div>
              </div>

              {/* Azure TTS 설정 */}
              {!useTypecast && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Azure TTS 음성 선택</Label>
                    <Select 
                      value={stepData.voiceName} 
                      onValueChange={(value: string) => setStepData(prev => ({ ...prev, voiceName: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="음성을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ko-KR-SunHiNeural">한국어 - 선희 (여성, 친근함)</SelectItem>
                        <SelectItem value="ko-KR-InJoonNeural">한국어 - 인준 (남성, 안정감)</SelectItem>
                        <SelectItem value="ko-KR-HyunsuNeural">한국어 - 현수 (남성, 젊음)</SelectItem>
                        <SelectItem value="ko-KR-BongJinNeural">한국어 - 봉진 (여성, 전문성)</SelectItem>
                        <SelectItem value="ko-KR-HyunsuMultilingualNeural-Male">한국어 - 현수 다국어 (남성)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* TypeCast AI 설정 */}
              {useTypecast && (
                <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">TypeCast AI - 프리미엄 음성</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>TypeCast 액터 선택</Label>
                    <Select 
                      value={selectedTypecastActor} 
                      onValueChange={setSelectedTypecastActor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="고품질 AI 목소리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="603fa172a669dfd23f450abd">한국어 여성 목소리 (기본)</SelectItem>
                        <SelectItem value="loading" disabled>액터 목록을 불러오는 중...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* TypeCast 음성 미리보기 */}
                  {stepData.script && selectedTypecastActor && selectedTypecastActor !== 'loading' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">음성 미리보기</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={generateTypecastVoice}
                          disabled={isGeneratingVoice}
                        >
                          {isGeneratingVoice ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              생성 중...
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-3 w-3" />
                              음성 생성
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {generatedVoiceUrl && (
                        <div className="p-3 bg-background border rounded">
                          <audio controls className="w-full">
                            <source src={generatedVoiceUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>음성 볼륨: {stepData.voiceVolume}</Label>
                  <Slider
                    value={[stepData.voiceVolume]}
                    onValueChange={(value) => setStepData(prev => ({ ...prev, voiceVolume: value[0] }))}
                    max={2.0}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>음성 속도: {stepData.voiceRate}</Label>
                  <Slider
                    value={[stepData.voiceRate]}
                    onValueChange={(value) => setStepData(prev => ({ ...prev, voiceRate: value[0] }))}
                    max={2.0}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>배경음악</Label>
                <Select 
                  value={stepData.bgmType} 
                  onValueChange={(value: string) => setStepData(prev => ({ ...prev, bgmType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">없음</SelectItem>
                    <SelectItem value="random">랜덤 BGM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {stepData.bgmType !== 'none' && (
                <div className="space-y-2">
                  <Label>BGM 볼륨: {stepData.bgmVolume}</Label>
                  <Slider
                    value={[stepData.bgmVolume]}
                    onValueChange={(value) => setStepData(prev => ({ ...prev, bgmVolume: value[0] }))}
                    max={1.0}
                    min={0.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}

              <Alert>
                <Music className="h-4 w-4" />
                <AlertDescription>
                  고품질 AI 음성으로 자연스러운 나레이션을 생성합니다.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* 단계 4: 자막 설정 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="subtitle-enabled"
                  checked={stepData.subtitleEnabled}
                  onCheckedChange={(checked: boolean | string) => 
                    setStepData(prev => ({ ...prev, subtitleEnabled: checked === true }))
                  }
                />
                <Label htmlFor="subtitle-enabled">자막 활성화</Label>
              </div>

              {stepData.subtitleEnabled && (
                <div className="space-y-4 pl-6 border-l-2 border-muted">
                  <div className="space-y-2">
                    <Label>자막 위치</Label>
                    <Select 
                      value={stepData.subtitlePosition} 
                      onValueChange={(value: string) => setStepData(prev => ({ ...prev, subtitlePosition: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">상단</SelectItem>
                        <SelectItem value="center">중앙</SelectItem>
                        <SelectItem value="bottom">하단 (권장)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>글자 크기: {stepData.fontSize}px</Label>
                      <Slider
                        value={[stepData.fontSize]}
                        onValueChange={(value) => setStepData(prev => ({ ...prev, fontSize: value[0] }))}
                        max={100}
                        min={20}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>외곽선 굵기: {stepData.strokeWidth}px</Label>
                      <Slider
                        value={[stepData.strokeWidth]}
                        onValueChange={(value) => setStepData(prev => ({ ...prev, strokeWidth: value[0] }))}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>글자 색상</Label>
                      <Input
                        type="color"
                        value={stepData.textColor}
                        onChange={(e) => setStepData(prev => ({ ...prev, textColor: e.target.value }))}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>외곽선 색상</Label>
                      <Input
                        type="color"
                        value={stepData.strokeColor}
                        onChange={(e) => setStepData(prev => ({ ...prev, strokeColor: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="text-background"
                      checked={stepData.textBackgroundColor}
                      onCheckedChange={(checked: boolean | string) => 
                        setStepData(prev => ({ ...prev, textBackgroundColor: checked === true }))
                      }
                    />
                    <Label htmlFor="text-background">배경 박스 표시</Label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 단계 5: 비디오 생성 */}
          {currentStep === 5 && (
            <div className="space-y-4">
              {!generatedVideos.length ? (
                <>
                  <Alert>
                    <Rocket className="h-4 w-4" />
                    <AlertDescription>
                      모든 설정이 완료되었습니다. OpenAI로 생성된 스크립트를 사용하여 비디오를 생성합니다!
                    </AlertDescription>
                  </Alert>

                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-medium">생성 설정 요약</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>화면 비율: {stepData.aspectRatio}</div>
                      <div>비디오 소스: {stepData.videoSource}</div>
                      <div>자막: {stepData.subtitleEnabled ? '활성화' : '비활성화'}</div>
                      <div>클립 길이: {stepData.clipDuration}초</div>
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
                        <p className="text-sm text-muted-foreground">{generatingStep}</p>
                        {taskId && (
                          <p className="text-xs text-muted-foreground mt-1">
                            태스크 ID: {taskId}
                          </p>
                        )}
                      </div>
                      {videoProgress > 0 && (
                        <div className="space-y-2">
                          <Progress value={videoProgress} className="w-full" />
                          <div className="text-center text-sm text-muted-foreground">
                            진행률: {videoProgress}%
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    onClick={generateVideo} 
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        비디오 생성 중...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        비디오 생성 시작
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      비디오 생성이 완료되었습니다!
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    {generatedVideos.map((videoUrl, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            <span className="font-medium">생성된 비디오 {index + 1}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-2 h-4 w-4" />
                                미리보기
                              </a>
                            </Button>
                            <Button size="sm" asChild>
                              <a href={videoUrl} download>
                                <Download className="mr-2 h-4 w-4" />
                                다운로드
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          이전
        </Button>
        
        <div className="flex gap-2">
          {currentStep < 5 && (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
            >
              다음
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
