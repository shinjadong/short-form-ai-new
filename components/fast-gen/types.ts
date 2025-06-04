export interface StepData {
  subject: string
  language: string
  script: string
  keywords: string
  videoSource: string
  videoMaterials?: Array<{
    name: string
    size: number
    type: string
    url: string
  }>
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

export interface Step {
  id: number
  title: string
  icon: any
  description: string
}

// TypeCast API 기반 타입 정의
export interface TypecastActor {
  actor_id: string
  name: {
    en: string
    ko?: string
  }
  language?: string
  gender?: string
  description?: string
  age?: string
}

export interface TypecastActorVersion {
  name: string
  aliases: string[]
  display_name: string
  emotion_tone_presets: string[]
  emotion_prompt: boolean
}

export interface TypecastVoiceRequest {
  text: string
  tts_mode?: 'actor' | 'audio_file'
  actor_id: string
  lang: string
  xapi_hd?: boolean
  xapi_audio_format?: 'wav' | 'mp3'
  model_version?: string
  emotion_tone_preset?: string
  emotion_prompt?: string
  volume?: number
  speed_x?: number
  tempo?: number
  pitch?: number
  max_seconds?: number
  duration?: number
  last_pitch?: number
}

export interface TypecastVoiceResponse {
  success: boolean
  audio_url?: string
  audio_data?: string
  format?: string
  actor_id?: string
  message?: string
  error?: string
}

export interface TypecastSpeakResponse {
  result: {
    speak_v2_url: string
    speak_url: string
  }
}

export interface TypecastSpeakStatusResponse {
  result: {
    _id: string
    audio_download_url: string
    text_count: number
    duration: number
    status: 'done' | 'progress' | 'failed' | 'started'
  }
}

export type StepStatus = 'completed' | 'current' | 'pending'

export const initialStepData: StepData = {
  subject: '',
  language: 'ko-KR',
  script: '',
  keywords: '',
  videoSource: 'pexels',
  videoMaterials: [],
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

export const koreanExamples = [
  "행복한 삶을 위한 5가지 습관",
  "건강한 라이프스타일의 비밀", 
  "성공하는 사람들의 아침 루틴",
  "효율적인 시간 관리 방법",
  "마음의 평화를 찾는 법"
]

// TypeCast 언어 코드 상수
export const TYPECAST_LANGUAGES = [
  { code: 'auto', name: '자동 감지' },
  { code: 'ko-kr', name: '한국어' },
  { code: 'en-us', name: '영어 (미국)' },
  { code: 'ja-jp', name: '일본어' },
  { code: 'es-es', name: '스페인어' },
  { code: 'zh-cn', name: '중국어 (간체)' },
  { code: 'fr-fr', name: '프랑스어' },
  { code: 'de-de', name: '독일어' },
  { code: 'pt-pt', name: '포르투갈어' },
  { code: 'it-it', name: '이탈리아어' },
  { code: 'ru-ru', name: '러시아어' }
] as const

// TypeCast 오디오 포맷 상수
export const TYPECAST_AUDIO_FORMATS = [
  { value: 'wav', label: 'WAV (고품질)' },
  { value: 'mp3', label: 'MP3 (압축)' }
] as const 