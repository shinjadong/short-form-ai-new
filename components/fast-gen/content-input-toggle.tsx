'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Wand2, Clipboard, CheckCircle } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface ContentInputToggleProps {
  automaticInput: string
  setAutomaticInput: (value: string) => void
  onAnalyze: () => void
  isAnalyzing?: boolean
  className?: string
}

const ContentInputToggle: React.FC<ContentInputToggleProps> = ({
  automaticInput,
  setAutomaticInput,
  onAnalyze,
  isAnalyzing = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPasted, setIsPasted] = useState(false)

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setAutomaticInput(text)
      setIsPasted(true)
      setTimeout(() => setIsPasted(false), 2000)
    }).catch(() => {
      // 클립보드 접근 실패 시 수동 입력으로 안내
      setIsOpen(true)
    })
  }

  const handleTextChange = (value: string) => {
    setAutomaticInput(value)
    if (value.length > 0 && !isOpen) {
      setIsOpen(true)
    }
  }

  const isContentReady = automaticInput.trim().length > 50

  return (
    <Card className={`border-2 transition-all duration-300 ${
      isOpen ? 'border-blue-300 shadow-lg' : 'border-gray-200 hover:border-gray-300'
    } ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                🤖 AI 오토매틱 콘텐츠 분석
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                성공한 콘텐츠의 내용을 붙여넣기만 하면 AI가 알아서 분석하고 3초 룰 스크립트를 생성합니다
              </CardDescription>
            </div>
          </div>
          <Badge variant={isContentReady ? "default" : "secondary"} className="ml-2">
            {isContentReady ? "준비완료" : "입력대기"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 빠른 액션 버튼들 */}
        <div className="flex gap-3">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex-1">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between group hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <span className="flex items-center gap-2">
                  📄 콘텐츠 입력
                  {isContentReady && <CheckCircle className="h-4 w-4 text-green-500" />}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 transition-transform group-hover:scale-110" />
                ) : (
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:scale-110" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 mt-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Clipboard className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    성공 콘텐츠 분석 입력
                  </span>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePaste}
                    className={`transition-all ${isPasted ? 'bg-green-100 border-green-300 text-green-700' : ''}`}
                  >
                    {isPasted ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        붙여넣기 완료
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-3 w-3 mr-1" />
                        자동 붙여넣기
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-gray-500 self-center">
                    또는 아래에 직접 입력하세요
                  </div>
                </div>

                <Textarea
                  placeholder="성공한 콘텐츠의 제목, 내용, 자막 등을 모두 붙여넣어 주세요...

예시:
- 유튜브 쇼츠 자막 전체
- 인스타그램 릴스 캡션과 설명
- 틱톡 영상의 텍스트 내용
- 블로그 포스트 내용

최소 50자 이상 입력해주세요."
                  value={automaticInput}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">
                    {automaticInput.length} / 최소 50자
                  </div>
                  {automaticInput.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAutomaticInput('')}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      초기화
                    </Button>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* 분석 시작 버튼 */}
        {isContentReady && (
          <div className="pt-2 border-t">
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  AI 분석 중...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI 오토매틱 분석 시작
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ContentInputToggle 