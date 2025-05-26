'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Play, Sparkles, Settings, Volume2, Zap, Music2, Info, Download, RefreshCw } from 'lucide-react'
import { 
  TypecastActor, 
  TypecastActorVersion, 
  TypecastVoiceRequest,
  TYPECAST_LANGUAGES,
  TYPECAST_AUDIO_FORMATS 
} from './types'

interface TypecastVoiceSettingsProps {
  typecastActors: TypecastActor[]
  selectedTypecastActor: string
  onActorChange: (actorId: string) => void
  generatedVoiceUrl: string | null
  isGeneratingVoice: boolean
  onGenerateVoice: () => Promise<void>
  hasScript: boolean
  scriptText?: string
}

export default function TypecastVoiceSettings({
  typecastActors,
  selectedTypecastActor,
  onActorChange,
  generatedVoiceUrl,
  isGeneratingVoice,
  onGenerateVoice,
  hasScript,
  scriptText = ''
}: TypecastVoiceSettingsProps) {
  // 기본 설정
  const [language, setLanguage] = useState('auto')
  const [audioFormat, setAudioFormat] = useState<'wav' | 'mp3'>('wav')
  const [highQuality, setHighQuality] = useState(true)
  const [modelVersion, setModelVersion] = useState('latest')
  
  // 음성 조절 설정
  const [volume, setVolume] = useState(100)
  const [speedX, setSpeedX] = useState(1.0)
  const [tempo, setTempo] = useState(1.0)
  const [pitch, setPitch] = useState(0)
  const [lastPitch, setLastPitch] = useState(0)
  
  // 길이 제한 설정
  const [maxSeconds, setMaxSeconds] = useState(30)
  const [useDuration, setUseDuration] = useState(false)
  const [duration, setDuration] = useState(10)
  
  // 감정 설정
  const [emotionPreset, setEmotionPreset] = useState('')
  const [useCustomEmotion, setUseCustomEmotion] = useState(false)
  const [customEmotion, setCustomEmotion] = useState('')
  
  // 액터 버전 정보
  const [actorVersions, setActorVersions] = useState<TypecastActorVersion[]>([])
  const [availableEmotions, setAvailableEmotions] = useState<string[]>([])
  const [emotionPromptEnabled, setEmotionPromptEnabled] = useState(false)
  
  // 미리보기 텍스트
  const [previewText, setPreviewText] = useState('')
  
  // 로컬 음성 URL 상태
  const [localVoiceUrl, setLocalVoiceUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // 선택된 액터의 버전 정보 로드
  useEffect(() => {
    if (selectedTypecastActor && selectedTypecastActor !== 'loading') {
      loadActorVersions(selectedTypecastActor)
    }
  }, [selectedTypecastActor])

  // 스크립트가 있으면 미리보기 텍스트로 설정
  useEffect(() => {
    if (scriptText && !previewText) {
      setPreviewText(scriptText.slice(0, 350)) // TypeCast 최대 길이 제한
    }
  }, [scriptText, previewText])

  // 부모에서 전달받은 음성 URL 업데이트
  useEffect(() => {
    if (generatedVoiceUrl) {
      setLocalVoiceUrl(generatedVoiceUrl)
    }
  }, [generatedVoiceUrl])

  const loadActorVersions = async (actorId: string) => {
    try {
      const response = await fetch(`/api/typecast-actor-versions?actorId=${actorId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.versions) {
          setActorVersions(result.versions)
          
          // 최신 버전의 감정 정보 설정
          const latestVersion = result.versions.find((v: TypecastActorVersion) => 
            v.aliases.includes('latest')
          ) || result.versions[result.versions.length - 1]
          
          if (latestVersion) {
            setAvailableEmotions(latestVersion.emotion_tone_presets || [])
            setEmotionPromptEnabled(latestVersion.emotion_prompt || false)
            setEmotionPreset(latestVersion.emotion_tone_presets?.[0] || '')
          }
        }
      }
    } catch (error) {
      console.error('액터 버전 정보 로드 실패:', error)
    }
  }

  const generateAdvancedVoice = async () => {
    if (!previewText.trim() || !selectedTypecastActor) {
      return
    }

    try {
      const requestData: TypecastVoiceRequest = {
        text: previewText.trim(),
        tts_mode: 'actor',
        actor_id: selectedTypecastActor,
        lang: language,
        xapi_hd: highQuality,
        xapi_audio_format: audioFormat,
        model_version: modelVersion,
        volume: volume,
        speed_x: speedX,
        tempo: tempo,
        pitch: pitch,
        max_seconds: maxSeconds,
        last_pitch: lastPitch
      }

      // 감정 설정 추가
      if (useCustomEmotion && customEmotion.trim() && emotionPromptEnabled) {
        requestData.emotion_tone_preset = 'emotion-prompt'
        requestData.emotion_prompt = customEmotion.trim()
      } else if (emotionPreset) {
        requestData.emotion_tone_preset = emotionPreset
      }

      // 고정 길이 설정
      if (useDuration) {
        requestData.duration = duration
      }

      console.log('고급 TypeCast 요청:', requestData)

      const response = await fetch('/api/generate-typecast-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const result = await response.json()
      if (result.success && result.audio_url) {
        setLocalVoiceUrl(result.audio_url)
        console.log('TypeCast 음성 생성 성공:', result.message)
      } else {
        throw new Error(result.error || 'TypeCast 음성 생성에 실패했습니다')
      }
    } catch (error) {
      console.error('TypeCast 고급 음성 생성 오류:', error)
      throw error
    }
  }

  const handlePlayPause = () => {
    const audioElement = document.getElementById('typecast-audio') as HTMLAudioElement
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause()
        setIsPlaying(false)
      } else {
        audioElement.play()
        setIsPlaying(true)
      }
    }
  }

  const handleDownload = () => {
    if (localVoiceUrl) {
      const link = document.createElement('a')
      link.href = localVoiceUrl
      link.download = `typecast-voice-${Date.now()}.${audioFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const selectedActor = typecastActors.find(actor => actor.actor_id === selectedTypecastActor)

  return (
    <div className="space-y-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
      <div className="flex items-center gap-2 text-sm text-primary">
        <Sparkles className="h-4 w-4" />
        <span className="font-medium">TypeCast AI - 프리미엄 음성 합성</span>
      </div>
      
      {/* 액터 선택 */}
      <div className="space-y-2">
        <Label>TypeCast 액터 선택</Label>
        <Select value={selectedTypecastActor} onValueChange={onActorChange}>
          <SelectTrigger>
            <SelectValue placeholder="고품질 AI 목소리를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {typecastActors.length === 0 ? (
              <SelectItem value="loading" disabled>액터 목록을 불러오는 중...</SelectItem>
            ) : (
              typecastActors.map((actor) => (
                <SelectItem key={actor.actor_id} value={actor.actor_id}>
                  {actor.name.ko || actor.name.en} ({actor.name.en})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        {selectedActor && (
          <div className="text-xs text-muted-foreground">
            선택된 액터: {selectedActor.name.ko || selectedActor.name.en}
          </div>
        )}
      </div>

      {selectedTypecastActor && selectedTypecastActor !== 'loading' && (
        <>
          <Separator />
          
          {/* 미리보기 텍스트 */}
          <div className="space-y-2">
            <Label>음성 생성 텍스트 (최대 350자)</Label>
            <Textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value.slice(0, 350))}
              placeholder="음성으로 변환할 텍스트를 입력하세요..."
              rows={3}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {previewText.length}/350자
            </div>
          </div>

          {/* 기본 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <Label className="text-sm font-medium">기본 설정</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">언어</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPECAST_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">오디오 포맷</Label>
                <Select value={audioFormat} onValueChange={(value: 'wav' | 'mp3') => setAudioFormat(value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPECAST_AUDIO_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">모델 버전</Label>
                <Select value={modelVersion} onValueChange={setModelVersion}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신 (권장)</SelectItem>
                    <SelectItem value="first">첫 번째</SelectItem>
                    {actorVersions.map((version) => (
                      <SelectItem key={version.name} value={version.name}>
                        {version.display_name} ({version.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="high-quality"
                checked={highQuality}
                onCheckedChange={(checked) => setHighQuality(checked === true)}
              />
              <Label htmlFor="high-quality" className="text-xs">
                고품질 오디오 (44.1 KHz)
              </Label>
            </div>
          </div>

          {/* 음성 조절 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Label className="text-sm font-medium">음성 조절</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">볼륨: {volume}%</Label>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  min={50}
                  max={200}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">말하기 속도: {speedX}x</Label>
                <Slider
                  value={[speedX]}
                  onValueChange={(value) => setSpeedX(value[0])}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">재생 속도: {tempo}x</Label>
                <Slider
                  value={[tempo]}
                  onValueChange={(value) => setTempo(value[0])}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">피치: {pitch > 0 ? '+' : ''}{pitch}</Label>
                <Slider
                  value={[pitch]}
                  onValueChange={(value) => setPitch(value[0])}
                  min={-12}
                  max={12}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">문장 끝 피치</Label>
              <Select value={lastPitch.toString()} onValueChange={(value) => setLastPitch(parseInt(value))}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-2">가장 낮음</SelectItem>
                  <SelectItem value="-1">낮음</SelectItem>
                  <SelectItem value="0">보통</SelectItem>
                  <SelectItem value="1">높음</SelectItem>
                  <SelectItem value="2">가장 높음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 감정 설정 */}
          {availableEmotions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music2 className="h-4 w-4" />
                <Label className="text-sm font-medium">감정 설정</Label>
              </div>
              
              {emotionPromptEnabled && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="custom-emotion"
                    checked={useCustomEmotion}
                    onCheckedChange={(checked) => setUseCustomEmotion(checked === true)}
                  />
                  <Label htmlFor="custom-emotion" className="text-xs">
                    사용자 정의 감정 사용
                  </Label>
                </div>
              )}

              {useCustomEmotion && emotionPromptEnabled ? (
                <div className="space-y-2">
                  <Label className="text-xs">사용자 정의 감정 (한국어 또는 영어)</Label>
                  <Input
                    value={customEmotion}
                    onChange={(e) => setCustomEmotion(e.target.value)}
                    placeholder="예: 기쁘고 활기찬, happy and energetic"
                    className="h-8"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-xs">감정 프리셋</Label>
                  <Select value={emotionPreset} onValueChange={setEmotionPreset}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="감정을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEmotions.map((emotion) => (
                        <SelectItem key={emotion} value={emotion}>
                          {emotion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* 길이 제한 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <Label className="text-sm font-medium">길이 설정</Label>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">최대 길이: {maxSeconds}초</Label>
              <Slider
                value={[maxSeconds]}
                onValueChange={(value) => setMaxSeconds(value[0])}
                min={1}
                max={60}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="use-duration"
                checked={useDuration}
                onCheckedChange={(checked) => setUseDuration(checked === true)}
              />
              <Label htmlFor="use-duration" className="text-xs">
                고정 길이 사용
              </Label>
            </div>

            {useDuration && (
              <div className="space-y-2">
                <Label className="text-xs">고정 길이: {duration}초</Label>
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={1}
                  max={60}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* 음성 생성 및 미리보기 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">음성 미리보기</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateAdvancedVoice}
                  disabled={isGeneratingVoice || !previewText.trim()}
                >
                  {isGeneratingVoice ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      고급 음성 생성
                    </>
                  )}
                </Button>
                
                {/* 기본 음성 생성 버튼 (부모 컴포넌트 함수 호출) */}
                <Button
                  size="sm"
                  onClick={onGenerateVoice}
                  disabled={isGeneratingVoice || !previewText.trim()}
                >
                  {isGeneratingVoice ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-3 w-3" />
                      기본 음성 생성
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* 음성 플레이어 */}
            {localVoiceUrl && (
              <div className="p-4 bg-background border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">생성된 음성</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3" />
                          일시정지
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-3 w-3" />
                          재생
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      다운로드
                    </Button>
                  </div>
                </div>
                
                <audio 
                  id="typecast-audio"
                  controls 
                  className="w-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={localVoiceUrl} type={`audio/${audioFormat}`} />
                  Your browser does not support the audio element.
                </audio>
                
                <div className="text-xs text-muted-foreground">
                  포맷: {audioFormat.toUpperCase()} | 품질: {highQuality ? '44.1 KHz' : '16 KHz'}
                </div>
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                TypeCast AI는 최대 350자까지 지원하며, 고품질 음성 합성을 제공합니다. 
                감정 설정과 음성 조절을 통해 더욱 자연스러운 음성을 생성할 수 있습니다.
                <br />
                <strong>고급 음성 생성</strong>: 현재 설정된 모든 옵션 적용 | <strong>기본 음성 생성</strong>: 기본 설정으로 빠른 생성
              </AlertDescription>
            </Alert>
          </div>
        </>
      )}
    </div>
  )
} 