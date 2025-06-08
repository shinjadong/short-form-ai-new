import { useState, useCallback } from 'react'

// 스크립트 생성 훅 (강화 버전)
export function useScriptGeneration() {
  const [isLoading, setIsLoading] = useState(false)
  const [script, setScript] = useState('')
  const [scriptAnalysis, setScriptAnalysis] = useState<any>(null)
  const [scriptSegments, setScriptSegments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const generateScript = useCallback(async (subject: string, options?: {
    language?: string
    length?: 'short' | 'medium' | 'long'
    style?: string
    tone?: string
    target_audience?: string
    video_style?: string
    content_structure?: string
    keywords?: string[]
    custom_requirements?: string
  }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          language: options?.language || 'ko',
          length: options?.length || 'medium',
          style: options?.style || 'informative',
          tone: options?.tone || 'friendly',
          target_audience: options?.target_audience || 'general',
          video_style: options?.video_style || 'educational',
          content_structure: options?.content_structure || 'hook_content_cta',
          keywords: options?.keywords || [],
          custom_requirements: options?.custom_requirements || ''
        }),
      })

      const result = await response.json()

      if (result.status === 200 && result.data) {
        setScript(result.data.script)
        setScriptAnalysis(result.data.analysis)
        setScriptSegments(result.data.segments)
        return { 
          success: true, 
          script: result.data.script,
          analysis: result.data.analysis,
          segments: result.data.segments
        }
      } else {
        throw new Error(result.message || '스크립트 생성에 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '스크립트 생성 중 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetScript = useCallback(() => {
    setScript('')
    setScriptAnalysis(null)
    setScriptSegments([])
    setError(null)
  }, [])

  return {
    isLoading,
    script,
    scriptAnalysis,
    scriptSegments,
    error,
    generateScript,
    resetScript
  }
}

// 키워드 생성 훅
export function useKeywordGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const generateKeywords = useCallback(async (script: string, subject: string) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/extract-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script, subject }),
      })

      const result = await response.json()

      if (result.success) {
        setKeywords(result.keywords)
        return result.keywords
      } else {
        throw new Error(result.error || '키워드 생성에 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '키워드 생성 중 오류가 발생했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const resetKeywords = useCallback(() => {
    setKeywords([])
    setError(null)
  }, [])

  return {
    isGenerating,
    keywords,
    error,
    generateKeywords,
    resetKeywords,
    setKeywords
  }
}

// 음성 생성 훅 (TypeCast + Azure TTS fallback)
export function useVoiceGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioData, setAudioData] = useState<{
    audio_url?: string
    duration?: number
    format?: string
    actor_id?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const generateVoice = useCallback(async (text: string, actorId: string, options?: {
    lang?: string
    tempo?: number
    volume?: number
    pitch?: number
    audio_format?: 'wav' | 'mp3'
  }) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      // TypeCast API 호출 (schema.py 구조에 맞춤)
      console.log('TypeCast 음성 생성 시도...')
      const typecastResponse = await fetch('/api/generate-typecast-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          actor_id: actorId,
          lang: options?.lang || 'auto',
          tempo: options?.tempo || 1.0,
          volume: options?.volume || 100,
          pitch: options?.pitch || 0,
          audio_format: options?.audio_format || 'wav',
          max_seconds: 60,
          hd_quality: true
        }),
      })

      const result = await typecastResponse.json()

      // schema.py BaseResponse 구조에 맞춘 응답 처리
      if (result.status === 200 && result.data) {
        console.log('TypeCast 음성 생성 성공')
        setAudioData({
          audio_url: result.data.audio_url,
          duration: result.data.duration,
          format: result.data.format,
          actor_id: result.data.actor_id
        })
        setRetryCount(0)
        return result.data
      }

      // TypeCast 실패 시 에러 발생 (fallback 없음)
      const errorMessage = result.message || 'TypeCast 음성 생성 실패'
      setError(errorMessage)
      throw new Error(errorMessage)

    } catch (error) {
      console.error('TypeCast 음성 생성 오류:', error)
      
      // 재시도 로직 (최대 3회)
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1)
        console.log(`TypeCast 재시도 ${retryCount + 1}/3`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return generateVoice(text, actorId, options)
      }

      // 최대 재시도 후에도 실패하면 에러 발생
      const errorMessage = error instanceof Error ? error.message : 'TypeCast 음성 생성 실패'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }, [retryCount])


  const resetAudio = useCallback(() => {
    setAudioData(null)
    setError(null)
    setRetryCount(0)
  }, [])

  return {
    generateVoice,
    isGenerating,
    audioData,
    error,
    resetAudio
  }
}

// 비디오 검색 훅
export interface VideoSearchResult {
  id: string
  url: string
  thumbnail: string
  duration: number
  source: string
  width: number
  height: number
  downloadUrl: string
  aspectRatio: number
}

export function useVideoSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [videos, setVideos] = useState<VideoSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const searchVideos = useCallback(async (keywords: string[], options?: {
    orientation?: 'portrait' | 'landscape' | 'square'
    perPage?: number
  }) => {
    setIsSearching(true)
    setError(null)
    
    try {
      const response = await fetch('/api/search-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords,
          orientation: options?.orientation || 'portrait',
          per_page: options?.perPage || 20
        }),
      })

      const result = await response.json()

      if (result.success) {
        setVideos(result.videos)
        return result.videos
      } else {
        throw new Error(result.error || '비디오 검색에 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '비디오 검색 중 오류가 발생했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const resetVideos = useCallback(() => {
    setVideos([])
    setError(null)
  }, [])

  return {
    isSearching,
    videos,
    error,
    searchVideos,
    resetVideos,
    setVideos
  }
}

// 🆕 SerpAPI 이미지 검색 훅
export interface ImageSearchResult {
  id: string
  url: string
  thumbnail_url: string
  title: string
  source: string
  width: number
  height: number
  format: string
  aspect_ratio: number
}

export function useImageSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [images, setImages] = useState<ImageSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const searchImages = useCallback(async (searchTerm: string, options?: {
    image_aspect?: 'portrait' | 'landscape' | 'square'
    image_size?: 'l' | 'm' | 'i'
    image_type?: 'photo' | 'clipart' | 'lineart' | 'animated'
    max_results?: number
  }) => {
    setIsSearching(true)
    setError(null)
    
    try {
      const response = await fetch('/api/search-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search_term: searchTerm,
          image_aspect: options?.image_aspect || 'portrait',
          image_size: options?.image_size || 'l',
          image_type: options?.image_type || 'photo',
          max_results: options?.max_results || 20
        }),
      })

      const result = await response.json()

      if (result.success) {
        setImages(result.images)
        return result.images
      } else {
        throw new Error(result.error || '이미지 검색에 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이미지 검색 중 오류가 발생했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const resetImages = useCallback(() => {
    setImages([])
    setError(null)
  }, [])

  return {
    isSearching,
    images,
    error,
    searchImages,
    resetImages,
    setImages
  }
}

// 🆕 강화된 자막 생성 훅 (Whisper 기반)
export interface SubtitleGenerationResult {
  subtitle_content?: string
  srt_subtitle?: string
  raw_transcription?: string
  segments?: any[]
  style_info?: any
  analysis?: any
  processing_time?: number
  message?: string
}

