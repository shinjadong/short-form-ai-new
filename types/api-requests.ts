// 백엔드 API 요청 데이터 타입 정의
// backend/app/models/schema.py와 매칭

// =============================================================================
// 1. 콘텐츠 원형 분석 요청 (Claude 4 Sonnet 기반)
// =============================================================================

export interface ContentArchetypeRequest {
  // 🆕 콘텐츠 원형 정보
  archetype: {
    category: string                    // 카테고리/장르
    theme: string                      // 주제/테마
    title?: string                     // 원본 제목 (참고용)
    videoText: string                  // 영상 내 핵심 텍스트/자막
    targetAudience: string             // 타겟 시청자층
    trendElements?: string             // 트렌드 요소
    successFactors?: string            // 성공 요인 분석
    videoLength?: 'short' | 'medium' | 'long'  // 원본 영상 길이
    notes?: string                     // 추가 메모
  }
  
  // 🧠 뇌과학 기반 스크립트 설정
  scriptSettings: {
    length: 'short' | 'medium' | 'long'                    // 15초/30초/60초
    style: 'informative' | 'entertaining' | 'educational' | 'dramatic' | 'conversational' | 'professional'
    tone: 'friendly' | 'formal' | 'casual' | 'enthusiastic' | 'calm' | 'humorous'
    target_audience: 'general' | 'young_adults' | 'professionals' | 'students' | 'seniors' | 'parents'
    content_structure: 'hook_content_cta' | 'problem_solution' | 'story_lesson' | 'list_format' | 'comparison' | 'tutorial'
    language: string                                       // 'ko', 'en', etc.
    keywords?: string[]                                    // 추가 키워드
    custom_requirements?: string                           // 커스텀 요구사항
    
    // 🔥 3초 룰 헌법 설정
    enable_advanced_hooks: boolean                         // 고급 후킹 시스템
    personality_type: 'curious' | 'confident' | 'empathetic' | 'rebellious' | 'authoritative' | 'friendly'
    emotional_trigger: 'curiosity' | 'fear' | 'desire' | 'social_proof' | 'urgency' | 'achievement'
    three_second_compliance: boolean                       // 3초 룰 준수 여부
    hook_intensity: number                                 // 후킹 강도 (0-100)
    curiosity_level: number                                // 궁금증 레벨 (0-100)
    retention_optimization: boolean                        // 시청 지속률 최적화
    visual_sync_mode: boolean                              // 시각적 컷과 동기화
    motion_keywords: boolean                               // 움직임 관련 키워드 포함
    tts_friendly: boolean                                  // 발음하기 쉬운 구조
    natural_pauses: boolean                                // 자연스러운 호흡점
    rhythm_optimization: boolean                           // 리듬감 최적화
  }
  
  // 🤖 AI 모드 설정
  mode: 'automatic' | 'advanced'                          // 오토매틱 vs 고급 수동
  automaticInput?: string                                 // 오토매틱 모드 입력 텍스트
}

export interface ContentArchetypeResponse {
  success: boolean
  script: string                                          // 생성된 3초 룰 스크립트
  segments?: Array<{
    segment_id: number
    text: string
    start_time: number
    end_time: number
    keywords: string[]
    hook_strength?: number                                // 후킹 강도 분석
    curiosity_score?: number                              // 궁금증 점수
  }>
  analysis?: {
    three_second_compliance: {
      overall_score: number                               // 전체 준수율
      segment_scores: number[]                            // 구간별 점수
      improvement_areas: string[]                         // 개선 필요 영역
    }
    curiosity_score: number                               // 궁금증 점수 (0-100)
    hook_strength: number                                 // 후킹 강도 (0-100)
    engagement_prediction: number                         // 참여도 예측 (0-100)
    retention_score: number                               // 시청 지속률 예측
    viral_potential: number                               // 바이럴 가능성
    recommendations: string[]                             // AI 추천사항
  }
  archetype?: {
    pattern: string                                       // 감지된 아키타입 패턴
    success_probability: number                           // 성공 확률
    similar_content: string[]                             // 유사 성공 콘텐츠
  }
}

// =============================================================================
// 2. TypeCast AI 음성 생성 요청
// =============================================================================

