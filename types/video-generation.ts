// 비디오 생성 요청 및 응답 타입 정의

// ===== 입력 데이터 타입들 =====

export interface IContentArchetype {
  category: string          // 카테고리/장르
  theme: string            // 주제/테마
  title: string            // 제목
  videoText: string        // 영상 내 텍스트/자막
  targetAudience: string   // 타겟 시청자층
  trendElements: string    // 트렌드 요소
  successFactors: string   // 성공 요인
  videoLength: 'short' | 'medium' | 'long'  // 원본 영상 길이
  notes: string            // 추가 메모
}

export interface IScriptSettings {
  // 기본 설정
  length: 'short' | 'medium' | 'long'
  style: 'informative' | 'entertaining' | 'educational' | 'dramatic' | 'conversational' | 'professional'
  tone: 'friendly' | 'formal' | 'casual' | 'enthusiastic' | 'calm' | 'humorous'
  target_audience: 'general' | 'young_adults' | 'professionals' | 'students' | 'seniors' | 'parents'
  content_structure: 'hook_content_cta' | 'problem_solution' | 'story_lesson' | 'list_format' | 'comparison' | 'tutorial'
  language: string
  keywords: string[]
  custom_requirements: string
  
  // 뇌과학 기반 옵션들
  enable_advanced_hooks: boolean
  personality_type: 'curious' | 'confident' | 'empathetic' | 'rebellious' | 'authoritative' | 'friendly'
  emotional_trigger: 'curiosity' | 'fear' | 'desire' | 'social_proof' | 'urgency' | 'achievement'
  
  // 3초 룰 최적화 설정
  three_second_compliance: boolean
  hook_intensity: number      // 0-100
  curiosity_level: number     // 0-100
  retention_optimization: boolean
  
  // 시각적 연동 설정
  visual_sync_mode: boolean
  motion_keywords: boolean
  
  // TTS 최적화 설정
  tts_friendly: boolean
  natural_pauses: boolean
  rhythm_optimization: boolean
}

export interface IVoiceSettings {
  actor: string              // TypeCast 배우 ID
  speed: number             // 재생 속도 (0.5 - 2.0)
  volume: number            // 볼륨 (0-100)
  pitch: number             // 피치 (-20 ~ +20)
  format: 'wav' | 'mp3'     // 오디오 포맷
}

export interface IVideoSettings {
  source: 'pexels' | 'serpapi'    // 비디오 소스
  aspect: '9:16' | '16:9' | '1:1' // 화면 비율
  clipDuration: number            // 클립당 재생 시간 (초)
  totalClips: number              // 총 클립 수
  quality: 'high' | 'medium'      // 비디오 품질
}

export interface ISubtitleSettings {
  style: 'youtube' | 'netflix' | 'anime' | 'aesthetic' | 'custom'
  animation: 'none' | 'fade' | 'typewriter' | 'slide' | 'zoom' | 'glow'
  position: 'top' | 'center' | 'bottom'
  fontSize: number
  fontColor: string
  backgroundColor: string
  useBackground: boolean
}

export interface IImageSearchSettings {
  provider: 'serpapi' | 'pexels'
  aspectRatio: 'portrait' | 'landscape' | 'square'
  size: 'large' | 'medium' | 'small'
  safeSearch: boolean
}

// ===== 소재 및 구간 타입들 =====

export interface ISegmentKeyword {
  segment_id: number
  text: string
  start_time: number
  end_time: number
  keywords: string[]
  confidence?: number
}

export interface IAudioFile {
  url: string
  duration: number
  format: string
}

export interface IVideoClip {
  id: string
  url: string
  thumbnail: string
  duration: number
  title?: string
  source: string
}

export interface IImageAsset {
  id: string
  url: string
  thumbnail: string
  title?: string
  source: string
  width: number
  height: number
}

export interface ISelectedMaterial {
  type: 'image' | 'video'
  data: IVideoClip | IImageAsset
}

export interface ISelectedMaterials {
  [segmentId: number]: ISelectedMaterial
}

// ===== 최종 생성 요청 타입 =====

export interface IVideoGenerationRequest {
  // 사용자 정보
  userId: string
  channelName?: string
  
  // 생성 모드
  mode: 'automatic' | 'advanced' | 'custom'
  workflow: 'optimized' | 'backend_integrated' | 'hybrid' | 'legacy'
  
  // 입력 데이터
  input: {
    // 오토매틱 모드용
    automaticInput?: string
    
    // 콘텐츠 원형 정보
    contentArchetype?: IContentArchetype
    
    // 사용자 정의 스크립트
    customScript?: string
    customSegments?: Array<{
      segment_id: number
      text: string
      start_time: number
      end_time: number
      word_count: number
      is_valid: boolean
    }>
  }
  
  // 설정들
  settings: {
    script: IScriptSettings
    voice: IVoiceSettings
    video: IVideoSettings
    subtitle: ISubtitleSettings
    imageSearch: IImageSearchSettings
  }
  
