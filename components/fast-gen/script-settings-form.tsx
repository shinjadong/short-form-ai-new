'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Settings, Brain, Zap, Target, X } from 'lucide-react'
import { IScriptSettings } from '@/types/video-generation'

interface ScriptSettingsFormProps {
  settings: IScriptSettings
  onSettingsChange: (settings: Partial<IScriptSettings>) => void
  className?: string
}

const ScriptSettingsForm: React.FC<ScriptSettingsFormProps> = ({
  settings,
  onSettingsChange,
  className = ''
}) => {
  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !settings.keywords.includes(keyword.trim())) {
      onSettingsChange({
        keywords: [...settings.keywords, keyword.trim()]
      })
    }
  }

  const removeKeyword = (keyword: string) => {
    onSettingsChange({
      keywords: settings.keywords.filter(k => k !== keyword)
    })
  }

  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const keyword = e.currentTarget.value.trim()
      if (keyword) {
        addKeyword(keyword)
        e.currentTarget.value = ''
      }
    }
  }

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-blue-600" />
          3초 룰 헌법 기반 스크립트 설정
        </CardTitle>
        <CardDescription>
          뇌과학과 심리학 원리를 적용한 궁금증 엔진으로 강력한 스크립트를 생성합니다
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 기본 설정 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              ⏱️ 영상 길이
            </Label>
            <Select 
              value={settings.length} 
              onValueChange={(value) => onSettingsChange({length: value as 'short' | 'medium' | 'long'})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">15초 (초단편)</SelectItem>
                <SelectItem value="medium">30초 (표준)</SelectItem>
                <SelectItem value="long">60초 (장편)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              🎭 스타일
            </Label>
            <Select 
              value={settings.style} 
              onValueChange={(value) => onSettingsChange({style: value as IScriptSettings['style']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entertaining">엔터테이닝</SelectItem>
                <SelectItem value="informative">정보전달</SelectItem>
                <SelectItem value="educational">교육적</SelectItem>
                <SelectItem value="dramatic">드라마틱</SelectItem>
                <SelectItem value="conversational">대화형</SelectItem>
                <SelectItem value="professional">전문적</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              🎵 톤앤매너
            </Label>
            <Select 
              value={settings.tone} 
              onValueChange={(value) => onSettingsChange({tone: value as IScriptSettings['tone']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">친근한</SelectItem>
                <SelectItem value="enthusiastic">열정적</SelectItem>
                <SelectItem value="calm">차분한</SelectItem>
                <SelectItem value="humorous">유머러스</SelectItem>
                <SelectItem value="casual">캐주얼</SelectItem>
                <SelectItem value="formal">정중한</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              👥 타겟 시청자
            </Label>
            <Select 
              value={settings.target_audience} 
              onValueChange={(value) => onSettingsChange({target_audience: value as IScriptSettings['target_audience']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">전연령</SelectItem>
                <SelectItem value="young_adults">2030세대</SelectItem>
                <SelectItem value="professionals">직장인</SelectItem>
                <SelectItem value="students">학생</SelectItem>
                <SelectItem value="seniors">시니어</SelectItem>
                <SelectItem value="parents">부모</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              📐 콘텐츠 구조
            </Label>
            <Select 
              value={settings.content_structure} 
              onValueChange={(value) => onSettingsChange({content_structure: value as IScriptSettings['content_structure']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hook_content_cta">훅-콘텐츠-CTA</SelectItem>
                <SelectItem value="problem_solution">문제-해결책</SelectItem>
                <SelectItem value="story_lesson">스토리-교훈</SelectItem>
                <SelectItem value="list_format">리스트 형태</SelectItem>
                <SelectItem value="comparison">비교 분석</SelectItem>
                <SelectItem value="tutorial">튜토리얼</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              🧠 성격 유형
            </Label>
            <Select 
              value={settings.personality_type} 
              onValueChange={(value) => onSettingsChange({personality_type: value as IScriptSettings['personality_type']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curious">호기심 많은</SelectItem>
                <SelectItem value="confident">자신감 있는</SelectItem>
                <SelectItem value="empathetic">공감형</SelectItem>
                <SelectItem value="rebellious">반항적</SelectItem>
                <SelectItem value="authoritative">권위적</SelectItem>
                <SelectItem value="friendly">친근한</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 뇌과학 기반 고급 설정 */}
        <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <Label className="text-base font-medium text-purple-800">뇌과학 기반 궁금증 엔진</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                후킹 강도: {settings.hook_intensity}%
              </Label>
              <Slider
                value={[settings.hook_intensity]}
                onValueChange={(value) => onSettingsChange({hook_intensity: value[0]})}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-gray-600">
                첫 3초 내 시청자 관심 끌기 강도
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                궁금증 레벨: {settings.curiosity_level}%
              </Label>
              <Slider
                value={[settings.curiosity_level]}
                onValueChange={(value) => onSettingsChange({curiosity_level: value[0]})}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-gray-600">
                지속적인 궁금증 유발 정도
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">💭 감정 트리거</Label>
            <Select 
              value={settings.emotional_trigger} 
              onValueChange={(value) => onSettingsChange({emotional_trigger: value as IScriptSettings['emotional_trigger']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curiosity">호기심</SelectItem>
                <SelectItem value="fear">두려움 (FOMO)</SelectItem>
                <SelectItem value="desire">욕망</SelectItem>
                <SelectItem value="social_proof">사회적 증명</SelectItem>
                <SelectItem value="urgency">긴급함</SelectItem>
                <SelectItem value="achievement">성취감</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 최적화 스위치들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <Label className="text-sm font-medium">3초 룰 준수</Label>
                <div className="text-xs text-gray-500">3초 헌법 강제 적용</div>
              </div>
              <Switch
                checked={settings.three_second_compliance}
                onCheckedChange={(checked) => onSettingsChange({three_second_compliance: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <Label className="text-sm font-medium">시청 지속률 최적화</Label>
                <div className="text-xs text-gray-500">리텐션 향상 기법 적용</div>
              </div>
              <Switch
                checked={settings.retention_optimization}
                onCheckedChange={(checked) => onSettingsChange({retention_optimization: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <Label className="text-sm font-medium">고급 훅 활성화</Label>
                <div className="text-xs text-gray-500">뇌과학 기반 초고성능 훅</div>
              </div>
              <Switch
                checked={settings.enable_advanced_hooks}
                onCheckedChange={(checked) => onSettingsChange({enable_advanced_hooks: checked})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <Label className="text-sm font-medium">시각적 동기화</Label>
                <div className="text-xs text-gray-500">영상과 스크립트 연동</div>
              </div>
              <Switch
                checked={settings.visual_sync_mode}
                onCheckedChange={(checked) => onSettingsChange({visual_sync_mode: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <Label className="text-sm font-medium">모션 키워드</Label>
                <div className="text-xs text-gray-500">움직임 관련 키워드 포함</div>
              </div>
              <Switch
                checked={settings.motion_keywords}
                onCheckedChange={(checked) => onSettingsChange({motion_keywords: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <Label className="text-sm font-medium">TTS 친화적</Label>
                <div className="text-xs text-gray-500">발음하기 쉬운 구조</div>
              </div>
              <Switch
                checked={settings.tts_friendly}
                onCheckedChange={(checked) => onSettingsChange({tts_friendly: checked})}
              />
            </div>
          </div>
        </div>

        {/* 키워드 입력 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">🔑 추가 키워드 (선택사항)</Label>
          <Input
            placeholder="키워드 입력 후 Enter 또는 쉼표로 구분"
            onKeyDown={handleKeywordInput}
            className="border-blue-200 focus:border-blue-400"
          />
          {settings.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {settings.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {keyword}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeKeyword(keyword)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 추가 요구사항 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">📝 추가 요구사항</Label>
          <Textarea
            placeholder="특별한 요구사항이나 스타일 지시사항을 입력하세요"
            value={settings.custom_requirements}
            onChange={(e) => onSettingsChange({custom_requirements: e.target.value})}
            rows={3}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ScriptSettingsForm 