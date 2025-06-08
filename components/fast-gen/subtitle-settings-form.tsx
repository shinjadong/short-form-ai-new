'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { ISubtitleSettings } from '@/types/video-generation'
import { Subtitles, Type, Palette, Move, Sparkles } from 'lucide-react'

interface SubtitleSettingsFormProps {
  settings: ISubtitleSettings
  onSettingsChange: (updates: Partial<ISubtitleSettings>) => void
  disabled?: boolean
}

// 자막 스타일 프리셋
const SUBTITLE_PRESETS = {
  youtube: {
    name: '유튜브 스타일',
    description: '검은 배경에 흰색 글씨',
    fontSize: 60,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    useBackground: true
  },
  netflix: {
    name: '넷플릭스 스타일',
    description: '그림자 효과의 흰색 글씨',
    fontSize: 48,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    useBackground: false
  },
  anime: {
    name: '애니메이션 스타일',
    description: '굵은 테두리의 화려한 글씨',
    fontSize: 72,
    fontColor: '#FFFF00',
    backgroundColor: '#FF0000',
    useBackground: false
  },
  aesthetic: {
    name: '감성 스타일',
    description: '파스텔톤의 부드러운 느낌',
    fontSize: 56,
    fontColor: '#333333',
    backgroundColor: '#FFE4E1',
    useBackground: true
  }
}

const SubtitleSettingsForm: React.FC<SubtitleSettingsFormProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  const handleStyleChange = (style: ISubtitleSettings['style']) => {
    if (style !== 'custom') {
      const preset = SUBTITLE_PRESETS[style]
      onSettingsChange({
        style,
        fontSize: preset.fontSize,
        fontColor: preset.fontColor,
        backgroundColor: preset.backgroundColor,
        useBackground: preset.useBackground
      })
    } else {
      onSettingsChange({ style })
    }
  }

  const currentPreset = settings.style !== 'custom' ? SUBTITLE_PRESETS[settings.style] : null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Subtitles className="w-5 h-5 text-green-600" />
          자막 설정
        </CardTitle>
        <CardDescription>
          자막 스타일, 애니메이션, 위치 등을 설정합니다
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 자막 스타일 */}
        <div className="space-y-3">
          <Label className="text-base font-medium">자막 스타일</Label>
          <Select
            value={settings.style}
            onValueChange={handleStyleChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="자막 스타일을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUBTITLE_PRESETS).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="custom">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>사용자 정의</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {currentPreset && (
            <p className="text-sm text-gray-500">
              {currentPreset.description}
            </p>
          )}
        </div>

        {/* 애니메이션 효과 */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            애니메이션 효과
          </Label>
          <Select
            value={settings.animation}
            onValueChange={(value) => onSettingsChange({ animation: value as ISubtitleSettings['animation'] })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="애니메이션을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">없음</SelectItem>
              <SelectItem value="fade">페이드 인/아웃</SelectItem>
              <SelectItem value="typewriter">타자기 효과</SelectItem>
              <SelectItem value="slide">슬라이드</SelectItem>
              <SelectItem value="zoom">줌 인/아웃</SelectItem>
              <SelectItem value="glow">빛나기</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 자막 위치 */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Move className="w-4 h-4" />
            자막 위치
          </Label>
          <Select
            value={settings.position}
            onValueChange={(value) => onSettingsChange({ position: value as ISubtitleSettings['position'] })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="자막 위치를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">상단</SelectItem>
              <SelectItem value="center">중앙</SelectItem>
              <SelectItem value="bottom">하단</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 글자 크기 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">글자 크기</Label>
            <span className="text-sm font-medium text-green-600">
              {settings.fontSize}px
            </span>
          </div>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([value]) => onSettingsChange({ fontSize: value })}
            min={24}
            max={120}
            step={4}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>24px (작음)</span>
            <span>60px (보통)</span>
            <span>120px (큼)</span>
          </div>
        </div>

        {/* 글자 색상 */}
        <div className="space-y-3">
          <Label className="text-base font-medium">글자 색상</Label>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-300"
              style={{ backgroundColor: settings.fontColor }}
            />
            <Input
              type="text"
              value={settings.fontColor}
              onChange={(e) => onSettingsChange({ fontColor: e.target.value })}
              placeholder="#FFFFFF"
              className="flex-1"
              disabled={disabled}
            />
          </div>
          <div className="flex gap-2">
            {['#FFFFFF', '#000000', '#FFFF00', '#FF0000', '#00FF00', '#0000FF'].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                style={{ backgroundColor: color }}
                onClick={() => onSettingsChange({ fontColor: color })}
                disabled={disabled}
              />
            ))}
          </div>
        </div>

        {/* 배경 사용 여부 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="use-background" className="text-base font-medium">
              자막 배경 사용
            </Label>
            <Switch
              id="use-background"
              checked={settings.useBackground}
              onCheckedChange={(checked) => onSettingsChange({ useBackground: checked })}
              disabled={disabled}
            />
          </div>
          <p className="text-sm text-gray-500">
            자막 뒤에 반투명 배경을 추가하여 가독성을 높입니다
          </p>
        </div>

        {/* 배경 색상 (배경 사용 시에만) */}
        {settings.useBackground && (
          <div className="space-y-3">
            <Label className="text-base font-medium">배경 색상</Label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: settings.backgroundColor }}
              />
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                placeholder="#000000"
                className="flex-1"
                disabled={disabled}
              />
            </div>
            <div className="flex gap-2">
              {['#000000', '#FFFFFF', '#333333', '#666666', '#FF0000', '#0000FF'].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => onSettingsChange({ backgroundColor: color })}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        )}

        {/* 자막 미리보기 */}
        <div className="p-6 bg-gray-900 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/placeholder.jpg" 
              alt="비디오 배경" 
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div 
            className={`relative z-10 text-center ${
              settings.position === 'top' ? 'mt-4' : 
              settings.position === 'center' ? 'my-auto' : 
              'mb-4 mt-auto'
            }`}
          >
            <div
              className={`inline-block ${settings.useBackground ? 'px-4 py-2 rounded' : ''}`}
              style={{
                backgroundColor: settings.useBackground ? settings.backgroundColor + '99' : 'transparent',
              }}
            >
              <p
                style={{
                  fontSize: `${settings.fontSize * 0.5}px`,
                  color: settings.fontColor,
                  textShadow: !settings.useBackground ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
                  fontWeight: 'bold'
                }}
              >
                자막 미리보기
              </p>
            </div>
          </div>
        </div>

        {/* 설정 요약 */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Subtitles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">선택된 자막 설정</span>
          </div>
          <div className="space-y-1 text-sm text-green-700">
            <div>• 스타일: {currentPreset?.name || '사용자 정의'}</div>
            <div>• 애니메이션: {settings.animation === 'none' ? '없음' : settings.animation}</div>
            <div>• 위치: {settings.position === 'top' ? '상단' : settings.position === 'center' ? '중앙' : '하단'}</div>
            <div>• 글자 크기: {settings.fontSize}px</div>
            <div>• 배경 사용: {settings.useBackground ? '예' : '아니오'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SubtitleSettingsForm
