'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import {
  useScriptGeneration,
  useVoiceGeneration,
  useEnhancedSubtitle,
  useSegmentKeywordExtraction,
  useImageSearch,
  useVideoSearch,
  useFinalVideoComposition,
  useContentArchetypeAnalysis
} from '@/hooks/useDirectApiCalls'
import { supabase } from '@/lib/supabase-client'
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  Download,
  Palette,
  Settings,
  Wand2,
  Play,
  Sliders
} from 'lucide-react'

// 타입 정의들
interface PreparedMaterials {
  script: string
  keywords: string[]
  audioFile: {
    url: string
    duration: number
    format: string
  } | null
  videoClips: any[]
  imageAssets: any[]
  subtitleContent: string
  isReady: boolean
}

interface SegmentKeyword {
  segment_id: number
  text: string
  start_time: number
  end_time: number
  keywords: string[]
  confidence?: number
}

interface CustomSegment {
  segment_id: number
  text: string
  start_time: number
  end_time: number
  word_count: number
  is_valid: boolean
}

interface SelectedMaterial {
  type: 'image' | 'video'
  data: any
}

interface SelectedMaterials {
  [key: number]: SelectedMaterial
}

const HybridWorkflow: React.FC = () => {
  // 기본 입력
  const [subject, setSubject] = useState('')
  const [useCustomScript, setUseCustomScript] = useState(false)
  const [customScript, setCustomScript] = useState('')

  // 🆕 콘텐츠 원형 정보 상태
  const [contentArchetype, setContentArchetype] = useState({
    category: '',           // 카테고리/장르
    theme: '',             // 주제/테마  
    title: '',             // 제목
    videoText: '',         // 영상 내 텍스트/자막
    targetAudience: '',    // 타겟 시청자층
    trendElements: '',     // 트렌드 요소
    successFactors: '',    // 성공 요인
    videoLength: 'medium', // 원본 영상 길이
    notes: ''              // 추가 메모
  })

  // 🆕 사용자 정의 스크립트 개선된 상태들
  const [customScriptDuration, setCustomScriptDuration] = useState<'short' | 'medium' | 'long'>('medium')
  const [customSegments, setCustomSegments] = useState<CustomSegment[]>([])

  // 단계별 커스터마이징 설정 (3초 룰 헌법 기반으로 강화)
  const [scriptSettings, setScriptSettings] = useState({
    // 🎯 기본 설정
    length: 'medium' as 'short' | 'medium' | 'long',
    style: 'informative' as 'informative' | 'entertaining' | 'educational' | 'dramatic' | 'conversational' | 'professional',
    tone: 'friendly' as 'friendly' | 'formal' | 'casual' | 'enthusiastic' | 'calm' | 'humorous',
    target_audience: 'general' as 'general' | 'young_adults' | 'professionals' | 'students' | 'seniors' | 'parents',
    content_structure: 'hook_content_cta' as 'hook_content_cta' | 'problem_solution' | 'story_lesson' | 'list_format' | 'comparison' | 'tutorial',
    language: 'ko',
    keywords: [] as string[],
    custom_requirements: '',
    
    // 🧠 뇌과학 기반 신규 옵션들
    enable_advanced_hooks: true,
    personality_type: 'curious' as 'curious' | 'confident' | 'empathetic' | 'rebellious' | 'authoritative' | 'friendly',
    emotional_trigger: 'curiosity' as 'curiosity' | 'fear' | 'desire' | 'social_proof' | 'urgency' | 'achievement',
    
    // 🔥 3초 룰 최적화 설정
    three_second_compliance: true,
    hook_intensity: 85, // 후킹 강도 (0-100)
    curiosity_level: 80, // 궁금증 레벨 (0-100)
    retention_optimization: true, // 시청 지속률 최적화
    
    // 🎬 시각적 연동 설정
    visual_sync_mode: true, // 시각적 컷과 동기화
    motion_keywords: true, // 움직임 관련 키워드 포함
    
    // 🗣️ TTS 최적화 설정
    tts_friendly: true, // 발음하기 쉬운 구조
    natural_pauses: true, // 자연스러운 호흡점
    rhythm_optimization: true // 리듬감 최적화
  })

  const [voiceSettings, setVoiceSettings] = useState({
    actor: '603fa172a669dfd23f450abd',
    speed: 1.0,
    volume: 100,
    pitch: 0,
    format: 'wav' as 'wav' | 'mp3'
  })

  const [videoSettings, setVideoSettings] = useState({
    source: 'pexels' as 'pexels' | 'serpapi',
    aspect: '9:16' as '9:16' | '16:9' | '1:1',
    clipDuration: 3,
    totalClips: 6,
    quality: 'high' as 'high' | 'medium'
  })

  const [subtitleSettings, setSubtitleSettings] = useState({
    style: 'youtube' as 'youtube' | 'netflix' | 'anime' | 'aesthetic' | 'custom',
    animation: 'fade' as 'none' | 'fade' | 'typewriter' | 'slide' | 'zoom' | 'glow',
    position: 'bottom' as 'top' | 'center' | 'bottom',
    fontSize: 60,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    useBackground: true
  })

  const [imageSearchSettings, setImageSearchSettings] = useState({
    provider: 'serpapi' as 'serpapi' | 'pexels',
    aspectRatio: 'square' as 'portrait' | 'landscape' | 'square', // 🔥 정방형으로 변경
    size: 'large' as 'large' | 'medium' | 'small',
    safeSearch: true
  })

  // 소재 준비 상태
  const [preparationStep, setPreparationStep] = useState(0)
  const [currentStepDescription, setCurrentStepDescription] = useState('')
  const [preparedMaterials, setPreparedMaterials] = useState<PreparedMaterials>({
    script: '',
    keywords: [],
    audioFile: null,
    videoClips: [],
    imageAssets: [],
    subtitleContent: '',
    isReady: false
  })

  // 구간별 키워드 데이터
  const [segmentKeywords, setSegmentKeywords] = useState<SegmentKeyword[]>([])

  // 사용자 선택을 위한 검색된 소재들 (구간별)
  const [segmentSearchResults, setSegmentSearchResults] = useState<{
    [segmentId: number]: {
      images: any[]
      videos: any[]
    }
  }>({})

  // 사용자 선택된 소재들 (구간별)
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterials>({})

  // 에러 및 재시도 상태 
  const [preparationErrors, setPreparationErrors] = useState<{[key: number]: string}>({})
  const [retryCount, setRetryCount] = useState<{[key: number]: number}>({})
  const [isStepBlocked, setIsStepBlocked] = useState<{[key: number]: boolean}>({})
  const MAX_RETRIES = 3

  // 최종 합성 상태
  const [isComposing, setIsComposing] = useState(false)
  const [compositionProgress, setCompositionProgress] = useState(0)
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null)

  // 🆕 스크립트 분석 결과 상태
  const [scriptAnalysis, setScriptAnalysis] = useState<{
    segments: any[]
    analysis: any
    compliance: any
    recommendations: string[]
  } | null>(null)

  // 🆕 모드 상태 추가 (오토매틱 vs 고급 수동)
  const [analysisMode, setAnalysisMode] = useState<'automatic' | 'advanced'>('automatic')

  // 🆕 오토매틱 모드용 간단한 입력 상태
  const [automaticInput, setAutomaticInput] = useState('')

  // 🆕 선택된 구간 상태 추가
  const [selectedSegmentForMaterial, setSelectedSegmentForMaterial] = useState<number>(0)

  // 🆕 사용자 정보 상태 (채널명을 위해)
  const [userInfo, setUserInfo] = useState<{channelName?: string} | null>(null)

  // Hooks
  const scriptGen = useScriptGeneration()
  const segmentKeywordExtraction = useSegmentKeywordExtraction()
  const voiceGen = useVoiceGeneration()
  const videoSearch = useVideoSearch()
  const imageSearch = useImageSearch()
  const subtitleGen = useEnhancedSubtitle()
  const finalComposition = useFinalVideoComposition()
  const contentArchetypeAnalysis = useContentArchetypeAnalysis()

  // 🆕 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('channel_name')
            .eq('id', user.id)
            .single()
          
          setUserInfo({ channelName: userData?.channel_name })
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error)
      }
    }
    
    fetchUserInfo()
  }, [])

  // 전체 진행률 계산
  const getTotalProgress = () => {
    if (preparationStep === 0) return 0
    if (preparationStep === 4 && preparedMaterials.isReady) return 100
    return (preparationStep / 4) * 100
  }

  // 현재 단계 설명 업데이트
  useEffect(() => {
    const stepDescriptions = {
      0: '준비 대기 중...',
      1: '스크립트 생성 중...',
      2: '음성 생성 중...',
      3: '자막 생성 중 (Whisper 분석)...',
      4: '구간별 키워드 추출 및 소재 검색 중...'
    }
    setCurrentStepDescription(stepDescriptions[preparationStep as keyof typeof stepDescriptions] || '진행 중...')
  }, [preparationStep])

  // 🆕 segmentKeywords 상태 변화 추적
  useEffect(() => {
    console.log('📊 segmentKeywords 상태 업데이트:', { 
      길이: segmentKeywords.length, 
      구간들: segmentKeywords.map((seg, index) => ({
        구간번호: seg.segment_id || index,
        키워드개수: seg.keywords?.length || 0,
        키워드: seg.keywords || [],
        텍스트: seg.text?.substring(0, 50) + '...' || '없음'
      }))
    })
  }, [segmentKeywords])

  // 단계별 자동 진행 (무한 루프 방지)
  useEffect(() => {
    const executeNextStep = async () => {
      if (isStepBlocked[preparationStep]) return
      if ((retryCount[preparationStep] || 0) >= MAX_RETRIES) {
        setIsStepBlocked(prev => ({ ...prev, [preparationStep]: true }))
        setPreparationErrors(prev => ({ 
          ...prev, 
          [preparationStep]: `${preparationStep}단계에서 최대 재시도 횟수(${MAX_RETRIES})를 초과했습니다.`
        }))
        return
      }

      try {
        if (preparationStep === 2 && preparedMaterials.script && !voiceGen.isGenerating) {
          await generateVoice()
        } else if (preparationStep === 3 && preparedMaterials.audioFile && !subtitleGen.isGenerating) {
          await generateSubtitles()
        }
      } catch (error) {
        console.error(`${preparationStep}단계 실행 오류:`, error)
        setRetryCount(prev => ({ ...prev, [preparationStep]: (prev[preparationStep] || 0) + 1 }))
        setPreparationErrors(prev => ({ 
          ...prev, 
          [preparationStep]: error instanceof Error ? error.message : '단계 실행 중 오류가 발생했습니다.'
        }))
      }
    }

    executeNextStep()
  }, [preparationStep, preparedMaterials, voiceGen.isGenerating, subtitleGen.isGenerating, segmentKeywordExtraction.isExtracting])

  // 소재 준비 시작
  const prepareAllMaterials = async () => {
    setPreparationStep(1)
    setPreparationErrors({})
    setRetryCount({})
    setIsStepBlocked({})

    // 1단계: 스크립트 준비
    if (analysisMode === 'automatic') {
      // 🆕 오토매틱 모드: 자동 콘텐츠 분석
      try {
        const result = await contentArchetypeAnalysis.analyzeContentArchetype(
          {
            category: 'auto_detected',
            theme: '자동 추출된 주제',
            title: '',
            videoText: automaticInput, // 입력된 전체 텍스트 사용
            targetAudience: scriptSettings.target_audience,
            trendElements: '',
            successFactors: '',
            notes: `오토매틱 모드로 분석된 콘텐츠 (길이: ${automaticInput.length}글자)`
          },
          {
            length: scriptSettings.length,
            style: scriptSettings.style as 'informative' | 'entertaining' | 'educational' | 'dramatic' | 'conversational' | 'professional',
            tone: scriptSettings.tone,
            target_audience: scriptSettings.target_audience as 'general' | 'young_adults' | 'professionals' | 'students' | 'seniors' | 'parents',
            content_structure: scriptSettings.content_structure,
            language: scriptSettings.language
          }
        )
        
        if (result && result.script) {
          setPreparedMaterials(prev => ({ ...prev, script: result.script }))
          
          // 🆕 스크립트 분석 결과 저장
          if (result.segments && result.analysis) {
            setScriptAnalysis({
              segments: result.segments,
              analysis: result.analysis,
              compliance: result.analysis?.three_second_compliance || {},
              recommendations: result.analysis?.recommendations || []
            })
            console.log('📊 오토매틱 분석 완료:', {
              입력길이: automaticInput.length,
              구간수: result.segments?.length,
              궁금증점수: result.analysis?.curiosity_score,
              후킹강도: result.analysis?.hook_strength,
              참여도예측: result.analysis?.engagement_prediction
            })
          }
          
          setPreparationStep(2)
        }
      } catch (error) {
        console.error('오토매틱 콘텐츠 분석 오류:', error)
        setPreparationErrors({ 1: 'AI 오토매틱 분석에 실패했습니다. 다시 시도해주세요.' })
      }
    } else if (useCustomScript) {
      // 🆕 구간별 사용자 정의 스크립트 처리
      if (getAllSegmentsValid()) {
        const generatedScript = generateScriptFromSegments()
        setPreparedMaterials(prev => ({ ...prev, script: generatedScript }))
        setPreparationStep(2)
      } else {
        setPreparationErrors({ 1: '모든 구간의 스크립트를 올바르게 작성해주세요. (구간당 6-10단어)' })
        return
      }
    } else if (isContentArchetypeValid()) {
      // 🆕 콘텐츠 원형 분석 기반 스크립트 생성
      try {
        const result = await contentArchetypeAnalysis.analyzeContentArchetype(
          contentArchetype,
          {
            length: scriptSettings.length,
            style: scriptSettings.style as 'informative' | 'entertaining' | 'educational' | 'dramatic' | 'conversational' | 'professional',
            tone: scriptSettings.tone,
            target_audience: scriptSettings.target_audience as 'general' | 'young_adults' | 'professionals' | 'students' | 'seniors' | 'parents',
            content_structure: scriptSettings.content_structure,
            language: scriptSettings.language
          }
        )
        
        if (result && result.script) {
          setPreparedMaterials(prev => ({ ...prev, script: result.script }))
          
          // 🆕 스크립트 분석 결과 저장
          if (result.segments && result.analysis) {
            setScriptAnalysis({
              segments: result.segments,
              analysis: result.analysis,
              compliance: result.analysis?.three_second_compliance || {},
              recommendations: result.analysis?.recommendations || []
            })
            console.log('📊 아키타입 기반 스크립트 분석 완료:', {
              원형주제: contentArchetype.theme,
              구간수: result.segments?.length,
              준수율: result.analysis?.three_second_compliance,
              궁금증점수: result.analysis?.curiosity_score,
              원형패턴: result.archetype?.pattern
            })
          }
          
          setPreparationStep(2)
        }
      } catch (error) {
        console.error('콘텐츠 원형 분석 기반 스크립트 생성 오류:', error)
        setPreparationErrors({ 1: '콘텐츠 원형 분석에 실패했습니다.' })
      }
    } else {
      setPreparationErrors({ 1: '필수 정보를 입력해주세요.' })
    }
  }

  // 🆕 스크립트에서 실제 텍스트만 추출하는 함수
  const extractTextFromScript = (script: string) => {
    // [1구간] (0-3초): 텍스트 형태에서 텍스트만 추출
    const lines = script.split('\n').filter(line => line.trim())
    const extractedTexts = lines.map(line => {
      // 정규식으로 [구간] (시간): 부분 제거하고 텍스트만 추출
      const match = line.match(/\[.*?\]\s*\(.*?\):\s*(.+)/)
      return match ? match[1].trim() : line.trim()
    }).filter(text => text.length > 0)
    
    return extractedTexts.join(' ')
  }

  // 2단계: 음성 생성
  const generateVoice = async () => {
    // 🆕 사용자 정의 스크립트와 일반 스크립트 처리 개선
    let script = ''
    if (useCustomScript) {
      script = generateScriptFromSegments()
    } else {
      script = preparedMaterials.script
    }
    
    if (!script) return

    // 🆕 TTS용 텍스트 추출 (메타데이터 제거)
    const cleanText = extractTextFromScript(script)
    console.log('🎤 원본 스크립트:', script.substring(0, 200) + '...')
    console.log('🎤 TTS용 텍스트:', cleanText.substring(0, 200) + '...')

    try {
      const result = await voiceGen.generateVoice(cleanText, voiceSettings.actor, {
        tempo: voiceSettings.speed,
        volume: voiceSettings.volume,
        pitch: voiceSettings.pitch,
        audio_format: voiceSettings.format
      })
      
      if (result && result.audio_url) {
        setPreparedMaterials(prev => ({
          ...prev,
          audioFile: {
            url: result.audio_url,
            duration: result.duration || getDurationInSeconds(useCustomScript ? customScriptDuration : scriptSettings.length === 'short' ? 'short' : scriptSettings.length === 'medium' ? 'medium' : 'long'),
            format: result.format || 'wav'
          }
        }))
        setPreparationStep(3)
      }
    } catch (error) {
      console.error('음성 생성 오류:', error)
      throw error
    }
  }

  // 3단계: 자막 생성 (Whisper 기반)
  const generateSubtitles = async () => {
    if (!preparedMaterials.audioFile) {
      console.error('❌ 음성 파일이 없어서 자막 생성을 건너뜁니다.')
      setPreparationStep(4)
      await searchMaterials()
      return
    }

    try {
      console.log('🎤 자막 생성 시작:', {
        audioUrl: preparedMaterials.audioFile.url?.substring(0, 100) + '...',
        duration: preparedMaterials.audioFile.duration,
        format: preparedMaterials.audioFile.format
      })

      const result = await subtitleGen.generateSubtitle({
        url: preparedMaterials.audioFile.url,
        audio_data: preparedMaterials.audioFile.url?.startsWith('data:') 
          ? preparedMaterials.audioFile.url.split(',')[1] 
          : undefined
      }, {
        style: subtitleSettings.style,
        animation: subtitleSettings.animation,
        korean_optimization: true
      })

      if (result && result.subtitle_content && result.segments) {
        console.log('✅ 자막 생성 완료:', {
          segments: result.segments?.length || 0,
          transcription: result.raw_transcription?.substring(0, 100) + '...'
        })
        
        setPreparedMaterials(prev => ({
          ...prev,
          subtitleContent: result.subtitle_content,
        }))

        // 🆕 Whisper 실제 구간을 segmentKeywords에 설정
        const whisperSegments = result.segments.map((segment: any, index: number) => ({
          segment_id: index,
          text: segment.text.trim(),
          start_time: Math.round(segment.start * 100) / 100, // 소수점 2자리로 반올림
          end_time: Math.round(segment.end * 100) / 100,
          keywords: [], // 아직 키워드는 없음, 다음 단계에서 추출
          confidence: segment.avg_logprob || 0
        }))

        console.log('🔥 Whisper 실제 구간 설정:', whisperSegments.map((seg: any) => ({
          구간: seg.segment_id,
          시간: `${seg.start_time}-${seg.end_time}초`,
          텍스트: seg.text.substring(0, 30) + '...'
        })))

        setSegmentKeywords(whisperSegments)
        
        // 자막 생성 후 실제 구간 기반 소재 검색 시작
        await searchMaterialsFromWhisperSegments(whisperSegments)
        setPreparationStep(4)
      } else {
        console.warn('⚠️ 자막 생성 결과가 비어있음, 기본 구간으로 진행...')
        setPreparedMaterials(prev => ({
          ...prev,
          subtitleContent: '기본 자막 내용',
        }))
        // 기본 3초 구간으로 fallback
        await searchMaterials()
        setPreparationStep(4)
      }
    } catch (error) {
      console.error('❌ 자막 생성 오류:', error)
      console.log('🔄 자막 없이 기본 구간으로 진행합니다...')
      
      // 자막 생성 실패 시에도 다음 단계로 진행
      setPreparedMaterials(prev => ({
        ...prev,
        subtitleContent: '자막 생성 실패 - 기본 텍스트 사용',
      }))
      await searchMaterials() // 기본 3초 구간으로 fallback
      setPreparationStep(4)
    }
  }

  // 🆕 Whisper 실제 구간 기반 소재 검색
  const searchMaterialsFromWhisperSegments = async (whisperSegments: any[]) => {
    try {
      setCurrentStepDescription('Whisper 실제 구간별 키워드 추출 중...')
      console.log('🔍 Whisper 구간 기반 키워드 추출 시작:', whisperSegments.length, '개 구간')

      // 각 Whisper 구간별로 키워드 추출
      const segmentResults: { [segmentId: number]: { images: any[], videos: any[] } } = {}
      const updatedSegments = []

      for (const segment of whisperSegments) {
        console.log(`🔍 구간 ${segment.segment_id} 처리:`, {
          시간: `${segment.start_time}-${segment.end_time}초`,
          텍스트: segment.text
        })

        try {
          // 해당 구간 텍스트에서 키워드 추출 (간단한 방식)
          const keywords = await extractKeywordsFromText(segment.text)
          
          const updatedSegment = {
            ...segment,
            keywords: keywords
          }
          updatedSegments.push(updatedSegment)

          console.log(`✅ 구간 ${segment.segment_id} 키워드:`, keywords)
          
          if (keywords && keywords.length > 0) {
            // 병렬로 이미지와 비디오 검색
            const [imageResults, videoResults] = await Promise.all([
              imageSearch.searchImages(keywords[0], {
                image_aspect: imageSearchSettings.aspectRatio,
                image_size: imageSearchSettings.size === 'large' ? 'l' : imageSearchSettings.size === 'medium' ? 'm' : 'i',
                max_results: 12
              }),
              videoSearch.searchVideos(keywords, {
                orientation: videoSettings.aspect === '9:16' ? 'portrait' : 'landscape',
                perPage: 8
              })
            ])

            console.log(`✅ 구간 ${segment.segment_id} 검색 결과:`, { 
              images: imageResults?.length || 0, 
              videos: videoResults?.length || 0 
            })

            segmentResults[segment.segment_id] = {
              images: imageResults || [],
              videos: videoResults || []
            }
          } else {
            console.warn(`⚠️ 구간 ${segment.segment_id} 키워드가 비어있음`)
            segmentResults[segment.segment_id] = { images: [], videos: [] }
          }
        } catch (error) {
          console.error(`❌ 구간 ${segment.segment_id} 처리 오류:`, error)
          segmentResults[segment.segment_id] = { images: [], videos: [] }
          updatedSegments.push(segment) // 키워드 없이라도 구간은 유지
        }
      }

      // 키워드가 추출된 구간들로 업데이트
      setSegmentKeywords(updatedSegments)
      setSegmentSearchResults(segmentResults)

      console.log('✅ 모든 Whisper 구간 처리 완료:', {
        총구간: updatedSegments.length,
        키워드있는구간: updatedSegments.filter((seg: any) => seg.keywords?.length > 0).length
      })

    } catch (error) {
      console.error('❌ Whisper 구간별 소재 검색 오류:', error)
      throw error
    }
  }

  // 🆕 텍스트에서 키워드 추출하는 간단한 함수
  const extractKeywordsFromText = async (text: string): Promise<string[]> => {
    // 🔥 개선된 키워드 추출 로직 - 의미 있는 조합과 핵심 명사 우선
    
    // 1. 불용어 제거를 위한 리스트
    const stopWords = ['이', '그', '저', '것', '수', '있', '없', '때', '곳', '등', '에서', '에게', '에', '을', '를', '은', '는', '이', '가', '의', '와', '과', '으로', '로', '에서', '부터', '까지', '만', '도', '라', '이다', '하다', '되다', '있다', '없다', '같다', '다른', '새로운', '오래된', '큰', '작은', '좋은', '나쁜', '많은', '적은', '빠른', '느린', '높은', '낮은', '안', '밖', '위', '아래', '앞', '뒤', '왼쪽', '오른쪽', '여기', '저기', '어디', '언제', '누구', '무엇', '어떻게', '왜', '최근', '요즘', '지금', '현재', '과거', '미래', '오늘', '어제', '내일', '이번', '지난', '다음']
    
    // 2. 복합명사 및 의미 단위 추출 패턴
    const patterns = [
      // 브랜드명 + 제품명 패턴
      /(\w+)(폰|스마트폰|전화기|휴대폰)/g,
      /(\w+)(TV|티비|텔레비전)/g,
      /(\w+)(자동차|차량|승용차)/g,
      
      // 장르 + 분야 패턴  
      /(\w+)(영화|드라마|예능|뉴스|다큐멘터리)/g,
      /(\w+)(음악|노래|가요|팝송)/g,
      /(\w+)(게임|스포츠|운동)/g,
      
      // 전문용어 패턴
      /(\w+)(기술|테크|IT|AI|로봇)/g,
      /(\w+)(요리|음식|레시피|맛집)/g,
      /(\w+)(패션|뷰티|코스메틱)/g,
      
      // 인물 + 직업/역할 패턴
      /(\w+)(감독|배우|가수|아이돌|연예인|셀럽)/g,
      /(\w+)(의사|변호사|교수|전문가|CEO)/g,
      
      // 장소 + 특성 패턴
      /(\w+)(카페|레스토랑|매장|상점|마트)/g,
      /(\w+)(여행|관광|투어|숙소)/g
    ]
    
    // 3. 복합명사 추출
    const compoundNouns: string[] = []
    for (const pattern of patterns) {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        if (match[0] && match[0].length > 2) {
          compoundNouns.push(match[0])
        }
      }
    }
    
    // 4. 고유명사 및 브랜드명 추출 (대문자 또는 한글 2글자 이상)
    const properNouns = text.match(/[A-Z][a-zA-Z0-9]{1,}|[가-힣]{2,}(?=[\s\.,!?]|$)/g) || []
    
    // 5. 핵심 키워드 후보 생성
    const candidates = [
      ...compoundNouns,
      ...properNouns.filter(word => 
        word.length >= 2 && 
        word.length <= 8 && 
        !stopWords.includes(word) &&
        !/^[0-9]+$/.test(word) && // 숫자만 있는 것 제외
        !/^[가-힣]*[초분시간일월년]$/.test(word) // 시간 단위 제외
      )
    ]
    
    // 6. 중복 제거 및 우선순위 정렬
    const uniqueCandidates = [...new Set(candidates)]
      .sort((a, b) => {
        // 길이가 긴 것 우선 (복합명사 선호)
        if (a.length !== b.length) return b.length - a.length
        // 텍스트 내 위치가 앞쪽인 것 우선
        return text.indexOf(a) - text.indexOf(b)
      })
    
    // 7. 최종 키워드 선별 (상위 3개)
    const finalKeywords = uniqueCandidates.slice(0, 3)
    
    // 8. 빈 경우 대체 로직
    if (finalKeywords.length === 0) {
      // 명사만 추출해서 사용
      const nouns = text.match(/[가-힣]{2,}/g) || []
      const filteredNouns = nouns
        .filter(word => !stopWords.includes(word))
        .slice(0, 2)
      
      return filteredNouns.length > 0 ? filteredNouns : [text.split(' ')[0] || '키워드']
    }
    
    console.log('🔍 개선된 키워드 추출:', {
      원본텍스트: text,
      복합명사: compoundNouns,
      고유명사: properNouns.slice(0, 5),
      최종키워드: finalKeywords
    })
    
    return finalKeywords
  }

  // 4단계: 구간별 키워드 추출 및 소재 검색
  const searchMaterials = async () => {
    // 🆕 사용자 정의 스크립트와 일반 스크립트 처리 개선
    let script = ''
    let audioDuration = 0
    
    if (useCustomScript) {
      script = generateScriptFromSegments()
      audioDuration = getDurationInSeconds(customScriptDuration)
    } else {
      script = preparedMaterials.script
      audioDuration = preparedMaterials.audioFile?.duration || 30
    }
    
    if (!script) return

    try {
      // 구간별 키워드 추출
      setCurrentStepDescription('구간별 키워드 추출 중...')
      console.log('🔍 키워드 추출 시작:', { script: script.substring(0, 100) + '...', audioDuration })
      
      const keywordResult = await segmentKeywordExtraction.extractSegmentKeywords(
        script, 
        audioDuration, 
        {
          language: scriptSettings.language,
          segment_duration: 3,
          keywords_per_segment: 3,
          context_subject: useCustomScript 
            ? '사용자 정의 스크립트' 
            : contentArchetype.theme || '콘텐츠 원형 분석'
        }
      )

      console.log('🔍 키워드 추출 결과:', keywordResult)

      if (keywordResult && keywordResult.segments) {
        console.log('✅ 구간별 키워드 설정:', keywordResult.segments)
        setSegmentKeywords(keywordResult.segments)

        // 각 구간별로 소재 검색
        setCurrentStepDescription('구간별 소재 검색 중...')
        const segmentResults: { [segmentId: number]: { images: any[], videos: any[] } } = {}

        for (const segment of keywordResult.segments) {
          console.log(`🔍 구간 ${segment.segment_id} 키워드:`, segment.keywords)
          
          if (segment.keywords && segment.keywords.length > 0) {
            try {
              // 병렬로 이미지와 비디오 검색
              const [imageResults, videoResults] = await Promise.all([
                imageSearch.searchImages(segment.keywords[0], {
                  image_aspect: imageSearchSettings.aspectRatio,
                  image_size: imageSearchSettings.size === 'large' ? 'l' : imageSearchSettings.size === 'medium' ? 'm' : 'i',
                  max_results: 12
                }),
                videoSearch.searchVideos(segment.keywords, {
                  orientation: videoSettings.aspect === '9:16' ? 'portrait' : 'landscape',
                  perPage: 8
                })
              ])

              console.log(`✅ 구간 ${segment.segment_id} 검색 결과:`, { 
                images: imageResults?.length || 0, 
                videos: videoResults?.length || 0 
              })

              segmentResults[segment.segment_id] = {
                images: imageResults || [],
                videos: videoResults || []
              }
            } catch (error) {
              console.error(`❌ 구간 ${segment.segment_id} 소재 검색 오류:`, error)
              segmentResults[segment.segment_id] = { images: [], videos: [] }
            }
          } else {
            console.warn(`⚠️ 구간 ${segment.segment_id} 키워드가 비어있음`)
            segmentResults[segment.segment_id] = { images: [], videos: [] }
          }
        }

        console.log('✅ 모든 구간 검색 완료:', segmentResults)
        setSegmentSearchResults(segmentResults)
      } else {
        console.error('❌ 키워드 추출 결과가 없거나 segments가 없음:', keywordResult)
      }

    } catch (error) {
      console.error('❌ 구간별 소재 검색 오류:', error)
      throw error
    }
  }

  // 구간별 소재 선택
  const selectSegmentMaterial = (segmentId: number, type: 'image' | 'video', data: any) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [segmentId]: { type, data }
    }))
  }

  // 선택 완료 확인
  const checkSelectionComplete = () => {
    const segmentCount = segmentKeywords.length
    const selectedCount = Object.keys(selectedMaterials).length
    return selectedCount >= segmentCount
  }

  // 최종 준비 완료 처리
  const finalizeMaterials = () => {
    const finalVideoClips = segmentKeywords.map(segment => {
      const selected = selectedMaterials[segment.segment_id]
      if (selected && selected.type === 'video') {
        return selected.data
      }
      return null
    }).filter(Boolean)

    const finalImageAssets = segmentKeywords.map(segment => {
      const selected = selectedMaterials[segment.segment_id]
      if (selected && selected.type === 'image') {
        return selected.data
      }
      return null
    }).filter(Boolean)

    setPreparedMaterials(prev => ({
      ...prev,
      videoClips: finalVideoClips,
      imageAssets: finalImageAssets,
      isReady: true
    }))
  }

  // 스크립트 설정 UI의 키워드 추가/제거
  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !scriptSettings.keywords.includes(keyword.trim())) {
      setScriptSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      }))
    }
  }

  const removeKeyword = (keyword: string) => {
    setScriptSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  // 최종 영상 합성
  const composeVideo = async () => {
    if (!preparedMaterials.isReady) return

    setIsComposing(true)
    setCompositionProgress(0)

    try {
      const result = await finalComposition.composeVideo({
        taskId: Date.now().toString(),
        videoSubject: subject,
        videoScript: preparedMaterials.script,
        audioFile: preparedMaterials.audioFile!,
        videoClips: preparedMaterials.videoClips,
        imageAssets: preparedMaterials.imageAssets,
        subtitleContent: preparedMaterials.subtitleContent,
        videoSettings: {
          aspect: videoSettings.aspect,
          clipDuration: videoSettings.clipDuration,
          concatMode: 'sequential',
          transitionMode: 'fade'
        },
        subtitleSettings: {
          enabled: true,
          style: subtitleSettings.style,
          animation: subtitleSettings.animation,
          position: subtitleSettings.position,
          fontName: 'NanumGothic.ttf',
          fontSize: subtitleSettings.fontSize,
          fontColor: subtitleSettings.fontColor,
          strokeColor: '#000000',
          strokeWidth: 1.5,
          backgroundColor: subtitleSettings.backgroundColor,
          useBackground: subtitleSettings.useBackground
        },
        bgmSettings: {
          type: 'none',
          volume: 0.2
        }
      })

      if (result?.success && result.videoUrl) {
        setFinalVideoUrl(result.videoUrl)
      }
    } catch (error) {
      console.error('영상 합성 오류:', error)
    } finally {
      setIsComposing(false)
    }
  }

  // 수동 재시도
  const retryStep = (step: number) => {
    setRetryCount(prev => ({ ...prev, [step]: 0 }))
    setIsStepBlocked(prev => ({ ...prev, [step]: false }))
    setPreparationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[step]
      return newErrors
    })
    setPreparationStep(step)
  }

  // 전체 워크플로우 상태
  const isProcessing = (
    scriptGen.isLoading || 
    contentArchetypeAnalysis.isAnalyzing ||
    voiceGen.isGenerating || 
    subtitleGen.isGenerating ||
    segmentKeywordExtraction.isExtracting ||
    videoSearch.isSearching ||
    imageSearch.isSearching
  )

  const hasError = !!(
    scriptGen.error || 
    contentArchetypeAnalysis.error ||
    voiceGen.error || 
    subtitleGen.error ||
    segmentKeywordExtraction.error ||
    videoSearch.error ||
    imageSearch.error ||
    finalComposition.error
  )

  const errors = [
    scriptGen.error,
    contentArchetypeAnalysis.error,
    voiceGen.error,
    subtitleGen.error,
    segmentKeywordExtraction.error,
    videoSearch.error,
    imageSearch.error,
    finalComposition.error
  ].filter(Boolean)

  // 🆕 구간별 스크립트 처리 유틸리티 함수들
  const getSegmentCount = (duration: 'short' | 'medium' | 'long') => {
    switch (duration) {
      case 'short': return 5   // 15초
      case 'medium': return 10 // 30초  
      case 'long': return 20   // 60초
      default: return 10
    }
  }

  const getDurationInSeconds = (duration: 'short' | 'medium' | 'long') => {
    switch (duration) {
      case 'short': return 15
      case 'medium': return 30
      case 'long': return 60
      default: return 30
    }
  }

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const validateSegment = (text: string) => {
    const wordCount = countWords(text)
    return wordCount >= 6 && wordCount <= 10
  }

  const initializeCustomSegments = (duration: 'short' | 'medium' | 'long') => {
    const segmentCount = getSegmentCount(duration)
    const segments = []
    
    for (let i = 0; i < segmentCount; i++) {
      segments.push({
        segment_id: i,
        text: '',
        start_time: i * 3,
        end_time: (i + 1) * 3,
        word_count: 0,
        is_valid: false
      })
    }
    
    setCustomSegments(segments)
  }

  const updateCustomSegment = (segmentId: number, text: string) => {
    const wordCount = countWords(text)
    const isValid = validateSegment(text)
    
    setCustomSegments(prev => prev.map(segment => 
      segment.segment_id === segmentId 
        ? { ...segment, text, word_count: wordCount, is_valid: isValid }
        : segment
    ))
  }

  const generateScriptFromSegments = () => {
    return customSegments
      .map(segment => `[${segment.segment_id + 1}구간] (${segment.start_time}-${segment.end_time}초): ${segment.text}`)
      .join('\n')
  }

  const getAllSegmentsValid = () => {
    return customSegments.length > 0 && customSegments.every(segment => segment.is_valid)
  }

  // 🆕 콘텐츠 원형 정보 검증 함수
  const isContentArchetypeValid = () => {
    return contentArchetype.category.trim() !== '' && 
           contentArchetype.theme.trim() !== '' && 
           contentArchetype.videoText.trim() !== ''
  }

  // 전체 입력 검증 함수  
  const isInputValid = () => {
    if (useCustomScript) {
      return getAllSegmentsValid()
    } else {
      return isContentArchetypeValid()
    }
  }

  // 사용자 정의 스크립트 모드 토글 시 구간 초기화
  useEffect(() => {
    if (useCustomScript) {
      initializeCustomSegments(customScriptDuration)
    }
  }, [useCustomScript, customScriptDuration])

  return (
    <div className="space-y-6">
      {/* 3초 룰 헌법 기반 기본 설정 */}
      <Card className="border-gradient-to-r from-blue-200 to-purple-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wand2 className="w-6 h-6 text-blue-600" />
            3초 룰 헌법 기반 영상 제작
          </CardTitle>
          <CardDescription className="text-base">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600 border-blue-600">Claude 4 Sonnet</Badge>
                <span>뇌과학 기반 궁금증 엔진</span>
              </div>
              <div className="text-sm text-gray-600">
                매 3초마다 시청자를 사로잡는 초고성능 숏폼 영상을 생성합니다
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 🆕 모드 선택 탭 */}
          <Tabs value={analysisMode} onValueChange={(value) => setAnalysisMode(value as 'automatic' | 'advanced')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="automatic" className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                오토매틱 모드
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                고급 수동 모드
              </TabsTrigger>
            </TabsList>

            {/* 🆕 오토매틱 모드 UI (NotebookLM 스타일) */}
            <TabsContent value="automatic" className="space-y-6 mt-6">
              <div className="space-y-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                <div className="text-center">
                  <Label className="text-xl font-bold text-green-700 flex items-center justify-center gap-2 mb-2">
                    🤖 AI 오토매틱 콘텐츠 분석
                  </Label>
                  <p className="text-sm text-green-600">
                    성공한 콘텐츠의 내용을 붙여넣기만 하면 AI가 알아서 분석하고 3초 룰 스크립트를 생성합니다
                  </p>
                </div>

                {/* 간단한 텍스트 입력창 (NotebookLM 스타일) */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">
                    📄 성공 콘텐츠 내용 입력
                  </Label>
                  <Textarea
                    placeholder="여기에 분석하고 싶은 콘텐츠의 내용을 붙여넣어 주세요.&#10;&#10;예시:&#10;• 유튜브 영상의 제목과 설명&#10;• 인스타그램 릴스의 텍스트&#10;• 성공한 콘텐츠의 스크립트나 자막&#10;• 블로그 포스트 내용&#10;• 뉴스 기사 전문&#10;&#10;AI가 자동으로 내용을 분석하여 핵심 요소를 추출하고&#10;3초 룰 헌법에 맞는 새로운 스크립트를 생성합니다."
                    value={automaticInput}
                    onChange={(e) => setAutomaticInput(e.target.value)}
                    rows={12}
                    className="border-green-200 focus:border-green-400 text-base"
                  />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>💡 팁: 길수록 더 정확한 분석이 가능합니다</span>
                    <span>{automaticInput.length} 글자</span>
                  </div>
                </div>

                {/* 빠른 설정 (선택사항) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-green-200">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">🎯 영상 길이</Label>
                    <Select 
                      value={scriptSettings.length} 
                      onValueChange={(value) => setScriptSettings(prev => ({...prev, length: value as 'short' | 'medium' | 'long'}))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">15초 (빠른 임팩트)</SelectItem>
                        <SelectItem value="medium">30초 (균형잡힌)</SelectItem>
                        <SelectItem value="long">60초 (상세한)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">🎭 스타일</Label>
                    <Select 
                      value={scriptSettings.style} 
                      onValueChange={(value) => setScriptSettings(prev => ({...prev, style: value as 'informative' | 'entertaining' | 'educational' | 'dramatic' | 'conversational' | 'professional'}))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entertaining">엔터테이닝</SelectItem>
                        <SelectItem value="informative">정보전달</SelectItem>
                        <SelectItem value="dramatic">드라마틱</SelectItem>
                        <SelectItem value="educational">교육적</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">👥 타겟</Label>
                    <Select 
                      value={scriptSettings.target_audience} 
                      onValueChange={(value) => setScriptSettings(prev => ({...prev, target_audience: value as 'general' | 'young_adults' | 'professionals' | 'students' | 'seniors' | 'parents'}))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="young_adults">2030세대</SelectItem>
                        <SelectItem value="general">전연령</SelectItem>
                        <SelectItem value="professionals">직장인</SelectItem>
                        <SelectItem value="students">학생</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 오토매틱 모드 분석 시작 버튼 */}
              <Button
                onClick={prepareAllMaterials}
                disabled={automaticInput.trim().length < 50 || contentArchetypeAnalysis.isAnalyzing}
                className="w-full py-4 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
              >
                <Wand2 className="w-5 h-5 mr-3" />
                {contentArchetypeAnalysis.isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    AI가 콘텐츠를 분석하고 아키타입화하는 중...
                  </div>
                ) : automaticInput.trim().length >= 50 ? (
                  '🚀 AI 오토매틱 분석 & 소재 준비 시작'
                ) : (
                  '📝 최소 50글자 이상 입력해주세요'
                )}
              </Button>

              {/* 오토매틱 모드 설명 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2 bg-white rounded border">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">1</div>
                  <span>AI 콘텐츠 분석</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded border">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                  <span>원형 아키타입화</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded border">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</div>
                  <span>3초 룰 스크립트</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded border">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">4</div>
                  <span>자동 소재 검색</span>
                </div>
              </div>
            </TabsContent>

            {/* 🆕 고급 수동 모드 UI (기존 코드) */}
            <TabsContent value="advanced" className="space-y-6 mt-6">
              <div className="space-y-4">
                {/* 🆕 스크립트 생성 모드 선택 */}
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border-2 border-gray-100">
                  <Switch
                    id="custom-script"
                    checked={useCustomScript}
                    onCheckedChange={setUseCustomScript}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <div className="flex-1">
                    <Label htmlFor="custom-script" className="text-base font-medium cursor-pointer">
                      직접 스크립트 작성 (전문가 모드)
                    </Label>
                    <div className="text-sm text-gray-500">
                      원형 분석 대신 직접 3초 룰 헌법에 맞는 스크립트를 작성합니다
                    </div>
                  </div>
                </div>

                {useCustomScript ? (
                  // 사용자 정의 스크립트 작성 폼
                  <div className="space-y-6 p-6 bg-purple-50 rounded-lg border border-purple-200">
                    {/* 시간 선택 */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        영상 길이 선택
                      </Label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'short', label: '15초', segments: 5, description: '5개 구간' },
                          { value: 'medium', label: '30초', segments: 10, description: '10개 구간' },
                          { value: 'long', label: '60초', segments: 20, description: '20개 구간' }
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                              customScriptDuration === option.value
                                ? 'border-purple-500 bg-purple-100 ring-2 ring-purple-200'
                                : 'border-gray-200 bg-white hover:border-purple-300'
                            }`}
                            onClick={() => setCustomScriptDuration(option.value as 'short' | 'medium' | 'long')}
                          >
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                              <div className="text-xs text-gray-500 mt-1">3초씩 분할</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 구간별 입력란 */}
                    {customSegments.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Sliders className="w-5 h-5" />
                            구간별 스크립트 작성
                          </Label>
                          <div className="text-sm text-purple-600">
                            {customSegments.filter(s => s.is_valid).length} / {customSegments.length} 구간 완료
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                          {customSegments.map((segment) => (
                            <div
                              key={segment.segment_id}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                segment.is_valid
                                  ? 'border-green-200 bg-green-50'
                                  : segment.text.length > 0
                                  ? 'border-red-200 bg-red-50'
                                  : 'border-gray-200 bg-white'
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-gray-700">
                                    구간 {segment.segment_id + 1} ({segment.start_time}-{segment.end_time}초)
                                  </div>
                                  <div className={`text-xs px-2 py-1 rounded-full ${
                                    segment.is_valid
                                      ? 'bg-green-100 text-green-700'
                                      : segment.word_count > 10
                                      ? 'bg-red-100 text-red-700'
                                      : segment.word_count < 6 && segment.word_count > 0
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {segment.word_count}단어
                                  </div>
                                </div>

                                <Textarea
                                  placeholder="6-10단어로 궁금증을 유발하는 문장을 작성하세요..."
                                  value={segment.text}
                                  onChange={(e) => updateCustomSegment(segment.segment_id, e.target.value)}
                                  rows={2}
                                  className={`text-sm resize-none ${
                                    segment.is_valid
                                      ? 'border-green-300 focus:border-green-500'
                                      : segment.text.length > 0
                                      ? 'border-red-300 focus:border-red-500'
                                      : 'border-gray-300'
                                  }`}
                                />

                                {/* 피드백 메시지 */}
                                {segment.text.length > 0 && !segment.is_valid && (
                                  <div className="text-xs">
                                    {segment.word_count < 6 && (
                                      <span className="text-yellow-600">
                                        📝 {6 - segment.word_count}단어 더 필요합니다
                                      </span>
                                    )}
                                    {segment.word_count > 10 && (
                                      <span className="text-red-600">
                                        ✂️ {segment.word_count - 10}단어 줄여주세요
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 미리보기 */}
                        {getAllSegmentsValid() && (
                          <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200">
                            <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                              <Play className="w-4 h-4" />
                              스크립트 미리보기
                            </Label>
                            <div className="text-sm font-mono text-gray-700 max-h-32 overflow-y-auto bg-white p-3 rounded border">
                              {generateScriptFromSegments()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 사용자 정의 스크립트 실행 버튼 */}
                    <Button
                      onClick={prepareAllMaterials}
                      disabled={!getAllSegmentsValid() || contentArchetypeAnalysis.isAnalyzing}
                      className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                    >
                      <Sliders className="w-5 h-5 mr-3" />
                      {contentArchetypeAnalysis.isAnalyzing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          사용자 정의 스크립트 처리 중...
                        </div>
                      ) : getAllSegmentsValid() ? (
                        '🚀 사용자 정의 스크립트로 소재 준비 시작'
                      ) : (
                        `📝 ${customSegments.filter(s => !s.is_valid).length}개 구간 더 작성해주세요`
                      )}
                    </Button>
                  </div>
                ) : (
                  // 기존 콘텐츠 원형 분석 폼
                  <div className="space-y-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200">
                    <div className="text-center">
                      <Label className="text-xl font-bold text-orange-700 flex items-center justify-center gap-2 mb-2">
                        📊 성공 콘텐츠 원형 분석 (전문가 모드)
                      </Label>
                      <p className="text-sm text-orange-600">
                        성공한 콘텐츠의 구조를 상세히 분석하여 3초 룰 헌법에 맞는 새로운 스크립트를 생성합니다
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 카테고리/장르 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">📂 카테고리/장르</Label>
                        <Select 
                          value={contentArchetype.category} 
                          onValueChange={(value) => setContentArchetype(prev => ({...prev, category: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="콘텐츠 카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">교육/노하우</SelectItem>
                            <SelectItem value="entertainment">엔터테인먼트</SelectItem>
                            <SelectItem value="lifestyle">라이프스타일</SelectItem>
                            <SelectItem value="business">비즈니스/경제</SelectItem>
                            <SelectItem value="tech">기술/IT</SelectItem>
                            <SelectItem value="health">건강/의료</SelectItem>
                            <SelectItem value="travel">여행/문화</SelectItem>
                            <SelectItem value="food">음식/요리</SelectItem>
                            <SelectItem value="news">뉴스/시사</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 타겟 시청자층 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">👥 타겟 시청자층</Label>
                        <Select 
                          value={contentArchetype.targetAudience} 
                          onValueChange={(value) => setContentArchetype(prev => ({...prev, targetAudience: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="타겟 연령대 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="teens">10대 (13-19세)</SelectItem>
                            <SelectItem value="young_adults">2030 (20-30대)</SelectItem>
                            <SelectItem value="middle_aged">4050 (40-50대)</SelectItem>
                            <SelectItem value="seniors">60+ (60세 이상)</SelectItem>
                            <SelectItem value="professionals">직장인/전문직</SelectItem>
                            <SelectItem value="students">학생/수험생</SelectItem>
                            <SelectItem value="parents">부모/육아맘</SelectItem>
                            <SelectItem value="entrepreneurs">창업자/사업가</SelectItem>
                            <SelectItem value="general">전연령</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 주제/테마 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">🎯 주제/테마</Label>
                      <Input
                        placeholder="예: 집중력 향상, 투자 노하우, 다이어트 비법, 인간관계 개선 등"
                        value={contentArchetype.theme}
                        onChange={(e) => setContentArchetype(prev => ({...prev, theme: e.target.value}))}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    {/* 제목 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">📝 원본 제목 (참고용)</Label>
                      <Input
                        placeholder="성공한 콘텐츠의 제목을 입력하세요"
                        value={contentArchetype.title}
                        onChange={(e) => setContentArchetype(prev => ({...prev, title: e.target.value}))}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    {/* 영상 내 텍스트/자막 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">💬 영상 내 핵심 텍스트/자막</Label>
                      <Textarea
                        placeholder="원본 영상에서 가장 인상적이었던 문장, 자막, 텍스트를 입력하세요&#10;예: '3초 안에 집중력이 200% 향상되는 놀라운 방법'&#10;     '99%가 모르는 투자의 진실'&#10;     '하루 5분으로 인생이 바뀝니다'"
                        value={contentArchetype.videoText}
                        onChange={(e) => setContentArchetype(prev => ({...prev, videoText: e.target.value}))}
                        rows={4}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    {/* 트렌드 요소 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">🔥 트렌드 요소 (선택사항)</Label>
                      <Input
                        placeholder="예: 챗GPT, 부동산, 주식, 다이어트, K-뷰티 등"
                        value={contentArchetype.trendElements}
                        onChange={(e) => setContentArchetype(prev => ({...prev, trendElements: e.target.value}))}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    {/* 성공 요인 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">✨ 성공 요인 분석 (선택사항)</Label>
                      <Textarea
                        placeholder="이 콘텐츠가 왜 성공했다고 생각하나요?&#10;예: 구체적인 숫자 제시, 즉시 실행 가능한 팁, 반전 요소, 시의성 등"
                        value={contentArchetype.successFactors}
                        onChange={(e) => setContentArchetype(prev => ({...prev, successFactors: e.target.value}))}
                        rows={3}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    {/* 추가 메모 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">📋 추가 메모 (선택사항)</Label>
                      <Textarea
                        placeholder="기타 참고사항이나 특별히 강조하고 싶은 부분"
                        value={contentArchetype.notes}
                        onChange={(e) => setContentArchetype(prev => ({...prev, notes: e.target.value}))}
                        rows={2}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    {/* 고급 모드 실행 버튼 */}
                    <Button
                      onClick={prepareAllMaterials}
                      disabled={!isContentArchetypeValid() || contentArchetypeAnalysis.isAnalyzing}
                      className="w-full py-4 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      {contentArchetypeAnalysis.isAnalyzing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          전문가 모드 상세 분석 중...
                        </div>
                      ) : isContentArchetypeValid() ? (
                        '🔬 전문가 모드 상세 분석 & 소재 준비 시작'
                      ) : (
                        '📝 필수 정보를 입력해주세요 (카테고리, 주제, 핵심 텍스트)'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 소재 준비 상태 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            소재 준비 상태
          </CardTitle>
          <CardDescription>
            프론트엔드에서 모든 소재를 준비합니다 (20-30초 소요)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>전체 진행률</span>
              <span>{Math.round(getTotalProgress())}%</span>
            </div>
            <Progress value={getTotalProgress()} className="w-full" />
            
            {/* 현재 단계 설명 */}
            {preparationStep > 0 && (
              <div className="text-sm text-gray-600 text-center">
                {currentStepDescription}
              </div>
            )}

            {/* 🆕 생성된 음성 미리듣기 */}
            {preparedMaterials.audioFile && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-green-700 flex items-center gap-2">
                    🎤 생성된 음성
                  </Label>
                  <div className="text-xs text-green-600">
                    {preparedMaterials.audioFile.duration}초 • {preparedMaterials.audioFile.format?.toUpperCase()}
                  </div>
                </div>
                
                <audio 
                  controls 
                  className="w-full h-10"
                  src={preparedMaterials.audioFile.url}
                  preload="metadata"
                  style={{ maxHeight: '40px' }}
                >
                  <source src={preparedMaterials.audioFile.url} type={`audio/${preparedMaterials.audioFile.format}`} />
                  브라우저가 오디오를 지원하지 않습니다.
                </audio>
                
                <div className="flex justify-between items-center mt-2 text-xs text-green-600">
                  <span>✅ TTS 음성 생성 완료</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs border-green-300 text-green-700 hover:bg-green-100"
                    onClick={() => {
                      const audio = new Audio(preparedMaterials.audioFile!.url)
                      audio.play().catch(console.error)
                    }}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    재생
                  </Button>
                </div>
              </div>
            )}

            {/* 🆕 생성된 스크립트 미리보기 */}
            {preparedMaterials.script && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-2">
                  📝 생성된 스크립트
                </Label>
                <div className="text-sm text-gray-700 max-h-24 overflow-y-auto bg-white p-3 rounded border font-mono">
                  {preparedMaterials.script}
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  ✅ {analysisMode === 'automatic' ? 'AI 오토매틱' : '고급 모드'} 스크립트 생성 완료
                </div>
              </div>
            )}
            
            {/* 에러 표시 */}
            {Object.keys(preparationErrors).length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="space-y-2">
                    {Object.entries(preparationErrors).map(([step, error]) => (
                      <div key={step} className="flex justify-between items-center">
                        <span>{error}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryStep(parseInt(step))}
                          className="ml-2"
                        >
                          재시도
                        </Button>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {/* 단계별 상태 */}
            <div className="space-y-2">
              {[
                { step: 1, name: '스크립트 생성', icon: '📝' },
                { step: 2, name: '음성 생성', icon: '🎤' },
                { step: 3, name: '자막 생성 (Whisper)', icon: '💬' },
                { step: 4, name: '구간별 키워드 추출 및 소재 검색', icon: '🔍' },
                { step: 5, name: '완료', icon: '✅' }
              ].map((item) => (
                <div key={item.step} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className={preparationStep >= item.step ? 'text-green-600' : 'text-gray-500'}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {preparationStep > item.step && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {preparationStep === item.step && <Clock className="w-4 h-4 text-blue-600 animate-spin" />}
                    {preparationErrors[item.step] && <AlertCircle className="w-4 h-4 text-red-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🆕 새로운 소재 선택 UI (목업 기반) */}
      {preparationStep >= 4 && segmentKeywords.length > 0 && Object.keys(segmentSearchResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              구간별 소재 선택 및 미리보기
            </CardTitle>
            <CardDescription>
              각 구간에 어울리는 소재를 선택하고 실시간으로 미리보기를 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 왼쪽: 소재 선택 영역 */}
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* 구간 선택 버튼들 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">구간 선택</Label>
                    <div className="flex flex-wrap gap-2">
                      {segmentKeywords.map((segment) => (
                        <Button
                          key={segment.segment_id}
                          variant={selectedSegmentForMaterial === segment.segment_id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSegmentForMaterial(segment.segment_id)}
                          className="relative"
                        >
                          {segment.segment_id + 1}구간
                          {selectedMaterials[segment.segment_id] && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 선택된 구간 정보 */}
                  {segmentKeywords[selectedSegmentForMaterial] && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {selectedSegmentForMaterial + 1}구간 ({segmentKeywords[selectedSegmentForMaterial].start_time}초 - {segmentKeywords[selectedSegmentForMaterial].end_time}초)
                        </h4>
                        {selectedMaterials[selectedSegmentForMaterial] && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            선택됨
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="mb-1">
                          <strong>텍스트:</strong> "{segmentKeywords[selectedSegmentForMaterial].text || '텍스트 없음'}"
                        </div>
                        <div>
                          <strong>키워드:</strong> {segmentKeywords[selectedSegmentForMaterial].keywords?.join(', ') || '키워드 없음'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 소재 선택 탭 */}
                  {segmentSearchResults[selectedSegmentForMaterial] && (
                    <Tabs defaultValue="images" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="images">
                          이미지 ({segmentSearchResults[selectedSegmentForMaterial].images.length})
                        </TabsTrigger>
                        <TabsTrigger value="videos">
                          비디오 ({segmentSearchResults[selectedSegmentForMaterial].videos.length})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="images" className="mt-4">
                        <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                          {segmentSearchResults[selectedSegmentForMaterial].images.slice(0, 12).map((image, imageIndex) => (
                            <div
                              key={imageIndex}
                              className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                                selectedMaterials[selectedSegmentForMaterial]?.type === 'image' && 
                                selectedMaterials[selectedSegmentForMaterial]?.data?.id === image.id
                                  ? 'border-blue-500 ring-2 ring-blue-200'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                              onClick={() => selectSegmentMaterial(selectedSegmentForMaterial, 'image', image)}
                            >
                              <img
                                src={image.thumbnail_url || image.url}
                                alt={image.title || '이미지'}
                                className="w-full h-16 object-cover"
                              />
                              {selectedMaterials[selectedSegmentForMaterial]?.type === 'image' && 
                               selectedMaterials[selectedSegmentForMaterial]?.data?.id === image.id && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-blue-500" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="videos" className="mt-4">
                        <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                          {segmentSearchResults[selectedSegmentForMaterial].videos.slice(0, 9).map((video, videoIndex) => (
                            <div
                              key={videoIndex}
                              className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                                selectedMaterials[selectedSegmentForMaterial]?.type === 'video' && 
                                selectedMaterials[selectedSegmentForMaterial]?.data?.id === video.id
                                  ? 'border-blue-500 ring-2 ring-blue-200'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                              onClick={() => selectSegmentMaterial(selectedSegmentForMaterial, 'video', video)}
                            >
                              <img
                                src={video.thumbnail}
                                alt="비디오 썸네일"
                                className="w-full h-20 object-cover"
                              />
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                {Math.round(video.duration)}s
                              </div>
                              {selectedMaterials[selectedSegmentForMaterial]?.type === 'video' && 
                               selectedMaterials[selectedSegmentForMaterial]?.data?.id === video.id && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-blue-500" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </div>

              {/* 오른쪽: 스마트폰 미리보기 */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* 스마트폰 프레임 */}
                  <div className="w-64 h-[480px] bg-black rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                      
                      {/* 스마트폰 상단 노치 */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                      
                      {/* 영상 컨텐츠 영역 */}
                      <div className="w-full h-full bg-gray-900 relative">
                        
                        {/* 📱 보호 영역 정의 - 침범 불가 구역 */}
                        {/* 1. 상단 썸네일 텍스트 보호 영역 (첫 구간용) */}
                        <div className="absolute top-6 left-0 right-0 h-24 pointer-events-none z-40 bg-gradient-to-b from-black/80 via-black/60 to-transparent">
                          {/* 썸네일 텍스트 영역 표시 (개발 시각화용) - 제거 */}
                        </div>
                        
                        {/* 2. 하단 자막 보호 영역 */}
                        <div className="absolute bottom-12 left-0 right-0 h-20 pointer-events-none z-40 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                          {/* 자막 영역 표시 (개발 시각화용) - 제거 */}
                        </div>
                        
                        {/* 현재 선택된 구간만 풀스크린으로 표시 */}
                        {segmentKeywords[selectedSegmentForMaterial] && (
                          <div className="absolute inset-0">
                            {(() => {
                              const segment = segmentKeywords[selectedSegmentForMaterial]
                              const material = selectedMaterials[segment.segment_id]
                              
                              return (
                                <div className="w-full h-full relative group">
                                  {/* 첫 번째 구간인 경우 상단 썸네일 텍스트 (보호구역 내) */}
                                  {segment.segment_id === 0 && (
                                    <div className="absolute top-8 left-4 right-4 h-16 bg-black bg-opacity-90 flex items-center justify-center px-4 z-50 rounded-lg">
                                      <div className="text-white text-sm font-bold text-center leading-tight">
                                        {segment.text || '첫 번째 구간 텍스트'}
                                      </div>
                                    </div>
                                  )}

                                  {/* 🔥 배경 이미지/비디오 - 보호구역 회피 */}
                                  {material ? (
                                    <div className="absolute inset-0 overflow-hidden">
                                      {/* 실제 소재 이미지/비디오 컨테이너 - 보호구역 고려 */}
                                      <div 
                                        className="w-full h-full"
                                        style={{
                                          // 보호구역을 피해서 중앙 영역에만 배치
                                          paddingTop: segment.segment_id === 0 ? '96px' : '32px', // 썸네일 텍스트 영역 회피
                                          paddingBottom: '80px', // 자막 영역 회피
                                          paddingLeft: '8px',
                                          paddingRight: '8px'
                                        }}
                                      >
                                        {material.type === 'image' ? (
                                          <img
                                            src={material.data.thumbnail_url || material.data.url}
                                            alt={`${segment.segment_id + 1}구간 이미지`}
                                            className="w-full h-full object-cover rounded-lg"
                                            style={{
                                              // 정방형 이미지를 세로형 화면에 최적화
                                              objectPosition: 'center center',
                                              aspectRatio: '1:1',
                                              maxHeight: '100%',
                                              margin: '0 auto'
                                            }}
                                          />
                                        ) : (
                                          <img
                                            src={material.data.thumbnail}
                                            alt={`${segment.segment_id + 1}구간 비디오`}
                                            className="w-full h-full object-cover rounded-lg"
                                            style={{
                                              objectPosition: 'center center'
                                            }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div 
                                      className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative"
                                      style={{
                                        paddingTop: segment.segment_id === 0 ? '96px' : '32px',
                                        paddingBottom: '80px'
                                      }}
                                    >
                                      <div className="text-white text-center px-4 z-10">
                                        <div className="text-2xl font-bold mb-4">{segment.segment_id + 1}구간</div>
                                        <div className="text-gray-300 mb-4">소재를 선택하세요</div>
                                        {segment.text && (
                                          <div className="text-gray-100 text-sm leading-relaxed font-medium mb-4 max-w-xs">
                                            "{segment.text}"
                                          </div>
                                        )}
                                        {segment.keywords && segment.keywords.length > 0 && (
                                          <div className="text-blue-200 text-sm">
                                            🏷️ {segment.keywords.join(' • ')}
                                          </div>
                                        )}
                                      </div>
                                      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-blue-600 to-purple-600"></div>
                                    </div>
                                  )}

                                  {/* 소재가 있는 경우 하단 텍스트 오버레이 - 제거하여 자막과 중복 방지 */}
                                  {/* 기존 하단 텍스트 오버레이는 자막 영역과 중복되므로 제거함 */}

                                  {/* 구간 정보 라벨 - 좌상단 (최소화) */}
                                  <div className="absolute top-2 left-2 z-20">
                                    <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                      {segment.segment_id + 1}구간
                                    </div>
                                  </div>

                                  {/* 선택된 소재 표시 - 우상단 (최소화) */}
                                  {material && (
                                    <div className="absolute top-2 right-2 z-20">
                                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>{material.type === 'image' ? '이미지' : '비디오'}</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* 구간 네비게이션 - 우하단 */}
                                  <div className="absolute bottom-24 right-4 z-20">
                                    <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                      {selectedSegmentForMaterial + 1} / {segmentKeywords.length}
                                    </div>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        )}

                        {/* 자막 영역 - 실제 구간 텍스트 표시 (보호구역 내 배치) */}
                        <div className="absolute bottom-20 left-4 right-4 min-h-12 bg-black bg-opacity-70 rounded flex items-center justify-center p-3 z-50">
                          {segmentKeywords[selectedSegmentForMaterial] ? (
                            <div className="text-white text-center">
                              <div className="text-sm leading-relaxed">
                                "{segmentKeywords[selectedSegmentForMaterial].text || '자막이 여기에 표시됩니다'}"
                              </div>
                              {segmentKeywords[selectedSegmentForMaterial].keywords && segmentKeywords[selectedSegmentForMaterial].keywords.length > 0 && (
                                <div className="text-blue-300 text-xs mt-1">
                                  🏷️ {segmentKeywords[selectedSegmentForMaterial].keywords.slice(0, 2).join(' • ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-white text-xs text-center">
                              <div className="font-medium">자막 영역</div>
                              <div className="text-gray-300">실시간 자막이 여기에 표시됩니다</div>
                            </div>
                          )}
                        </div>

                        {/* 채널명 영역 */}
                        {userInfo?.channelName && (
                          <div className="absolute bottom-4 left-4 right-4 h-8 bg-white bg-opacity-90 rounded flex items-center justify-center">
                            <div className="text-black text-sm font-medium">
                              {userInfo.channelName}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 미리보기 라벨 */}
                  <div className="absolute -bottom-8 left-0 right-0 text-center">
                    <div className="text-sm text-gray-500">실시간 미리보기</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 진행률 및 완료 버튼 */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  진행률: {Object.keys(selectedMaterials).length} / {segmentKeywords.length} 구간 완료
                </div>
                <div className="text-sm text-gray-500">
                  총 영상 길이: {segmentKeywords.length > 0 && segmentKeywords[segmentKeywords.length - 1] ? segmentKeywords[segmentKeywords.length - 1].end_time : 0}초
                </div>
              </div>
              
              <Progress 
                value={(Object.keys(selectedMaterials).length / segmentKeywords.length) * 100} 
                className="mb-4" 
              />
              
              <Button
                onClick={finalizeMaterials}
                disabled={!checkSelectionComplete()}
                className="w-full py-3 text-lg"
                size="lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {checkSelectionComplete() 
                  ? '🎬 소재 선택 완료 - 최종 합성 준비' 
                  : `아직 ${segmentKeywords.length - Object.keys(selectedMaterials).length}개 구간이 남았습니다`
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최종 영상 합성 */}
      {preparedMaterials.isReady && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              백엔드 최종 합성
            </CardTitle>
            <CardDescription>
              준비된 소재로 최종 영상을 합성합니다 (30초 소요)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!finalVideoUrl && (
              <Button
                onClick={composeVideo}
                disabled={isComposing}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {isComposing ? '영상 합성 중...' : '최종 영상 합성 시작'}
              </Button>
            )}

            {isComposing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>합성 진행률</span>
                  <span>{finalComposition.progress}%</span>
                </div>
                <Progress value={finalComposition.progress} className="w-full" />
                <div className="text-sm text-gray-600 text-center">
                  {finalComposition.currentStep}
                </div>
              </div>
            )}

            {finalVideoUrl && (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    영상 합성이 완료되었습니다!
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a href={finalVideoUrl} download>
                      <Download className="w-4 h-4 mr-2" />
                      영상 다운로드
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    미리보기
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default HybridWorkflow 