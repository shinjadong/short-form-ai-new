'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Loader2, Sparkles, Hash } from 'lucide-react'
import { StepData, koreanExamples } from './types'

interface ScriptGenerationStepProps {
  stepData: StepData
  onStepDataChange: (data: Partial<StepData>) => void
  isGenerating: boolean
  onGenerateScript: () => Promise<void>
}

export default function ScriptGenerationStep({
  stepData,
  onStepDataChange,
  isGenerating,
  onGenerateScript
}: ScriptGenerationStepProps) {
  return (
    <div className="space-y-6">
      {/* 비디오 주제 입력 */}
      <div className="space-y-3">
        <Label htmlFor="subject">비디오 주제</Label>
        <div className="space-y-2">
          <Select onValueChange={(value: string) => onStepDataChange({ subject: value })}>
            <SelectTrigger>
              <SelectValue placeholder="예시 주제를 선택하거나 직접 입력하세요" />
            </SelectTrigger>
            <SelectContent>
              {koreanExamples.map((example, index) => (
                <SelectItem key={index} value={example}>
                  {example}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="subject"
            placeholder="또는 직접 주제를 입력하세요..."
            value={stepData.subject}
            onChange={(e) => onStepDataChange({ subject: e.target.value })}
          />
        </div>
      </div>

      {/* 스크립트 생성 버튼 */}
      <Button 
        onClick={onGenerateScript} 
        disabled={!stepData.subject.trim() || isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            OpenAI로 스크립트 생성 중...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            OpenAI로 스크립트 생성
          </>
        )}
      </Button>

      {/* 생성된 스크립트 */}
      {stepData.script && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label htmlFor="script">생성된 스크립트</Label>
            <Textarea
              id="script"
              value={stepData.script}
              onChange={(e) => onStepDataChange({ script: e.target.value })}
              rows={8}
              placeholder="스크립트가 여기에 나타납니다..."
            />
          </div>
        </>
      )}

      {/* 생성된 키워드 */}
      {stepData.keywords && (
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            생성된 키워드
          </Label>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">{stepData.keywords}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            이 키워드들은 다음 단계에서 관련 배경 영상을 찾는데 사용됩니다.
          </p>
        </div>
      )}
    </div>
  )
} 