export interface VoiceGenerationRequest {
  text: string                                            // TTS 변환할 텍스트 (메타데이터 제거된)
  actor_id: string                                        // TypeCast 액터 ID
  settings: {
    lang?: string                                         // 언어 (auto, ko, en)
    tempo: number                                         // 말하기 속도 (0.5~2.0)
    volume: number                                        // 볼륨 (0~100)
    pitch: number                                         // 피치 조절 (-20~20)
    audio_format: 'wav' | 'mp3'                          // 오디오 포맷
    max_seconds?: number                                  // 최대 길이
    hd_quality: boolean                                   // 고품질 모드
  }
}

export interface VoiceGenerationResponse {
  success: boolean
  audio_url: string                                       // 생성된 음성 파일 URL
  duration: number                                        // 음성 길이 (초)
  format: string                                          // 오디오 포맷
  actor_id: string                                        // 사용된 액터 ID
  file_size?: number                                      // 파일 크기 (bytes)
}

// =============================================================================
// 3. Whisper 기반 자막 생성 요청
// =============================================================================

export interface SubtitleGenerationRequest {
  audio: {
    url?: string                                          // 음성 파일 URL
    audio_data?: string                                   // Base64 인코딩된 음성 데이터
    format?: string                                       // 음성 포맷
    duration?: number                                     // 음성 길이
  }
  settings: {
    style: 'youtube' | 'netflix' | 'anime' | 'aesthetic' | 'custom'
    animation: 'none' | 'fade' | 'typewriter' | 'slide' | 'zoom' | 'glow'
    korean_optimization: boolean                          // 한국어 최적화
    segment_precision: 'high' | 'medium' | 'low'         // 구간 분할 정밀도
  }
}

export interface SubtitleGenerationResponse {
  success: boolean
  subtitle_content: string                               // SRT/VTT 형식 자막
  segments: Array<{
    start: number                                         // 시작 시간 (초)
    end: number                                           // 종료 시간 (초)
    text: string                                          // 구간 텍스트
    confidence?: number                                   // 인식 신뢰도
    avg_logprob?: number                                  // 평균 로그 확률
  }>
  raw_transcription?: string                              // 원본 전사 텍스트
  processing_time?: number                                // 처리 시간 (초)
}

// =============================================================================
// 4. Whisper 기반 구간별 키워드 추출 요청
// =============================================================================

export interface SegmentKeywordExtractionRequest {
  script: string                                          // 스크립트 텍스트
  audio_duration: number                                  // 음성 길이 (초)
  settings: {
    language: string                                      // 언어 코드
    segment_duration: number                              // 구간 길이 (초, 기본 3초)
    keywords_per_segment: number                          // 구간당 키워드 수
    context_subject: string                               // 콘텐츠 주제 컨텍스트
    extraction_method: 'whisper_segments' | 'time_based' // 추출 방식
  }
}

export interface SegmentKeywordExtractionResponse {
  success: boolean
  segments: Array<{
    segment_id: number
    text: string                                          // 구간 텍스트
    start_time: number                                    // 시작 시간 (초)
    end_time: number                                      // 종료 시간 (초)
    keywords: string[]                                    // 추출된 키워드 (개선된 알고리즘)
    confidence?: number                                   // 키워드 신뢰도
    compound_nouns?: string[]                             // 복합명사 리스트
    proper_nouns?: string[]                               // 고유명사 리스트
  }>
  total_duration: number                                  // 전체 길이
  extraction_method: string                               // 사용된 추출 방식
}

// =============================================================================
// 5. 개선된 이미지 검색 요청 (정방형 우선)
// =============================================================================

export interface ImageSearchRequest {
  keyword: string                                         // 검색 키워드 (개선된 알고리즘에서 추출)
  settings: {
    provider: 'serpapi' | 'pexels'                       // 검색 제공자
    image_aspect: 'square' | 'portrait' | 'landscape'    // 🔥 정방형 우선
    image_size: 'l' | 'm' | 'i'                         // large/medium/icon
    max_results: number                                   // 최대 결과 수
    safe_search: boolean                                  // 안전 검색
    color?: 'color' | 'gray' | 'trans'                  // 색상 필터
    type?: 'photo' | 'clipart' | 'lineart'             // 이미지 타입
  }
}

