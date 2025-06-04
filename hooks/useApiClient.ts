// 새로운 API 클라이언트를 활용한 React 훅들
import { useState, useCallback } from 'react'
import {
  ContentArchetypeRequest,
  ContentArchetypeResponse,
  VoiceGenerationRequest,
  VoiceGenerationResponse,
  SubtitleGenerationRequest,
  SubtitleGenerationResponse,
  SegmentKeywordExtractionRequest,
  SegmentKeywordExtractionResponse,
  ImageSearchRequest,
  ImageSearchResponse,
  VideoSearchRequest,
  VideoSearchResponse,
  FinalVideoCompositionRequest,
  FinalVideoCompositionResponse,
  TaskStatusRequest,
  TaskStatusResponse
} from '@/types/api-requests'

import {
  analyzeContentArchetype,
  generateVoice,
  generateSubtitle,
  extractSegmentKeywords,
  searchImages,
  searchVideos,
  composeVideo,
  getTaskStatus,
  pollTaskStatus,
  apiRequestWithRetry,
  isApiError
} from '@/lib/api-client'

// =============================================================================
// 1. 콘텐츠 원형 분석 훅
// =============================================================================

export function useContentArchetypeAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ContentArchetypeResponse | null>(null)

  const analyze = useCallback(async (
    archetype: ContentArchetypeRequest['archetype'],
    scriptSettings: ContentArchetypeRequest['scriptSettings'],
    mode: ContentArchetypeRequest['mode'] = 'advanced',
    automaticInput?: string
  ): Promise<ContentArchetypeResponse | null> => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const request: ContentArchetypeRequest = {
        archetype,
        scriptSettings,
        mode,
        automaticInput
      }

      const response = await apiRequestWithRetry(
        () => analyzeContentArchetype(request),
        3, // 최대 3회 재시도
        2000 // 2초 간격
      )

      setResult(response)
      return response
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '콘텐츠 원형 분석 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('콘텐츠 원형 분석 오류:', err)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return {
    isAnalyzing,
    error,
    result,
    analyzeContentArchetype: analyze
  }
}

// =============================================================================
// 2. 음성 생성 훅
// =============================================================================

