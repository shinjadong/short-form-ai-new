'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Video, 
  Play, 
  Pause,
  Download,
  Settings,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Volume2,
  Music,
  Layers
} from 'lucide-react'

interface VideoCompositionPanelProps {
  isComposing: boolean
  progress: number
  currentStep?: string
  finalVideoUrl?: string | null
  taskId?: string | null
  estimatedDuration?: number
  onCompose: () => void
  onDownload?: (url: string) => void
  onRetry?: () => void
  preparedMaterials?: {
    script: string
    audioFile: any
    videoClips: any[]
    imageAssets: any[]
    subtitleContent: string
    segmentKeywords: any[]
    selectedMaterials: any
  }
  settings?: {
    bgmVolume?: number
    transitionEffect?: string
    watermark?: boolean
    outputQuality?: 'high' | 'medium' | 'low'
  }
  onSettingsChange?: (settings: any) => void
  disabled?: boolean
}

const VideoCompositionPanel: React.FC<VideoCompositionPanelProps> = ({
  isComposing,
  progress,
  currentStep,
  finalVideoUrl,
  taskId,
  estimatedDuration = 30,
  onCompose,
  onDownload,
  onRetry,
  preparedMaterials,
  settings = {
    bgmVolume: 20,
    transitionEffect: 'fade',
    watermark: false,
    outputQuality: 'high'
  },
  onSettingsChange,
  disabled = false
}) => {
  const [showSettings, setShowSettings] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  // 경과 시간 추적
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isComposing) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    } else {
      setElapsedTime(0)
    }
    return () => clearInterval(interval)
  }, [isComposing])

  // 설정 변경 핸들러
  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 예상 남은 시간 계산
  const estimatedRemainingTime = Math.max(0, Math.round((estimatedDuration * (100 - progress) / 100)))

  // 소재 준비 상태 확인
  const isMaterialsReady = preparedMaterials && 
    preparedMaterials.script && 
    preparedMaterials.audioFile && 
    preparedMaterials.videoClips.length > 0 &&
    Object.keys(preparedMaterials.selectedMaterials).length > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="w-5 h-5 text-green-600" />
              최종 비디오 합성
            </CardTitle>
            <CardDescription>
              준비된 소재들을 합성하여 최종 비디오를 생성합니다
            </CardDescription>
          </div>
          {!finalVideoUrl && !isComposing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              disabled={disabled}
            >
              <Settings className="w-4 h-4" />
              설정
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 소재 준비 상태 */}
        {!finalVideoUrl && !isComposing && preparedMaterials && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
            <div className="text-center">
              <div className={`text-2xl font-bold ${preparedMaterials.script ? 'text-green-600' : 'text-gray-400'}`}>
                {preparedMaterials.script ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600 mt-1">스크립트</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${preparedMaterials.audioFile ? 'text-green-600' : 'text-gray-400'}`}>
                {preparedMaterials.audioFile ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600 mt-1">음성</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {preparedMaterials.videoClips.length + preparedMaterials.imageAssets.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">소재</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${preparedMaterials.subtitleContent ? 'text-green-600' : 'text-gray-400'}`}>
                {preparedMaterials.subtitleContent ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600 mt-1">자막</div>
            </div>
          </div>
        )}

        {/* 합성 설정 (토글 가능) */}
        {showSettings && !finalVideoUrl && !isComposing && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              합성 설정
            </h4>

            {/* BGM 볼륨 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  BGM 볼륨
                </Label>
                <span className="text-sm text-gray-600">{localSettings.bgmVolume}%</span>
              </div>
              <Slider
                value={[localSettings.bgmVolume || 20]}
                onValueChange={([value]) => handleSettingChange('bgmVolume', value)}
                min={0}
                max={100}
                step={5}
                disabled={disabled}
              />
            </div>

            {/* 전환 효과 */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4" />
                전환 효과
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {['fade', 'slide', 'zoom'].map((effect) => (
                  <Button
                    key={effect}
                    variant={localSettings.transitionEffect === effect ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSettingChange('transitionEffect', effect)}
                    disabled={disabled}
                  >
                    {effect === 'fade' ? '페이드' : effect === 'slide' ? '슬라이드' : '줌'}
                  </Button>
                ))}
              </div>
            </div>

            {/* 워터마크 */}
            <div className="flex items-center justify-between">
              <Label htmlFor="watermark" className="text-sm">워터마크 추가</Label>
              <Switch
                id="watermark"
                checked={localSettings.watermark}
                onCheckedChange={(checked) => handleSettingChange('watermark', checked)}
                disabled={disabled}
              />
            </div>

            {/* 출력 품질 */}
            <div className="space-y-2">
              <Label className="text-sm">출력 품질</Label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((quality) => (
                  <Button
                    key={quality}
                    variant={localSettings.outputQuality === quality ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSettingChange('outputQuality', quality)}
                    disabled={disabled}
                  >
                    {quality === 'high' ? '고품질' : quality === 'medium' ? '중간' : '저품질'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 합성 진행 상태 */}
        {isComposing && (
          <div className="space-y-4">
            {/* 진행률 바 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">합성 진행률</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* 현재 단계 */}
            {currentStep && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-800">{currentStep}</span>
              </div>
            )}

            {/* 시간 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                <div className="text-sm text-gray-600">경과 시간</div>
                <div className="font-medium">{formatTime(elapsedTime)}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                <div className="text-sm text-gray-600">예상 남은 시간</div>
                <div className="font-medium">{formatTime(estimatedRemainingTime)}</div>
              </div>
            </div>

            {/* 작업 ID */}
            {taskId && (
              <div className="text-xs text-gray-500 text-center">
                작업 ID: {taskId}
              </div>
            )}
          </div>
        )}

        {/* 완료된 비디오 */}
        {finalVideoUrl && (
          <div className="space-y-4">
            {/* 성공 메시지 */}
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                비디오 생성이 완료되었습니다! 아래에서 미리보기하거나 다운로드할 수 있습니다.
              </AlertDescription>
            </Alert>

            {/* 비디오 플레이어 */}
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                src={finalVideoUrl}
                controls
                className="w-full"
                style={{ maxHeight: '400px' }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* 비디오 정보 */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600">영상 길이</div>
                <div className="font-medium">{formatTime(estimatedDuration)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">화면 비율</div>
                <div className="font-medium">9:16</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">품질</div>
                <div className="font-medium">{localSettings.outputQuality === 'high' ? '1080p' : '720p'}</div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <Button
                onClick={() => onDownload?.(finalVideoUrl)}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
              <Button
                variant="outline"
                onClick={onRetry}
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                새로 만들기
              </Button>
            </div>
          </div>
        )}

        {/* 생성 버튼 */}
        {!finalVideoUrl && !isComposing && (
          <Button
            onClick={onCompose}
            disabled={!isMaterialsReady || disabled}
            className="w-full py-4 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            {!isMaterialsReady ? (
              <>
                <AlertCircle className="w-5 h-5 mr-2" />
                소재 준비가 필요합니다
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                최종 비디오 생성
              </>
            )}
          </Button>
        )}

        {/* 재시도 버튼 (합성 중) */}
        {isComposing && progress < 100 && (
          <div className="text-center text-sm text-gray-500">
            비디오 합성이 진행 중입니다. 잠시만 기다려주세요...
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VideoCompositionPanel