export interface ImageSearchResponse {
  success: boolean
  images: Array<{
    id: string                                            // 이미지 고유 ID
    url: string                                           // 원본 이미지 URL
    thumbnail_url: string                                 // 썸네일 URL
    title: string                                         // 이미지 제목
    source: string                                        // 출처 URL
    width: number                                         // 이미지 너비
    height: number                                        // 이미지 높이
    file_size?: number                                    // 파일 크기
    format: string                                        // 이미지 포맷 (jpg, png, etc.)
    aspect_ratio: number                                  // 종횡비
    provider: string                                      // 제공자
  }>
  keyword: string                                         // 검색에 사용된 키워드
  total_results: number                                   // 전체 결과 수
}

// =============================================================================
// 6. 비디오 검색 요청
// =============================================================================

export interface VideoSearchRequest {
  keywords: string[]                                      // 검색 키워드 배열
  settings: {
    provider: 'pexels' | 'pixabay'                       // 검색 제공자
    orientation: 'portrait' | 'landscape' | 'square'     // 영상 방향
    perPage: number                                       // 페이지당 결과 수
    duration?: 'short' | 'medium' | 'long'              // 영상 길이
    quality?: 'hd' | 'sd'                               // 영상 품질
  }
}

export interface VideoSearchResponse {
  success: boolean
  videos: Array<{
    id: string                                            // 비디오 고유 ID
    url: string                                           // 비디오 URL
    thumbnail: string                                     // 썸네일 URL
    duration: number                                      // 길이 (초)
    width: number                                         // 해상도 너비
    height: number                                        // 해상도 높이
    file_size?: number                                    // 파일 크기
    tags?: string[]                                       // 태그
    provider: string                                      // 제공자
  }>
  keywords: string[]                                      // 검색에 사용된 키워드
  total_results: number                                   // 전체 결과 수
}

// =============================================================================
// 7. 최종 영상 합성 요청 (종합)
// =============================================================================

export interface FinalVideoCompositionRequest {
  taskId: string                                          // 작업 고유 ID
  
  // 기본 정보
  project: {
    videoSubject: string                                  // 영상 주제
    videoScript: string                                   // 최종 스크립트
  }
  
  // 오디오 소재
  audio: {
    url: string                                           // 음성 파일 URL
    duration: number                                      // 음성 길이
    format: string                                        // 음성 포맷
  }
  
  // 시각적 소재 (구간별)
  materials: {
    videoClips: Array<{
      segment_id: number                                  // 구간 ID
      url: string                                         // 비디오 URL
      thumbnail: string                                   // 썸네일
      duration: number                                    // 길이
      start_time: number                                  // 사용 시작 시간
      end_time: number                                    // 사용 종료 시간
    }>
    imageAssets: Array<{
      segment_id: number                                  // 구간 ID
      url: string                                         // 이미지 URL
      thumbnail_url: string                               // 썸네일 URL
      width: number                                       // 해상도
      height: number                                      // 해상도
      start_time: number                                  // 표시 시작 시간
      end_time: number                                    // 표시 종료 시간
      aspect_ratio: number                                // 종횡비
    }>
  }
  
  // 자막 설정
  subtitle: {
    content: string                                       // SRT/VTT 자막 내용
    enabled: boolean                                      // 자막 활성화
    settings: {
      style: 'youtube' | 'netflix' | 'anime' | 'aesthetic' | 'custom'
      animation: 'none' | 'fade' | 'typewriter' | 'slide' | 'zoom' | 'glow'
      position: 'top' | 'center' | 'bottom'              // 자막 위치
      fontName: string                                    // 폰트명
      fontSize: number                                    // 폰트 크기
      fontColor: string                                   // 폰트 색상
      strokeColor: string                                 // 외곽선 색상
      strokeWidth: number                                 // 외곽선 두께
      backgroundColor: string                             // 배경 색상
      useBackground: boolean                              // 배경 사용 여부
      custom_position?: number                            // 커스텀 위치 (%)
    }
  }
  
  // 영상 설정
  video: {
    aspect: '9:16' | '16:9' | '1:1'                      // 화면 비율
    resolution: {
      width: number                                       // 해상도 너비
      height: number                                      // 해상도 높이
    }
    clipDuration: number                                  // 클립당 길이
    concatMode: 'sequential' | 'random'                  // 연결 방식
    transitionMode: 'none' | 'fade' | 'slide' | 'zoom'  // 전환 효과
    framerate: number                                     // 프레임레이트 (기본 30)
  }
  
  // 배경음악 설정
  bgm?: {
    type: 'none' | 'random' | 'custom'                   // 배경음악 타입
    file?: string                                         // 커스텀 BGM 파일
    volume: number                                        // BGM 볼륨 (0.0-1.0)
    fadeIn?: boolean                                      // 페이드인 효과
    fadeOut?: boolean                                     // 페이드아웃 효과
  }
  
  // 렌더링 설정
  rendering: {
    quality: 'high' | 'medium' | 'low'                   // 렌더링 품질
    codec: 'h264' | 'h265'                               // 비디오 코덱
    bitrate?: number                                      // 비트레이트
    n_threads?: number                                    // 스레드 수
  }
}

export interface FinalVideoCompositionResponse {
  success: boolean
  taskId: string                                          // 작업 ID
  progress: number                                        // 진행률 (0-100)
  currentStep?: string                                    // 현재 진행 단계
  videoUrl?: string                                       // 완성된 영상 URL
  thumbnail?: string                                      // 영상 썸네일
  duration?: number                                       // 최종 영상 길이
  fileSize?: number                                       // 파일 크기
  error?: string                                          // 에러 메시지
  estimatedTime?: number                                  // 예상 완료 시간 (초)
}

// =============================================================================
// 8. 작업 상태 조회 요청
// =============================================================================

export interface TaskStatusRequest {
  taskId: string                                          // 작업 ID
}

export interface TaskStatusResponse {
  success: boolean
  taskId: string                                          // 작업 ID
  state: number                                           // 작업 상태 (0: 대기, 1: 진행중, 2: 완료, 3: 오류)
  progress: number                                        // 진행률 (0-100)
  currentStep?: string                                    // 현재 단계
  videos?: string[]                                       // 완성된 영상 URL 목록
  combined_videos?: string[]                              // 합성된 영상 URL 목록
  error?: string                                          // 에러 메시지
  created_at?: string                                     // 작업 시작 시간
  updated_at?: string                                     // 마지막 업데이트 시간
  estimated_completion?: string                           // 예상 완료 시간
}

// =============================================================================
// 9. 유틸리티 타입들
// =============================================================================

// API 공통 응답 타입
export interface ApiResponse<T = any> {
  status: number                                          // HTTP 상태 코드
  message: string                                         // 응답 메시지
  data: T                                                 // 응답 데이터
  timestamp?: string                                      // 응답 시간
}

// 에러 응답 타입
export interface ApiError {
  status: number                                          // 에러 상태 코드
  message: string                                         // 에러 메시지
  details?: string                                        // 상세 에러 정보
  code?: string                                           // 에러 코드
}

// 페이지네이션 타입
export interface PaginationParams {
  page?: number                                           // 페이지 번호
  limit?: number                                          // 페이지당 항목 수
  offset?: number                                         // 오프셋
}

export interface PaginatedResponse<T> {
  items: T[]                                              // 데이터 배열
  total: number                                           // 전체 항목 수
  page: number                                            // 현재 페이지
  limit: number                                           // 페이지당 항목 수
  hasNext: boolean                                        // 다음 페이지 존재 여부
  hasPrev: boolean                                        // 이전 페이지 존재 여부
}

// =============================================================================
// 10. 백엔드 VideoParams와 매칭되는 통합 요청 타입
// =============================================================================

export interface UnifiedVideoRequest {
  // VideoParams와 매칭
  video_subject: string
  video_script: string
  video_terms?: string | string[]
  video_aspect: '9:16' | '16:9' | '1:1'
  video_concat_mode: 'random' | 'sequential'
  video_transition_mode?: 'none' | 'Shuffle' | 'FadeIn' | 'FadeOut' | 'SlideIn' | 'SlideOut'
  video_clip_duration: number
  video_count: number
  video_source: string
  video_materials?: Array<{
    provider: string
    url: string
    duration: number
  }>
  video_language: string
  
  // TTS 설정
  voice_name: string
  voice_volume: number
  voice_rate: number
  
  // BGM 설정
  bgm_type: string
  bgm_file?: string
  bgm_volume: number
  
  // 자막 설정
  subtitle_enabled: boolean
  subtitle_position: 'top' | 'bottom' | 'center'
  custom_position: number
  font_name: string
  text_fore_color: string
  text_background_color: string | boolean
  font_size: number
  stroke_color: string
  stroke_width: number
  
  // 렌더링 설정
  n_threads: number
  paragraph_number: number
  llm_provider: 'openai' | 'gemini' | 'claude'
} 