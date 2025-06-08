'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IVideoSettings } from '@/types/video-generation'
import { Video, Maximize2, Clock, Film, Sparkles } from 'lucide-react'

interface VideoSettingsFormProps {
  settings: IVideoSettings
  onSettingsChange: (updates: Partial<IVideoSettings>) => void
  disabled?: boolean
}

const VideoSettingsForm: React.FC<VideoSettingsFormProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  // 비디오 길이에 따른 권장 클립 수 계산
  const getRecommendedClips = (clipDuration: number, videoLength: 'short' | 'medium' | 'long') => {
    const totalDuration = videoLength === 'short' ? 15 : videoLength === 'medium' ? 30 : 60
    return Math.ceil(totalDuration / clipDuration)
  }

  const handleClipDurationChange = (duration: number) => {
    // 클립 길이 변경 시 권장 클립 수로 자동 조정
    const recommendedClips = getRecommendedClips(duration, 'medium')
    onSettingsChange({ 
      clipDuration: duration,
      totalClips: recommendedClips
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="w-5 h-5 text-blue-600" />
          비디오 설정
        </CardTitle>
        <CardDescription>
          비디오 소스, 화면 비율, 품질 등을 설정합니다
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 비디오 소스 */}
        <div className="space-y-3">
          <Label className="text-base font-medium">비디오 소스</Label>
          <RadioGroup
            value={settings.source}
            onValueChange={(value: 'pexels' | 'serpapi') => onSettingsChange({ source: value })}
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pexels" id="pexels" />
              <Label htmlFor="pexels" className="font-normal cursor-pointer">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-blue-600" />
                  <span>Pexels (무료 고품질 스톡 비디오)</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="serpapi" id="serpapi" />
              <Label htmlFor="serpapi" className="font-normal cursor-pointer">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <span>SerpAPI (Google 이미지 검색)</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500">
            {settings.source === 'pexels' 
              ? '프로페셔널한 스톡 비디오를 사용합니다'
              : '더 다양한 이미지 소스를 검색합니다'}
          </p>
        </div>

        {/* 화면 비율 */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            화면 비율
          </Label>
          <Select
            value={settings.aspect}
            onValueChange={(value: '9:16' | '16:9' | '1:1') => onSettingsChange({ aspect: value })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="화면 비율을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9:16">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-6 border-2 border-gray-400 rounded" />
                  <span>9:16 (세로형 - 숏폼 권장)</span>
                </div>
              </SelectItem>
              <SelectItem value="16:9">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 border-2 border-gray-400 rounded" />
                  <span>16:9 (가로형 - 유튜브)</span>
                </div>
              </SelectItem>
              <SelectItem value="1:1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded" />
                  <span>1:1 (정사각형 - 인스타그램)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 클립 길이 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              클립당 재생 시간
            </Label>
            <span className="text-sm font-medium text-blue-600">
              {settings.clipDuration}초
            </span>
          </div>
          <Slider
            value={[settings.clipDuration]}
            onValueChange={([value]) => handleClipDurationChange(value)}
            min={1}
            max={10}
            step={1}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1초</span>
            <span>3초 (권장)</span>
            <span>5초</span>
            <span>10초</span>
          </div>
          <p className="text-sm text-gray-500">
            3초 룰 헌법: 매 3초마다 시각적 변화로 시청자 집중도 유지
          </p>
        </div>

        {/* 총 클립 수 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">총 클립 수</Label>
            <span className="text-sm font-medium text-blue-600">
              {settings.totalClips}개
            </span>
          </div>
          <Slider
            value={[settings.totalClips]}
            onValueChange={([value]) => onSettingsChange({ totalClips: value })}
            min={3}
            max={20}
            step={1}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>3개</span>
            <span>10개</span>
            <span>20개</span>
          </div>
          <p className="text-sm text-gray-500">
            총 영상 길이: 약 {settings.clipDuration * settings.totalClips}초
          </p>
        </div>

        {/* 비디오 품질 */}
        <div className="space-y-3">
          <Label className="text-base font-medium">비디오 품질</Label>
          <RadioGroup
            value={settings.quality}
            onValueChange={(value: 'high' | 'medium') => onSettingsChange({ quality: value })}
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="font-normal cursor-pointer">
                고품질 (1080p 이상, 파일 크기 큼)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="font-normal cursor-pointer">
                중간 품질 (720p, 균형잡힌 선택)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* 설정 요약 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">선택된 비디오 설정</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
            <div>• 소스: {settings.source === 'pexels' ? 'Pexels 비디오' : 'SerpAPI 이미지'}</div>
            <div>• 화면 비율: {settings.aspect}</div>
            <div>• 클립 길이: {settings.clipDuration}초</div>
            <div>• 총 클립 수: {settings.totalClips}개</div>
            <div>• 예상 영상 길이: {settings.clipDuration * settings.totalClips}초</div>
            <div>• 품질: {settings.quality === 'high' ? '고품질' : '중간'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VideoSettingsForm
