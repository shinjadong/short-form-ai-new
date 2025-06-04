'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Wand2, Copy, Download, RefreshCw, Sparkles, BookOpen, Target, Mic, MessageSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useScriptGeneration } from '@/hooks/useDirectApiCalls'
import NavigationHeader from '@/components/navigation-header'

const ScriptGeneratorPage = () => {
  const { toast } = useToast()
  const {
    isLoading,
    script,
    scriptAnalysis,
    scriptSegments,
    error,
    generateScript,
    resetScript
  } = useScriptGeneration()

  // 폼 상태
  const [subject, setSubject] = useState('')
  const [language, setLanguage] = useState('ko')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [style, setStyle] = useState('informative')
  const [tone, setTone] = useState('friendly')
  const [targetAudience, setTargetAudience] = useState('general')
  const [contentStructure, setContentStructure] = useState('hook_content_cta')
  const [keywords, setKeywords] = useState<string[]>([])
  const [customRequirements, setCustomRequirements] = useState('')
  const [newKeyword, setNewKeyword] = useState('')

  // 예시 주제들
  const exampleTopics = [
    "행복한 삶을 위한 5가지 습관",
    "건강한 라이프스타일의 비밀", 
    "성공하는 사람들의 아침 루틴",
    "효율적인 시간 관리 방법",
    "마음의 평화를 찾는 법",
    "디지털 디톡스의 필요성",
    "창의력을 키우는 방법",
    "스트레스 해소법",
    "좋은 인간관계 만들기",
    "자기계발의 첫걸음"
  ]

  // 스타일 옵션들
  const styleOptions = [
    { value: 'informative', label: '정보 전달형', description: '명확하고 구체적인 정보 제공' },
    { value: 'entertaining', label: '재미있는', description: '유머와 흥미로운 요소 포함' },
    { value: 'educational', label: '교육적', description: '학습 목적의 체계적 설명' },
    { value: 'dramatic', label: '드라마틱', description: '감정적이고 몰입감 있는 구성' },
    { value: 'conversational', label: '대화형', description: '친근하고 자연스러운 대화체' },
    { value: 'professional', label: '전문적', description: '비즈니스와 전문성 강조' }
  ]

  const toneOptions = [
    { value: 'friendly', label: '친근한', description: '따뜻하고 접근하기 쉬운' },
    { value: 'formal', label: '격식있는', description: '정중하고 예의바른' },
    { value: 'casual', label: '캐주얼한', description: '편안하고 자연스러운' },
    { value: 'enthusiastic', label: '열정적인', description: '에너지가 넘치는' },
    { value: 'calm', label: '차분한', description: '안정적이고 평온한' },
    { value: 'humorous', label: '유머러스한', description: '재미있고 웃음을 유발하는' }
  ]

  const audienceOptions = [
    { value: 'general', label: '일반 대중', description: '모든 연령대와 배경' },
    { value: 'young_adults', label: '젊은 성인', description: '20-30대 연령층' },
    { value: 'professionals', label: '직장인', description: '비즈니스 전문가들' },
    { value: 'students', label: '학생', description: '학습자와 교육 수혜자' },
    { value: 'seniors', label: '시니어', description: '중장년층과 고령자' },
    { value: 'parents', label: '부모님들', description: '육아와 가족 관심사' }
  ]

  const structureOptions = [
    { value: 'hook_content_cta', label: '후킹-내용-행동유도', description: '관심끌기 → 핵심내용 → 행동유도' },
    { value: 'problem_solution', label: '문제-해결책', description: '문제제기 → 해결방안 제시' },
    { value: 'story_lesson', label: '스토리-교훈', description: '이야기 → 배움과 깨달음' },
    { value: 'list_format', label: '리스트형', description: '순서대로 나열하는 구성' },
    { value: 'comparison', label: '비교-대조', description: '여러 관점의 비교 분석' },
    { value: 'tutorial', label: '튜토리얼', description: '단계별 따라하기 형식' }
  ]

  // 키워드 추가
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  // 키워드 제거
  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove))
  }

  // 예시 주제 선택
  const selectExampleTopic = (topic: string) => {
    setSubject(topic)
  }

  // 스크립트 생성
  const handleGenerateScript = async () => {
    if (!subject.trim()) {
      toast({
        title: "주제 입력 필요",
        description: "비디오 주제를 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    try {
      const result = await generateScript(subject, {
        language,
        length,
        style,
        tone,
        target_audience: targetAudience,
        content_structure: contentStructure,
        keywords,
        custom_requirements: customRequirements
      })

      if (result.success) {
        toast({
          title: "스크립트 생성 완료",
          description: "AI가 맞춤형 스크립트를 생성했습니다.",
        })
      }
    } catch (err) {
      toast({
        title: "스크립트 생성 실패",
        description: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  // 스크립트 복사
  const copyScript = () => {
    if (script) {
      navigator.clipboard.writeText(script)
      toast({
        title: "스크립트 복사됨",
        description: "클립보드에 스크립트가 복사되었습니다.",
      })
    }
  }

  // 스크립트 다운로드
  const downloadScript = () => {
    if (script) {
      const blob = new Blob([script], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `script_${subject.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "스크립트 다운로드",
        description: "스크립트 파일이 다운로드되었습니다.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <NavigationHeader />

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI 스크립트 생성기
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            주제만 입력하면 AI가 완벽한 숏폼 비디오 스크립트를 생성해드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 스크립트 설정 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 기본 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  기본 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 예시 주제 */}
                <div>
                  <Label>예시 주제 (클릭하여 사용)</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {exampleTopics.slice(0, 5).map((topic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => selectExampleTopic(topic)}
                        className="text-left justify-start h-auto py-2 px-3 text-sm"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 주제 입력 */}
                <div>
                  <Label htmlFor="subject">비디오 주제 *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="예: 건강한 라이프스타일의 비밀"
                    className="mt-1"
                  />
                </div>

                {/* 언어 및 길이 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>언어</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ko">한국어</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>길이</Label>
                    <Select value={length} onValueChange={(value: 'short' | 'medium' | 'long') => setLength(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">짧게 (30초)</SelectItem>
                        <SelectItem value="medium">보통 (60초)</SelectItem>
                        <SelectItem value="long">길게 (90초)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 스타일 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  스타일 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 스타일 */}
                <div>
                  <Label>스타일</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 톤 */}
                <div>
                  <Label>톤</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 타겟 오디언스 */}
                <div>
                  <Label>타겟 오디언스</Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audienceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 콘텐츠 구조 */}
                <div>
                  <Label>콘텐츠 구조</Label>
                  <Select value={contentStructure} onValueChange={setContentStructure}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {structureOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 고급 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  고급 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 키워드 */}
                <div>
                  <Label>키워드</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="키워드 입력"
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button onClick={addKeyword} size="sm">
                      추가
                    </Button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(keyword)}>
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* 커스텀 요구사항 */}
                <div>
                  <Label htmlFor="requirements">추가 요구사항</Label>
                  <Textarea
                    id="requirements"
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                    placeholder="특별한 요구사항이나 포함하고 싶은 내용을 입력하세요..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* 생성 버튼 */}
                <Button
                  onClick={handleGenerateScript}
                  disabled={isLoading || !subject.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      스크립트 생성 중...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      스크립트 생성
                    </>
                  )}
                </Button>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 생성된 스크립트 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 스크립트 결과 */}
            {script && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      생성된 스크립트
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyScript}>
                        <Copy className="h-4 w-4 mr-1" />
                        복사
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadScript}>
                        <Download className="h-4 w-4 mr-1" />
                        다운로드
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetScript}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        리셋
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                      {script}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 스크립트 분석 */}
            {scriptAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    스크립트 분석
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {scriptAnalysis.word_count || 0}
                      </div>
                      <div className="text-sm text-gray-600">글자 수</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {scriptAnalysis.estimated_duration || 0}초
                      </div>
                      <div className="text-sm text-gray-600">예상 길이</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {scriptAnalysis.sentence_count || 0}
                      </div>
                      <div className="text-sm text-gray-600">문장 수</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {scriptAnalysis.reading_speed || 0}
                      </div>
                      <div className="text-sm text-gray-600">분당 글자수</div>
                    </div>
                  </div>

                  {scriptAnalysis.key_points && scriptAnalysis.key_points.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">핵심 포인트</h4>
                      <div className="flex flex-wrap gap-2">
                        {scriptAnalysis.key_points.map((point: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 세그먼트 정보 */}
            {scriptSegments && scriptSegments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>문장 세그먼트</CardTitle>
                  <CardDescription>
                    스크립트가 문장별로 분할되었습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scriptSegments.map((segment: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">문장 {index + 1}</Badge>
                          <span className="text-sm text-gray-500">
                            {segment.word_count || 0}글자
                          </span>
                        </div>
                        <p className="text-sm">{segment.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 로딩 상태 */}
            {isLoading && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-500" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">AI가 스크립트를 생성하고 있습니다</h3>
                      <p className="text-gray-600">잠시만 기다려주세요...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 시작 가이드 */}
            {!script && !isLoading && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                      <Wand2 className="h-10 w-10 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">스크립트 생성을 시작해보세요</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        왼쪽에서 주제와 설정을 선택한 후 "스크립트 생성" 버튼을 클릭하세요
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScriptGeneratorPage 