// API 클라이언트 - 백엔드와 통신하는 모든 함수들
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
  TaskStatusResponse,
  ApiResponse,
  ApiError,
  UnifiedVideoRequest
} from '@/types/api-requests'

// 기본 API 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
const DEFAULT_TIMEOUT = 30000 // 30초

// 공통 fetch 래퍼
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        status: response.status,
        message: response.statusText,
        details: 'Failed to parse error response'
      }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

// =============================================================================
// 1. 콘텐츠 원형 분석 API (Claude 4 Sonnet)
// =============================================================================

export async function analyzeContentArchetype(
  request: ContentArchetypeRequest
): Promise<ContentArchetypeResponse> {
  console.log('🔬 콘텐츠 원형 분석 요청:', {
    모드: request.mode,
    카테고리: request.archetype.category,
    주제: request.archetype.theme,
    길이: request.scriptSettings.length,
    스타일: request.scriptSettings.style
  })

  return apiRequest<ContentArchetypeResponse>(
    '/api/content-archetype-analysis',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    60000 // Claude 분석은 시간이 더 걸릴 수 있음
  )
}

// =============================================================================
// 2. TypeCast AI 음성 생성 API
// =============================================================================

export async function generateVoice(
  request: VoiceGenerationRequest
): Promise<VoiceGenerationResponse> {
  console.log('🎤 음성 생성 요청:', {
    텍스트길이: request.text.length,
    액터: request.actor_id,
    속도: request.settings.tempo,
    품질: request.settings.hd_quality
  })

  return apiRequest<VoiceGenerationResponse>(
    '/api/generate-typecast-voice',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    45000 // 음성 생성은 시간이 걸림
  )
}

// =============================================================================
// 3. Whisper 기반 자막 생성 API
// =============================================================================

export async function generateSubtitle(
  request: SubtitleGenerationRequest
): Promise<SubtitleGenerationResponse> {
  console.log('💬 자막 생성 요청:', {
    음성URL: request.audio.url?.substring(0, 50) + '...',
    스타일: request.settings.style,
    애니메이션: request.settings.animation,
    한국어최적화: request.settings.korean_optimization
  })

  return apiRequest<SubtitleGenerationResponse>(
    '/api/generate-enhanced-subtitle',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    60000 // Whisper 분석은 시간이 걸림
  )
}

// =============================================================================
// 4. 구간별 키워드 추출 API
// =============================================================================

export async function extractSegmentKeywords(
  request: SegmentKeywordExtractionRequest
): Promise<SegmentKeywordExtractionResponse> {
  console.log('🔍 구간별 키워드 추출 요청:', {
    스크립트길이: request.script.length,
    음성길이: request.audio_duration,
    구간길이: request.settings.segment_duration,
    추출방식: request.settings.extraction_method
  })

  return apiRequest<SegmentKeywordExtractionResponse>(
    '/api/extract-segment-keywords',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    30000
  )
}

// =============================================================================
// 5. 이미지 검색 API (정방형 우선)
// =============================================================================

export async function searchImages(
  request: ImageSearchRequest
): Promise<ImageSearchResponse> {
  console.log('🖼️ 이미지 검색 요청:', {
    키워드: request.keyword,
    제공자: request.settings.provider,
    종횡비: request.settings.image_aspect,
    크기: request.settings.image_size,
    최대결과: request.settings.max_results
  })

  return apiRequest<ImageSearchResponse>(
    '/api/search-images',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    25000
  )
}

// =============================================================================
// 6. 비디오 검색 API
// =============================================================================

export async function searchVideos(
  request: VideoSearchRequest
): Promise<VideoSearchResponse> {
  console.log('🎬 비디오 검색 요청:', {
    키워드: request.keywords,
    제공자: request.settings.provider,
    방향: request.settings.orientation,
    페이지당결과: request.settings.perPage
  })

  return apiRequest<VideoSearchResponse>(
    '/api/search-videos',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    25000
  )
}

// =============================================================================
// 7. 최종 영상 합성 API
// =============================================================================

export async function composeVideo(
  request: FinalVideoCompositionRequest
): Promise<FinalVideoCompositionResponse> {
  console.log('🎬 최종 영상 합성 요청:', {
    작업ID: request.taskId,
    주제: request.project.videoSubject,
    화면비율: request.video.aspect,
    해상도: `${request.video.resolution.width}x${request.video.resolution.height}`,
    비디오클립: request.materials.videoClips.length,
    이미지에셋: request.materials.imageAssets.length,
    자막활성화: request.subtitle.enabled
  })

  return apiRequest<FinalVideoCompositionResponse>(
    '/api/final-video-composition',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    120000 // 영상 합성은 가장 오래 걸림 (2분)
  )
}

