'use client'

import { useState, useEffect } from 'react'
import { FileText, Video, Music, MessageSquare, Rocket } from 'lucide-react'
import { StepData, TypecastActor, Step, initialStepData } from './types'
import ProgressHeader from './progress-header'
import StepNavigation from './step-navigation'
import StepContent from './step-content'
import NavigationButtons from './navigation-buttons'
import ErrorAlert from './error-alert'

export default function RefactoredStepByStepWorkflow() {
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
  const [typecastActors, setTypecastActors] = useState<TypecastActor[]>([])
  const [selectedTypecastActor, setSelectedTypecastActor] = useState('')
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState<string | null>(null)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)

  const steps: Step[] = [
    { id: 1, title: '스크립트 생성', icon: FileText, description: '주제를 입력하고 AI가 스크립트를 생성합니다' },
    { id: 2, title: '비디오 설정', icon: Video, description: '비디오 소스와 설정을 선택합니다' },
    { id: 3, title: '오디오 설정', icon: Music, description: '음성과 배경음악을 설정합니다' },
    { id: 4, title: '자막 설정', icon: MessageSquare, description: '자막 스타일을 커스터마이징합니다' },
    { id: 5, title: '비디오 생성', icon: Rocket, description: '최종 비디오를 생성합니다' }
  ]

  const validateStep = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return stepData.subject.trim() !== '' && stepData.script.trim() !== ''
      case 2:
        if (stepData.videoSource === 'local') {
          return stepData.aspectRatio !== '' && Boolean(stepData.videoMaterials?.length)
        }
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

  const handleStepDataChange = (data: Partial<StepData>) => {
    setStepData(prev => ({ ...prev, ...data }))
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
      // 백엔드 스키마에 맞는 요청 데이터 구성
      const requestData = {
        subject: stepData.subject,
        script: stepData.script,
        keywords: stepData.keywords,
        videoSource: stepData.videoSource,
        videoMaterials: stepData.videoMaterials,
        concatMode: stepData.concatMode,
        transitionMode: stepData.transitionMode,
        aspectRatio: stepData.aspectRatio,
        clipDuration: stepData.clipDuration,
        videoCount: stepData.videoCount,
        voiceName: useTypecast ? selectedTypecastActor : stepData.voiceName,
        voiceVolume: stepData.voiceVolume,
        voiceRate: stepData.voiceRate,
        bgmType: stepData.bgmType,
        bgmVolume: stepData.bgmVolume,
        subtitleEnabled: stepData.subtitleEnabled,
        fontName: stepData.fontName,
        subtitlePosition: stepData.subtitlePosition,
        customPosition: stepData.customPosition,
        textColor: stepData.textColor,
        textBackgroundColor: stepData.textBackgroundColor,
        fontSize: stepData.fontSize,
        strokeColor: stepData.strokeColor,
        strokeWidth: stepData.strokeWidth,
        nThreads: stepData.nThreads,
        paragraphNumber: stepData.paragraphNumber
      }

      console.log('비디오 생성 요청 데이터:', requestData)
      
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const result = await response.json()
      console.log('비디오 생성 API 응답:', result)
      
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
        
        console.log('태스크 상태 폴링 응답:', result)
        
        if (result.success && result.data) {
          const { state, progress, videos, message } = result.data
          
          setVideoProgress(progress || 0)
          
          // 백엔드 상태 코드에 따른 처리
          // -1: 실패, 1: 완료, 4: 처리중
          if (state === 1) { // 완료 (TASK_STATE_COMPLETE)
            setGeneratedVideos(videos || [])
            setCompletedSteps(prev => [...prev, 5])
            setIsGenerating(false)
            setGeneratingStep('비디오 생성 완료!')
            clearInterval(pollInterval)
          } else if (state === -1) { // 실패 (TASK_STATE_FAILED)
            setError(message || '비디오 생성 중 오류가 발생했습니다')
            setIsGenerating(false)
            setGeneratingStep('')
            clearInterval(pollInterval)
          } else if (state === 4) { // 처리중 (TASK_STATE_PROCESSING)
            setGeneratingStep(message || '비디오 생성 중...')
          } else {
            // 기타 상태 (대기 등)
            setGeneratingStep('비디오 생성 대기 중...')
          }
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

  const generateTypecastVoice = async () => {
    if (!stepData.script || !selectedTypecastActor) {
      setError('스크립트와 액터를 선택해주세요.')
      return
    }

    setIsGeneratingVoice(true)
    setError(null)

    try {
      // 스크립트를 350자로 제한 (TypeCast 제한)
      const textToGenerate = stepData.script.slice(0, 350)
      
      const requestData = {
        text: textToGenerate,
        tts_mode: 'actor',
        actor_id: selectedTypecastActor,
        lang: 'auto',
        xapi_hd: true,
        xapi_audio_format: 'wav',
        model_version: 'latest',
        volume: 100,
        speed_x: 1.0,
        tempo: 1.0,
        pitch: 0,
        max_seconds: 30,
        last_pitch: 0,
        emotion_tone_preset: 'normal-1' // 기본 감정
      }

      console.log('기본 TypeCast 요청:', requestData)

      const response = await fetch('/api/generate-typecast-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('TypeCast API 응답 오류:', response.status, errorText)
        throw new Error(`API 요청 실패: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log('TypeCast API 응답:', result)

      if (result.success && result.audio_url) {
        setGeneratedVoiceUrl(result.audio_url)
        console.log('TypeCast 음성 생성 완료:', {
          duration: result.duration,
          text_count: result.text_count,
          format: result.format
        })
      } else {
        throw new Error(result.error || 'TypeCast 음성 생성에 실패했습니다')
      }
    } catch (error) {
      console.error('TypeCast 음성 생성 오류:', error)
      const errorMessage = error instanceof Error ? error.message : 'TypeCast 음성 생성에 실패했습니다'
      setError(`TypeCast 오류: ${errorMessage}`)
    } finally {
      setIsGeneratingVoice(false)
    }
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ProgressHeader 
        completedSteps={completedSteps} 
        totalSteps={steps.length} 
      />

      <StepNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={setCurrentStep}
      />

      <ErrorAlert error={error} />

      <StepContent
        currentStep={currentStep}
        steps={steps}
        stepData={stepData}
        onStepDataChange={handleStepDataChange}
        isGenerating={isGenerating}
        onGenerateScript={generateScript}
        useTypecast={useTypecast}
        onUseTypecastChange={setUseTypecast}
        typecastActors={typecastActors}
        selectedTypecastActor={selectedTypecastActor}
        onTypecastActorChange={setSelectedTypecastActor}
        generatedVoiceUrl={generatedVoiceUrl}
        isGeneratingVoice={isGeneratingVoice}
        onGenerateTypecastVoice={generateTypecastVoice}
        generatedVideos={generatedVideos}
        generatingStep={generatingStep}
        taskId={taskId}
        videoProgress={videoProgress}
        onGenerateVideo={generateVideo}
      />

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        canProceed={validateStep(currentStep)}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  )
} 