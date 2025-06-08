'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { IVoiceSettings } from '@/types/video-generation'
import { Mic, Volume2, Activity, FileAudio } from 'lucide-react'

interface VoiceSettingsFormProps {
  settings: IVoiceSettings
  onSettingsChange: (updates: Partial<IVoiceSettings>) => void
  disabled?: boolean
}

// TypeCast 한국어 음성 배우 목록
const KOREAN_VOICE_ACTORS = [
  { id: '603fa172a669dfd23f450abd', name: '수진 (여성, 차분함)', gender: 'female', style: 'calm' },
  { id: '603fa172a669dfd23f450abe', name: '민지 (여성, 활발함)', gender: 'female', style: 'energetic' },
  { id: '603fa172a669dfd23f450abf', name: '지훈 (남성, 차분함)', gender: 'male', style: 'calm' },
  { id: '603fa172a669dfd23f450ac0', name: '준호 (남성, 활발함)', gender: 'male', style: 'energetic' },
  { id: '603fa172a669dfd23f450ac1', name: '서연 (여성, 전문적)', gender: 'female', style: 'professional' },
  { id: '603fa172a669dfd23f450ac2', name: '현우 (남성, 전문적)', gender: 'male', style: 'professional' },
  { id: '603fa172a669dfd23f450ac3', name: '유나 (여성, 친근함)', gender: 'female', style: 'friendly' },
  { id: '603fa172a669dfd23f450ac4', name: '태민 (남성, 친근함)', gender: 'male', style: 'friendly' },
]

const VoiceSettingsForm: React.FC<VoiceSettingsFormProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  const selectedActor = KOREAN_VOICE_ACTORS.find(actor => actor.id === settings.actor) || KOREAN_VOICE_ACTORS[0]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mic className="w-5 h-5 text-purple-600" />
          음성 설정
        </CardTitle>
        <CardDescription>
          AI 음성의 배우, 속도, 톤 등을 설정합니다
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 음성 배우 선택 */}
        <div className="space-y-3">
          <Label className="text-base font-medium">음성 배우</Label>
          <Select
            value={settings.actor}
            onValueChange={(value) => onSettingsChange({ actor: value })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="음성 배우를 선택하세요">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedActor.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                  }`} />
                  {selectedActor.name}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div className="space-y-2">
                <div className="px-2 py-1 text-sm font-medium text-gray-500">여성 음성</div>
                {KOREAN_VOICE_ACTORS.filter(actor => actor.gender === 'female').map((actor) => (
                  <SelectItem key={actor.id} value={actor.id}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      {actor.name}
                    </div>
                  </SelectItem>
                ))}
                
                <div className="px-2 py-1 text-sm font-medium text-gray-500 mt-2">남성 음성</div>
                {KOREAN_VOICE_ACTORS.filter(actor => actor.gender === 'male').map((actor) => (
                  <SelectItem key={actor.id} value={actor.id}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {actor.name}
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            TypeCast AI의 고품질 한국어 음성을 사용합니다
          </p>
        </div>

        {/* 재생 속도 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              재생 속도
            </Label>
            <span className="text-sm font-medium text-purple-600">
              {settings.speed}x
            </span>
          </div>
          <Slider
            value={[settings.speed]}
            onValueChange={([value]) => onSettingsChange({ speed: value })}
            min={0.5}
            max={2.0}
            step={0.1}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0.5x (느림)</span>
            <span>1.0x (보통)</span>
            <span>2.0x (빠름)</span>
          </div>
        </div>

        {/* 볼륨 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              볼륨
            </Label>
            <span className="text-sm font-medium text-purple-600">
              {settings.volume}%
            </span>
          </div>
          <Slider
            value={[settings.volume]}
            onValueChange={([value]) => onSettingsChange({ volume: value })}
            min={0}
            max={100}
            step={5}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 피치 (톤) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">음높이 (피치)</Label>
            <span className="text-sm font-medium text-purple-600">
              {settings.pitch > 0 ? '+' : ''}{settings.pitch}
            </span>
          </div>
          <Slider
            value={[settings.pitch]}
            onValueChange={([value]) => onSettingsChange({ pitch: value })}
            min={-20}
            max={20}
            step={1}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-20 (낮음)</span>
            <span>0 (기본)</span>
            <span>+20 (높음)</span>
          </div>
        </div>

        {/* 오디오 포맷 */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <FileAudio className="w-4 h-4" />
            오디오 포맷
          </Label>
          <RadioGroup
            value={settings.format}
            onValueChange={(value: 'wav' | 'mp3') => onSettingsChange({ format: value })}
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wav" id="wav" />
              <Label htmlFor="wav" className="font-normal cursor-pointer">
                WAV (고품질, 파일 크기 큼)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mp3" id="mp3" />
              <Label htmlFor="mp3" className="font-normal cursor-pointer">
                MP3 (압축됨, 파일 크기 작음)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* 프리뷰 정보 */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">선택된 음성 설정</span>
          </div>
          <div className="space-y-1 text-sm text-purple-700">
            <div>• 배우: {selectedActor.name}</div>
            <div>• 속도: {settings.speed}x</div>
            <div>• 볼륨: {settings.volume}%</div>
            <div>• 피치: {settings.pitch > 0 ? '+' : ''}{settings.pitch}</div>
            <div>• 포맷: {settings.format.toUpperCase()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VoiceSettingsForm