export function useEnhancedSubtitle() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [subtitleData, setSubtitleData] = useState<SubtitleGenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateSubtitle = useCallback(async (audioFile: {
    url?: string
    audio_data?: string
  }, options?: {
    style?: 'youtube' | 'netflix' | 'anime' | 'aesthetic' | 'custom'
    animation?: 'none' | 'fade' | 'typewriter' | 'slide' | 'zoom' | 'glow'
    korean_optimization?: boolean
  }) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-enhanced-subtitle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: audioFile.url,
          audio_data: audioFile.audio_data,
          style: options?.style || 'youtube',
          animation: options?.animation || 'fade',
          korean_optimization: options?.korean_optimization ?? true
        }),
      })

      const result = await response.json()

      if (result.status === 200 && result.data) {
        const subtitleInfo = {
          subtitle_content: result.data.subtitle_content,
          srt_subtitle: result.data.srt_subtitle,
          raw_transcription: result.data.raw_transcription,
          segments: result.data.segments,
          style_info: result.data.style_info,
          analysis: result.data.analysis,
          processing_time: result.data.processing_time,
          message: result.message
        }
        setSubtitleData(subtitleInfo)
        return subtitleInfo
      } else {
        throw new Error(result.message || '자막 생성에 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '자막 생성 중 오류가 발생했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const resetSubtitle = useCallback(() => {
    setSubtitleData(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    subtitleData,
    error,
    generateSubtitle,
    resetSubtitle
  }
}

// 🆕 자막 스타일 및 애니메이션 목록 훅
export function useSubtitleStyles() {
  const [isLoading, setIsLoading] = useState(false)
  const [styles, setStyles] = useState<{ [key: string]: string }>({})
  const [animations, setAnimations] = useState<{ [key: string]: string }>({})
  const [error, setError] = useState<string | null>(null)

  const fetchStylesAndAnimations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-enhanced-subtitle', {
        method: 'GET',
      })

      const result = await response.json()

      if (result.success) {
        setStyles(result.styles || {})
        setAnimations(result.animations || {})
        return { styles: result.styles, animations: result.animations }
      } else {
        throw new Error(result.error || '스타일 목록을 가져오는데 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '스타일 목록 조회 중 오류가 발생했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    styles,
    animations,
    error,
    fetchStylesAndAnimations
  }
}

// TypeCast 액터 목록 훅
export interface TypeCastActor {
  actor_id: string
  name: {
    en: string
    ko: string
  }
  language: string
  gender: string
  description?: string
  age?: string
}

export function useTypecastActors() {
  const [isLoading, setIsLoading] = useState(false)
  const [actors, setActors] = useState<TypeCastActor[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchActors = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-typecast-voice', {
        method: 'GET',
      })

      const result = await response.json()

      if (result.success) {
        setActors(result.actors)
        return result.actors
      } else {
        throw new Error(result.error || 'TypeCast 액터 목록을 가져오는데 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'TypeCast 액터 목록 조회 중 오류가 발생했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    actors,
    error,
    fetchActors
  }
}

// 🆕 통합 백엔드 기능 워크플로우 훅
export function useBackendIntegratedWorkflow() {
  const keywordGeneration = useKeywordGeneration()
  const voiceGeneration = useVoiceGeneration()
  const videoSearch = useVideoSearch()
  const imageSearch = useImageSearch()
  const enhancedSubtitle = useEnhancedSubtitle()
  const subtitleStyles = useSubtitleStyles()
  const typecastActors = useTypecastActors()

  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const completeStep = useCallback((step: number) => {
    setCompletedSteps(prev => [...prev.filter(s => s !== step), step])
    setCurrentStep(prev => Math.max(prev, step + 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  const resetWorkflow = useCallback(() => {
    keywordGeneration.resetKeywords()
    voiceGeneration.resetAudio()
    videoSearch.resetVideos()
    imageSearch.resetImages()
    enhancedSubtitle.resetSubtitle()
    setCurrentStep(1)
    setCompletedSteps([])
  }, [keywordGeneration, voiceGeneration, videoSearch, imageSearch, enhancedSubtitle])

  // 전체 워크플로우 실행 (백엔드 기능 통합)
  const runFullWorkflow = useCallback(async (
    script: string, 
    subject: string, 
    actorId: string,
    options?: {
      includeImages?: boolean
      subtitleStyle?: 'youtube' | 'netflix' | 'anime' | 'aesthetic' | 'custom'
      subtitleAnimation?: string
      korean_optimization?: boolean
    }
  ) => {
    try {
      // 1단계: 키워드 생성 (3초)
      setCurrentStep(2)
      const generatedKeywords = await keywordGeneration.generateKeywords(script, subject)
      completeStep(2)

      // 2단계: 음성 생성 (10초)
      setCurrentStep(3)
      const audioResult = await voiceGeneration.generateVoice(script, actorId)
      completeStep(3)

      // 3단계: 비디오 검색 (즉시)
      setCurrentStep(4)
      const videoResults = await videoSearch.searchVideos(generatedKeywords)
      completeStep(4)

      // 4단계: 이미지 검색 (선택사항, 즉시)
      let imageResults: any[] = []
      if (options?.includeImages) {
        setCurrentStep(5)
        imageResults = await imageSearch.searchImages(subject)
        completeStep(5)
      }

      // 5단계: 강화된 자막 생성 (2초)
      setCurrentStep(6)
      const subtitleResult = await enhancedSubtitle.generateSubtitle({
        url: audioResult.audio_url,
        audio_data: audioResult.audio_data
      }, {
        style: options?.subtitleStyle || 'youtube',
        animation: (options?.subtitleAnimation as 'none' | 'fade' | 'typewriter' | 'slide' | 'zoom' | 'glow') || 'fade',
        korean_optimization: options?.korean_optimization ?? true
      })
      completeStep(6)

      return {
        keywords: generatedKeywords,
        audio: audioResult,
        videos: videoResults,
        images: imageResults,
        subtitle: subtitleResult
      }
    } catch (error) {
      console.error('백엔드 통합 워크플로우 실행 중 오류:', error)
      throw error
    }
  }, [keywordGeneration, voiceGeneration, videoSearch, imageSearch, enhancedSubtitle, completeStep])

  return {
    // 개별 기능
    keywordGeneration,
    voiceGeneration,
    videoSearch,
    imageSearch,
    enhancedSubtitle,
    subtitleStyles,
    typecastActors,
    
    // 워크플로우 상태
    currentStep,
    completedSteps,
    completeStep,
    goToStep,
    resetWorkflow,
    runFullWorkflow,

    // 전체 상태
    isProcessing: (
      keywordGeneration.isGenerating || 
      voiceGeneration.isGenerating || 
      videoSearch.isSearching ||
      imageSearch.isSearching ||
      enhancedSubtitle.isGenerating
    ),
    hasError: !!(
      keywordGeneration.error || 
      voiceGeneration.error || 
      videoSearch.error ||
      imageSearch.error ||
      enhancedSubtitle.error ||
      subtitleStyles.error ||
      typecastActors.error
    ),
    errors: [
      keywordGeneration.error,
      voiceGeneration.error,
      videoSearch.error,
      imageSearch.error,
      enhancedSubtitle.error,
      subtitleStyles.error,
      typecastActors.error
    ].filter(Boolean)
  }
}

// 기존 통합 워크플로우 훅 (하위 호환성 유지)
export function useOptimizedWorkflow() {
  const keywordGeneration = useKeywordGeneration()
  const voiceGeneration = useVoiceGeneration()
  const videoSearch = useVideoSearch()
  const typecastActors = useTypecastActors()

  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const completeStep = useCallback((step: number) => {
    setCompletedSteps(prev => [...prev.filter(s => s !== step), step])
    setCurrentStep(prev => Math.max(prev, step + 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  const resetWorkflow = useCallback(() => {
    keywordGeneration.resetKeywords()
    voiceGeneration.resetAudio()
    videoSearch.resetVideos()
    setCurrentStep(1)
    setCompletedSteps([])
  }, [keywordGeneration, voiceGeneration, videoSearch])

  // 전체 워크플로우 실행 (스크립트 기반 자동 처리)
  const runAutoWorkflow = useCallback(async (script: string, subject: string, actorId: string) => {
    try {
      // 1단계: 키워드 생성 (3초)
      setCurrentStep(2)
      const generatedKeywords = await keywordGeneration.generateKeywords(script, subject)
      completeStep(2)

      // 2단계: 음성 생성 (10초)
      setCurrentStep(3)
      const audioResult = await voiceGeneration.generateVoice(script, actorId)
      completeStep(3)

      // 3단계: 비디오 검색 (즉시)
      setCurrentStep(4)
      const videoResults = await videoSearch.searchVideos(generatedKeywords)
      completeStep(4)

      return {
        keywords: generatedKeywords,
        audio: audioResult,
        videos: videoResults
      }
    } catch (error) {
      console.error('자동 워크플로우 실행 중 오류:', error)
      throw error
    }
  }, [keywordGeneration, voiceGeneration, videoSearch, completeStep])

  return {
    // 개별 기능
    keywordGeneration,
    voiceGeneration,
    videoSearch,
    typecastActors,
    
    // 워크플로우 상태
    currentStep,
    completedSteps,
    completeStep,
    goToStep,
    resetWorkflow,
    runAutoWorkflow,

    // 전체 상태
    isProcessing: keywordGeneration.isGenerating || voiceGeneration.isGenerating || videoSearch.isSearching,
    hasError: !!(keywordGeneration.error || voiceGeneration.error || videoSearch.error || typecastActors.error),
    errors: [
      keywordGeneration.error,
      voiceGeneration.error,
      videoSearch.error,
      typecastActors.error
    ].filter(Boolean)
  }
}

// 최종 비디오 합성 훅 추가
export const useFinalVideoComposition = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [error, setError] = useState<string | null>(null)

  const composeVideo = async (compositionData: {
    taskId: string
    videoSubject: string
    videoScript: string
    audioFile: {
      url: string
      duration: number
      format: string
    }
    videoClips: Array<{
      url: string
      duration: number
      width: number
      height: number
      aspectRatio: number
      startTime?: number
      endTime?: number
    }>
    imageAssets?: Array<{
      url: string
      thumbnail_url?: string
      title?: string
      width?: number
      height?: number
    }>
    subtitleContent: string
    videoSettings: {
      aspect: '9:16' | '16:9' | '1:1'
      clipDuration: number
      concatMode: 'random' | 'sequential'
      transitionMode: string
    }
    subtitleSettings: {
      enabled: boolean
      position: 'top' | 'center' | 'bottom' | 'custom'
      customPosition?: number
      fontName: string
      fontSize: number
      fontColor: string
      strokeColor: string
      strokeWidth: number
      backgroundColor?: string
      style: string
      animation?: string
      useBackground?: boolean
    }
    bgmSettings?: {
      type: 'none' | 'random' | 'custom'
      file?: string
      volume: number
    }
  }) => {
    setIsLoading(true)
    setError(null)
    setProgress(0)
    setCurrentStep('최종 비디오 합성 준비 중...')

    try {
      // 최종 합성 API 호출
      setCurrentStep('백엔드로 소재 전송 중...')
      setProgress(10)

      const response = await fetch('/api/final-video-composition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compositionData),
      })

      const result = await response.json()
      
      // schema.py BaseResponse 구조에 맞춘 응답 처리
      if (result.status === 200 && result.data) {
        setProgress(30)
        setCurrentStep('백엔드에서 비디오 합성 중...')
        
        // 작업 상태를 주기적으로 확인
        const taskId = result.data.task_id
        let attempts = 0
        const maxAttempts = 60 // 최대 2분 대기 (2초마다 체크)
        
        const pollStatus = async (): Promise<any> => {
          return new Promise((resolve, reject) => {
            const statusInterval = setInterval(async () => {
              attempts++
              
              try {
                const statusResponse = await fetch(`/api/final-video-composition?taskId=${taskId}`)
                const statusData = await statusResponse.json()
                
                if (statusData.status === 200 && statusData.data) {
                  const taskData = statusData.data
                  setProgress(Math.min(30 + (taskData.progress * 0.7), 95))
                  setCurrentStep(taskData.current_step || '비디오 합성 진행 중...')
                  
                  if (taskData.status === 'completed') {
                    clearInterval(statusInterval)
                    setProgress(100)
                    setCurrentStep('최종 비디오 합성 완료!')
                    setIsLoading(false)
                    resolve({
                      success: true,
                      videos: taskData.videos,
                      combined_videos: taskData.combined_videos,
                      videoUrl: taskData.videos?.[0] || taskData.combined_videos?.[0]
                    })
                    return
                  } else if (taskData.status === 'failed') {
                    clearInterval(statusInterval)
                    reject(new Error(taskData.error || '백엔드 합성 작업 실패'))
                    return
                  }
                }
                
                if (attempts >= maxAttempts) {
                  clearInterval(statusInterval)
                  reject(new Error('합성 작업 타임아웃 (2분 초과)'))
                  return
                }
              } catch (pollError) {
                clearInterval(statusInterval)
                reject(pollError)
                return
              }
            }, 2000) // 2초마다 상태 확인
          })
        }
        
        // 상태 폴링 시작
        return await pollStatus()
        
      } else {
        throw new Error(result.message || '최종 비디오 합성 실패')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    composeVideo,
    isLoading,
    progress,
    currentStep,
    error
  }
}

// 최종 합성 작업 상태 모니터링 훅
export const useFinalCompositionStatus = () => {
  const [status, setStatus] = useState<{
    taskId: string | null
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    currentStep: string
    videos: any[]
    error?: string
  }>({
    taskId: null,
    status: 'pending',
    progress: 0,
    currentStep: '',
    videos: []
  })

  const checkStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/api/final-video-composition?taskId=${taskId}`)
      const data = await response.json()
      
      if (data.success) {
        setStatus({
          taskId,
          status: data.status,
          progress: data.progress,
          currentStep: data.currentStep,
          videos: data.videos || [],
          error: data.error
        })
      }
      
      return data
    } catch (error) {
      console.error('상태 확인 오류:', error)
      setStatus(prev => ({
        ...prev,
        status: 'failed',
        error: error instanceof Error ? error.message : '상태 확인 실패'
      }))
    }
  }

  const startPolling = (taskId: string, interval = 2000) => {
    const pollInterval = setInterval(async () => {
      const result = await checkStatus(taskId)
      
      if (result && (result.status === 'completed' || result.status === 'failed')) {
        clearInterval(pollInterval)
      }
    }, interval)
    
    return () => clearInterval(pollInterval)
  }

  return {
    status,
    checkStatus,
    startPolling
  }
}

// 🆕 구간별 키워드 추출 훅
export function useSegmentKeywordExtraction() {
  const [isExtracting, setIsExtracting] = useState(false)
  const [segmentKeywords, setSegmentKeywords] = useState<any[]>([])
  const [extractionSummary, setExtractionSummary] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const extractSegmentKeywords = useCallback(async (
    script: string,
    audioDuration: number,
    options?: {
      language?: string
      segment_duration?: number
      keywords_per_segment?: number
      context_subject?: string
    }
  ) => {
    setIsExtracting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/extract-segment-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script,
          audio_duration: audioDuration,
          language: options?.language || 'ko',
          segment_duration: options?.segment_duration || 3,
          keywords_per_segment: options?.keywords_per_segment || 3,
          context_subject: options?.context_subject || ''
        }),
      })

      const result = await response.json()

      if (result.status === 200 && result.data) {
        setSegmentKeywords(result.data.segments)
        setExtractionSummary(result.data.summary)
        return {
          success: true,
          segments: result.data.segments,
          summary: result.data.summary
        }
      } else {
        throw new Error(result.message || '구간별 키워드 추출에 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '구간별 키워드 추출 중 오류가 발생했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsExtracting(false)
    }
  }, [])

  const resetKeywords = useCallback(() => {
    setSegmentKeywords([])
    setExtractionSummary(null)
    setError(null)
  }, [])

  return {
    isExtracting,
    segmentKeywords,
    extractionSummary,
    error,
    extractSegmentKeywords,
    resetKeywords
  }
}

// 🆕 콘텐츠 원형 분석 훅
export interface ContentArchetypeAnalysis {
  script: string
  segments: Array<{
    segment_id: number
    text: string
    start_time: number
    end_time: number
    keywords: string[]
    emotional_intensity: number
  }>
  analysis: {
    three_second_compliance: {
      total_segments: number
      compliant_segments: number
      compliance_rate: number
    }
    curiosity_score: number
    hook_strength: number
    engagement_prediction: number
    recommendations: string[]
  }
  archetype: {
    pattern: string
    formula: string
    core_message: string
    engagement_triggers: string[]
  }
}

export function useContentArchetypeAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ContentArchetypeAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeContentArchetype = useCallback(async (contentData: {
    category: string
    theme: string
    title: string
    videoText: string
    targetAudience: string
    trendElements: string
    successFactors: string
    notes: string
  }, scriptSettings: {
    length: 'short' | 'medium' | 'long'
    style: string
    tone: string
    target_audience: string
    content_structure: string
    language: string
  }) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/content-archetype-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contentData,
          scriptSettings
        }),
      })

      const result = await response.json()

      if (result.status === 200 && result.data) {
        const analysis: ContentArchetypeAnalysis = {
          script: result.data.script,
          segments: result.data.segments,
          analysis: result.data.analysis,
          archetype: result.data.archetype
        }
        
        setAnalysisResult(analysis)
        console.log('📊 콘텐츠 원형 분석 완료:', {
          주제: contentData.theme,
          카테고리: contentData.category,
          구간수: analysis.segments.length,
          궁금증점수: analysis.analysis.curiosity_score,
          후킹강도: analysis.analysis.hook_strength,
          참여도예측: analysis.analysis.engagement_prediction,
          패턴: analysis.archetype.pattern
        })
        
        return analysis
      } else {
        throw new Error(result.message || '콘텐츠 원형 분석에 실패했습니다.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '콘텐츠 원형 분석 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('콘텐츠 원형 분석 오류:', err)
      throw new Error(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const resetAnalysis = useCallback(() => {
    setAnalysisResult(null)
    setError(null)
  }, [])

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeContentArchetype,
    resetAnalysis
  }
}