// =============================================================================
// 8. 작업 상태 조회 API
// =============================================================================

export async function getTaskStatus(
  request: TaskStatusRequest
): Promise<TaskStatusResponse> {
  console.log('📊 작업 상태 조회:', { 작업ID: request.taskId })

  return apiRequest<TaskStatusResponse>(
    `/api/task-status/${request.taskId}`,
    {
      method: 'GET',
    },
    10000
  )
}

// =============================================================================
// 9. 기존 백엔드 호환 API (VideoParams 형식)
// =============================================================================

export async function createVideoTask(
  request: UnifiedVideoRequest
): Promise<ApiResponse<{ task_id: string }>> {
  console.log('🎥 통합 비디오 작업 생성:', {
    주제: request.video_subject,
    화면비율: request.video_aspect,
    음성: request.voice_name,
    자막활성화: request.subtitle_enabled
  })

  return apiRequest<ApiResponse<{ task_id: string }>>(
    '/api/tasks',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    30000
  )
}

// =============================================================================
// 10. 헬퍼 함수들
// =============================================================================

// 타임아웃과 함께 작업 상태 폴링
export async function pollTaskStatus(
  taskId: string,
  intervalMs: number = 2000,
  maxAttempts: number = 60
): Promise<TaskStatusResponse> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const status = await getTaskStatus({ taskId })
      
      // 완료 상태면 반환
      if (status.state === 2 || status.state === 3) {
        return status
      }
      
      // 다음 폴링까지 대기
      await new Promise(resolve => setTimeout(resolve, intervalMs))
    } catch (error) {
      console.warn(`작업 상태 조회 시도 ${attempt + 1} 실패:`, error)
      
      // 마지막 시도가 아니면 계속
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, intervalMs))
        continue
      }
      
      throw error
    }
  }
  
  throw new Error(`작업 상태 조회 타임아웃 (${maxAttempts}회 시도)`)
}

// API 엔드포인트 헬스체크
export async function checkApiHealth(): Promise<{ status: string; timestamp: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(`Health check failed: ${response.status}`)
    }
  } catch (error) {
    throw new Error(`API 서버 연결 실패: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// 파일 업로드 (BGM, 커스텀 소재 등)
export async function uploadFile(
  file: File,
  type: 'bgm' | 'image' | 'video' | 'audio'
): Promise<{ url: string; filename: string; size: number }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  console.log('📤 파일 업로드:', {
    파일명: file.name,
    크기: file.size,
    타입: type
  })

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`파일 업로드 실패: ${response.statusText}`)
  }

  return await response.json()
}

// TypeCast 액터 목록 조회
export async function getTypeCastActors(): Promise<{
  actors: Array<{
    id: string
    name: string
    language: string
    gender: string
    age?: string
    description?: string
  }>
}> {
  return apiRequest('/api/typecast-actor-versions', { method: 'GET' })
}

// BGM 목록 조회
export async function getBGMList(): Promise<{
  files: Array<{
    name: string
    size: number
    file: string
  }>
}> {
  return apiRequest('/api/bgm', { method: 'GET' })
}

// =============================================================================
// 11. 에러 처리 유틸리티
// =============================================================================

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: string
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}

// 재시도 로직을 포함한 API 호출
export async function apiRequestWithRetry<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: Error = new Error('No attempts made')

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt === maxRetries) {
        break
      }
      
      console.warn(`API 요청 시도 ${attempt + 1} 실패, ${retryDelay}ms 후 재시도:`, lastError.message)
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
    }
  }

  throw new ApiClientError(
    `API 요청이 ${maxRetries + 1}번 모두 실패했습니다: ${lastError.message}`,
    undefined,
    'MAX_RETRIES_EXCEEDED',
    lastError.message
  )
}

export default {
  // 주요 API 함수들
  analyzeContentArchetype,
  generateVoice,
  generateSubtitle,
  extractSegmentKeywords,
  searchImages,
  searchVideos,
  composeVideo,
  getTaskStatus,
  createVideoTask,
  
  // 헬퍼 함수들
  pollTaskStatus,
  checkApiHealth,
  uploadFile,
  getTypeCastActors,
  getBGMList,
  
  // 유틸리티
  apiRequestWithRetry,
  isApiError
}