export function useVoiceGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VoiceGenerationResponse | null>(null)

  const generate = useCallback(async (
    text: string,
    actorId: string,
    settings: VoiceGenerationRequest['settings']
  ): Promise<VoiceGenerationResponse | null> => {
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const request: VoiceGenerationRequest = {
        text,
        actor_id: actorId,
        settings
      }

      const response = await apiRequestWithRetry(
        () => generateVoice(request),
        2, // 음성 생성은 비용이 있으므로 재시도 제한
        3000
      )

      setResult(response)
      return response
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '음성 생성 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('음성 생성 오류:', err)
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return {
    isGenerating,
    error,
    result,
    generateVoice: generate
  }
}

// =============================================================================
// 3. 자막 생성 훅 (Whisper)
// =============================================================================

export function useSubtitleGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SubtitleGenerationResponse | null>(null)

  const generate = useCallback(async (
    audio: SubtitleGenerationRequest['audio'],
    settings: SubtitleGenerationRequest['settings']
  ): Promise<SubtitleGenerationResponse | null> => {
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const request: SubtitleGenerationRequest = {
        audio,
        settings
      }

      const response = await apiRequestWithRetry(
        () => generateSubtitle(request),
        2, // Whisper API 비용 고려하여 재시도 제한
        5000
      )

      setResult(response)
      return response
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '자막 생성 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('자막 생성 오류:', err)
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return {
    isGenerating,
    error,
    result,
    generateSubtitle: generate
  }
}

// =============================================================================
// 4. 구간별 키워드 추출 훅
// =============================================================================

export function useSegmentKeywordExtraction() {
  const [isExtracting, setIsExtracting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SegmentKeywordExtractionResponse | null>(null)

  const extract = useCallback(async (
    script: string,
    audioDuration: number,
    settings: SegmentKeywordExtractionRequest['settings']
  ): Promise<SegmentKeywordExtractionResponse | null> => {
    setIsExtracting(true)
    setError(null)
    setResult(null)

    try {
      const request: SegmentKeywordExtractionRequest = {
        script,
        audio_duration: audioDuration,
        settings
      }

      const response = await apiRequestWithRetry(
        () => extractSegmentKeywords(request),
        3,
        1500
      )

      setResult(response)
      return response
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '키워드 추출 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('키워드 추출 오류:', err)
      return null
    } finally {
      setIsExtracting(false)
    }
  }, [])

  return {
    isExtracting,
    error,
    result,
    extractSegmentKeywords: extract
  }
}

// =============================================================================
// 5. 이미지 검색 훅
// =============================================================================

export function useImageSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ImageSearchResponse[]>([])

  const search = useCallback(async (
    keyword: string,
    settings: ImageSearchRequest['settings']
  ): Promise<ImageSearchResponse['images'] | null> => {
    setIsSearching(true)
    setError(null)

    try {
      const request: ImageSearchRequest = {
        keyword,
        settings
      }

      const response = await apiRequestWithRetry(
        () => searchImages(request),
        3,
        1000
      )

      if (response) {
        setResults(prev => [...prev, response])
        return response.images
      }
      return null
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '이미지 검색 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('이미지 검색 오류:', err)
      return null
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return {
    isSearching,
    error,
    results,
    searchImages: search,
    clearResults
  }
}

// =============================================================================
// 6. 비디오 검색 훅
// =============================================================================

export function useVideoSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<VideoSearchResponse[]>([])

  const search = useCallback(async (
    keywords: string[],
    settings: VideoSearchRequest['settings']
  ): Promise<VideoSearchResponse['videos'] | null> => {
    setIsSearching(true)
    setError(null)

    try {
      const request: VideoSearchRequest = {
        keywords,
        settings
      }

      const response = await apiRequestWithRetry(
        () => searchVideos(request),
        3,
        1000
      )

      if (response) {
        setResults(prev => [...prev, response])
        return response.videos
      }
      return null
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '비디오 검색 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('비디오 검색 오류:', err)
      return null
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return {
    isSearching,
    error,
    results,
    searchVideos: search,
    clearResults
  }
}

// =============================================================================
// 7. 최종 영상 합성 훅
// =============================================================================

export function useFinalVideoComposition() {
  const [isComposing, setIsComposing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [result, setResult] = useState<FinalVideoCompositionResponse | null>(null)

  const compose = useCallback(async (
    request: FinalVideoCompositionRequest
  ): Promise<FinalVideoCompositionResponse | null> => {
    setIsComposing(true)
    setError(null)
    setProgress(0)
    setCurrentStep('영상 합성 준비 중...')
    setResult(null)

    try {
      // 합성 요청 시작
      const response = await composeVideo(request)
      
      if (response.success && response.taskId) {
        setCurrentStep('영상 합성 진행 중...')
        
        // 작업 상태 폴링
        const finalStatus = await pollTaskStatus(
          response.taskId,
          2000, // 2초마다 확인
          60   // 최대 2분 대기
        )
        
        if (finalStatus.state === 2) { // 완료
          setProgress(100)
          setCurrentStep('영상 합성 완료!')
          const finalResponse: FinalVideoCompositionResponse = {
            success: response.success,
            taskId: response.taskId,
            progress: 100,
            videoUrl: finalStatus.videos?.[0],
            currentStep: '완료',
            thumbnail: response.thumbnail,
            duration: response.duration,
            fileSize: response.fileSize,
            estimatedTime: response.estimatedTime
          }
          setResult(finalResponse)
          return finalResponse
        } else if (finalStatus.state === 3) { // 오류
          throw new Error(finalStatus.error || '영상 합성 중 오류가 발생했습니다.')
        }
      }

      return response
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '영상 합성 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('영상 합성 오류:', err)
      return null
    } finally {
      setIsComposing(false)
    }
  }, [])

  return {
    isComposing,
    error,
    progress,
    currentStep,
    result,
    composeVideo: compose
  }
}

// =============================================================================
// 8. 작업 상태 조회 훅
// =============================================================================

export function useTaskStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<TaskStatusResponse | null>(null)

  const getStatus = useCallback(async (
    taskId: string
  ): Promise<TaskStatusResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const request: TaskStatusRequest = { taskId }
      const response = await getTaskStatus(request)
      setStatus(response)
      return response
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '작업 상태 조회 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('작업 상태 조회 오류:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const pollStatus = useCallback(async (
    taskId: string,
    intervalMs: number = 2000,
    maxAttempts: number = 60
  ): Promise<TaskStatusResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await pollTaskStatus(taskId, intervalMs, maxAttempts)
      setStatus(response)
      return response
    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '작업 상태 폴링 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('작업 상태 폴링 오류:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    status,
    getStatus,
    pollStatus
  }
}

// =============================================================================
// 9. 통합 워크플로우 훅 (모든 단계를 순차적으로 실행)
// =============================================================================

export function useIntegratedWorkflow() {
  const [currentStep, setCurrentStep] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    script?: ContentArchetypeResponse
    voice?: VoiceGenerationResponse
    subtitle?: SubtitleGenerationResponse
    keywords?: SegmentKeywordExtractionResponse
    images?: { [segmentId: number]: ImageSearchResponse['images'] }
    videos?: { [segmentId: number]: VideoSearchResponse['videos'] }
    finalVideo?: FinalVideoCompositionResponse
  }>({})

  const executeWorkflow = useCallback(async (
    request: ContentArchetypeRequest,
    voiceSettings: VoiceGenerationRequest['settings'],
    subtitleSettings: SubtitleGenerationRequest['settings'],
    keywordSettings: SegmentKeywordExtractionRequest['settings'],
    imageSettings: ImageSearchRequest['settings'],
    videoSettings: VideoSearchRequest['settings']
  ) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setResults({})

    try {
      // 1단계: 콘텐츠 원형 분석 및 스크립트 생성
      setCurrentStep('1/7: 콘텐츠 원형 분석 및 스크립트 생성 중...')
      setProgress(14)
      
      const scriptResult = await analyzeContentArchetype(request)
      if (!scriptResult?.success) {
        throw new Error('스크립트 생성에 실패했습니다.')
      }
      setResults(prev => ({ ...prev, script: scriptResult }))

      // 2단계: 음성 생성
      setCurrentStep('2/7: 음성 생성 중...')
      setProgress(28)
      
      const voiceRequest: VoiceGenerationRequest = {
        text: scriptResult.script,
        actor_id: '603fa172a669dfd23f450abd', // 기본 액터
        settings: voiceSettings
      }
      
      const voiceResult = await generateVoice(voiceRequest)
      if (!voiceResult?.success) {
        throw new Error('음성 생성에 실패했습니다.')
      }
      setResults(prev => ({ ...prev, voice: voiceResult }))

      // 3단계: 자막 생성 (Whisper)
      setCurrentStep('3/7: 자막 생성 중 (Whisper 분석)...')
      setProgress(42)
      
      const subtitleRequest: SubtitleGenerationRequest = {
        audio: {
          url: voiceResult.audio_url,
          format: voiceResult.format,
          duration: voiceResult.duration
        },
        settings: subtitleSettings
      }
      
      const subtitleResult = await generateSubtitle(subtitleRequest)
      if (!subtitleResult?.success) {
        throw new Error('자막 생성에 실패했습니다.')
      }
      setResults(prev => ({ ...prev, subtitle: subtitleResult }))

      // 4단계: 구간별 키워드 추출
      setCurrentStep('4/7: 구간별 키워드 추출 중...')
      setProgress(56)
      
      const keywordRequest: SegmentKeywordExtractionRequest = {
        script: scriptResult.script,
        audio_duration: voiceResult.duration,
        settings: keywordSettings
      }
      
      const keywordResult = await extractSegmentKeywords(keywordRequest)
      if (!keywordResult?.success) {
        throw new Error('키워드 추출에 실패했습니다.')
      }
      setResults(prev => ({ ...prev, keywords: keywordResult }))

      // 5단계: 이미지 검색 (구간별)
      setCurrentStep('5/7: 구간별 이미지 검색 중...')
      setProgress(70)
      
      const imageResults: { [segmentId: number]: ImageSearchResponse['images'] } = {}
      for (const segment of keywordResult.segments) {
        if (segment.keywords && segment.keywords.length > 0) {
          const request: ImageSearchRequest = { keyword: segment.keywords[0], settings: imageSettings }
          const response = await searchImages(request)
          if (response?.images) {
            imageResults[segment.segment_id] = response.images
          }
        }
      }
      setResults(prev => ({ ...prev, images: imageResults }))

      // 6단계: 비디오 검색 (구간별)
      setCurrentStep('6/7: 구간별 비디오 검색 중...')
      setProgress(84)
      
      const videoResults: { [segmentId: number]: VideoSearchResponse['videos'] } = {}
      for (const segment of keywordResult.segments) {
        if (segment.keywords && segment.keywords.length > 0) {
          const request: VideoSearchRequest = { keywords: segment.keywords, settings: videoSettings }
          const response = await searchVideos(request)
          if (response?.videos) {
            videoResults[segment.segment_id] = response.videos
          }
        }
      }
      setResults(prev => ({ ...prev, videos: videoResults }))

      // 7단계 완료
      setCurrentStep('워크플로우 완료 - 소재 선택 대기 중')
      setProgress(100)

      return {
        script: scriptResult,
        voice: voiceResult,
        subtitle: subtitleResult,
        keywords: keywordResult,
        images: imageResults,
        videos: videoResults
      }

    } catch (err) {
      const errorMessage = isApiError(err) ? err.message : '워크플로우 실행 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('통합 워크플로우 오류:', err)
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    currentStep,
    progress,
    isProcessing,
    error,
    results,
    executeWorkflow
  }
}

// 기본 export
export default {
  useContentArchetypeAnalysis,
  useVoiceGeneration,
  useSubtitleGeneration,
  useSegmentKeywordExtraction,
  useImageSearch,
  useVideoSearch,
  useFinalVideoComposition,
  useTaskStatus,
  useIntegratedWorkflow
}