  // 준비된 소재들
  preparedMaterials: {
    script: string
    keywords: string[]
    audioFile: IAudioFile | null
    videoClips: IVideoClip[]
    imageAssets: IImageAsset[]
    subtitleContent: string
    segmentKeywords: ISegmentKeyword[]
    selectedMaterials: ISelectedMaterials
  }
  
  // 메타데이터
  metadata: {
    generatedAt: string
    estimatedDuration: number
    totalSegments: number
    requestHash: string        // 중복 요청 방지용
  }
}

// ===== 생성 응답 타입 =====

export interface IVideoGenerationResponse {
  success: boolean
  taskId: string
  message: string
  data?: {
    videoUrl?: string
    thumbnailUrl?: string
    duration?: number
    fileSize?: number
    metadata: {
      generatedAt: string
      processingTime: number
      qualityMetrics: {
        scriptCompliance: number
        visualSync: number
        audioQuality: number
      }
    }
  }
  error?: string
}

// ===== 작업 상태 타입 =====

export interface ITaskStatus {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  currentStep: string
  estimatedTimeRemaining?: number
  error?: string
  result?: {
    videoUrl: string
    thumbnailUrl: string
    duration: number
    fileSize: number
  }
}

// ===== 데이터베이스 스키마 타입 =====

export interface IVideoProjectSchema {
  id: string
  user_id: string
  title: string
  description?: string
  
  // 프로젝트 설정
  mode: 'automatic' | 'advanced' | 'custom'
  workflow: 'optimized' | 'backend_integrated' | 'hybrid' | 'legacy'
  
  // 입력 데이터 (JSON)
  input_data: any // IVideoGenerationRequest['input']
  settings: any   // IVideoGenerationRequest['settings']
  
  // 생성된 콘텐츠
  generated_script?: string
  generated_keywords?: string[]
  audio_file_url?: string
  subtitle_content?: string
  
  // 소재 정보 (JSON)
  materials: any // IVideoGenerationRequest['preparedMaterials']
  
  // 최종 결과
  final_video_url?: string
  thumbnail_url?: string
  video_duration?: number
  file_size?: number
  
  // 상태 및 메타데이터
  status: 'draft' | 'processing' | 'completed' | 'failed'
  task_id?: string
  processing_started_at?: string
  processing_completed_at?: string
  error_message?: string
  
  // 품질 메트릭 (JSON)
  quality_metrics?: {
    scriptCompliance: number
    visualSync: number
    audioQuality: number
    userRating?: number
  }
  
  // 타임스탬프
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface IUserUsageSchema {
  id: string
  user_id: string
  
  // 사용량 추적
  videos_generated_today: number
  videos_generated_month: number
  videos_generated_total: number
  
  // 구독 정보
  subscription_plan: 'free' | 'pro' | 'premium'
  subscription_start?: string
  subscription_end?: string
  
  // 제한 및 할당량
  daily_limit: number
  monthly_limit: number
  
  // 사용 통계 (JSON)
  usage_stats: {
    totalProcessingTime: number
    averageVideoLength: number
    favoriteWorkflow: string
    mostUsedFeatures: string[]
  }
  
  // 타임스탬프
  created_at: string
  updated_at: string
}

// ===== 유틸리티 타입들 =====

export type WorkflowType = 'optimized' | 'backend_integrated' | 'hybrid' | 'legacy'
export type GenerationMode = 'automatic' | 'advanced' | 'custom'
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type SubscriptionPlan = 'free' | 'pro' | 'premium'

// ===== 기본값 상수들 =====

export const DEFAULT_SCRIPT_SETTINGS: IScriptSettings = {
  length: 'medium',
  style: 'informative',
  tone: 'friendly',
  target_audience: 'general',
  content_structure: 'hook_content_cta',
  language: 'ko',
  keywords: [],
  custom_requirements: '',
  enable_advanced_hooks: true,
  personality_type: 'curious',
  emotional_trigger: 'curiosity',
  three_second_compliance: true,
  hook_intensity: 85,
  curiosity_level: 80,
  retention_optimization: true,
  visual_sync_mode: true,
  motion_keywords: true,
  tts_friendly: true,
  natural_pauses: true,
  rhythm_optimization: true
}

export const DEFAULT_VOICE_SETTINGS: IVoiceSettings = {
  actor: '603fa172a669dfd23f450abd',
  speed: 1.0,
  volume: 100,
  pitch: 0,
  format: 'wav'
}

export const DEFAULT_VIDEO_SETTINGS: IVideoSettings = {
  source: 'pexels',
  aspect: '9:16',
  clipDuration: 3,
  totalClips: 6,
  quality: 'high'
}

export const DEFAULT_SUBTITLE_SETTINGS: ISubtitleSettings = {
  style: 'youtube',
  animation: 'fade',
  position: 'bottom',
  fontSize: 60,
  fontColor: '#FFFFFF',
  backgroundColor: '#000000',
  useBackground: true
}

export const DEFAULT_IMAGE_SEARCH_SETTINGS: IImageSearchSettings = {
  provider: 'serpapi',
  aspectRatio: 'square',
  size: 'large',
  safeSearch: true
} 