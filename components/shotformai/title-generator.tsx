"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Sparkles, Loader2, TrendingUp, Youtube, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// 제목 생성 컴포넌트
interface TitleGeneratorProps {
  title: string
  onTitleChange: (title: string) => void
  mode: "generate" | "reverse"
  isMobile?: boolean
}

export function TitleGenerator({ title, onTitleChange, mode, isMobile = false }: TitleGeneratorProps) {
  const [keywords, setKeywords] = useState("")
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState("")
  const [useTrendSearch, setUseTrendSearch] = useState(false)
  const [trendSource, setTrendSource] = useState<"youtube" | "openai" | "both">("youtube")
  const [contentSuggestions, setContentSuggestions] = useState<any[]>([])
  const [showContentSuggestions, setShowContentSuggestions] = useState(false)
  const { toast } = useToast()

  // 제목 자동 생성 처리
  const handleGenerateTitle = async () => {
    // API 키 확인
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (!apiKey) {
      toast({
        title: "API 키 오류",
        description: "OpenAI API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (mode === "generate" && !keywords.trim() && !useTrendSearch) {
      toast({
        title: "키워드 필요",
        description: "키워드를 입력하거나 트렌드 검색을 활성화해주세요.",
        variant: "destructive",
      })
      return
    }

    if (mode === "reverse" && !videoUrl.trim()) {
      toast({
        title: "영상 URL 필요",
        description: "분석할 영상 URL을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingTitle(true)

    try {
      let prompt = ""

      // 웹 검색을 통한 트렌드 분석 처리
      if (useTrendSearch) {
        try {
          const trendResponse = await fetch("/api/direct/content-analyzer/suggest-content", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: keywords.trim() ? keywords : "유튜브 인기 숏폼",
              source: trendSource
            }),
          })
          
          if (!trendResponse.ok) {
            throw new Error("트렌드 검색 중 오류가 발생했습니다.")
          }
          
          // API 응답 데이터 처리
          const trendData = await trendResponse.json()
          console.log("트렌드 API 응답:", trendData) // 디버깅용 로그
          
          // 안전하게 trendKeywords 배열 가져오기
          const trendKeywords = Array.isArray(trendData.trendKeywords) ? trendData.trendKeywords : []
          const suggestions = Array.isArray(trendData.contentSuggestions) ? trendData.contentSuggestions : []
          const source = trendData.source || 'unknown'
          
          // 콘텐츠 제안 저장
          if (suggestions.length > 0) {
            setContentSuggestions(suggestions)
            setShowContentSuggestions(true)
            toast({
              title: "콘텐츠 분석 완료",
              description: `${suggestions.length}개의 콘텐츠 방향 제안을 확인하세요.`,
            })
          }
          
          if (trendKeywords.length > 0) {
            // 키워드에 트렌드 정보 추가
            const baseKeywords = keywords.trim() ? keywords : ""
            const combinedKeywords = baseKeywords ? 
              `${baseKeywords}, ${trendKeywords.join(", ")}` : 
              trendKeywords.join(", ")
            
            toast({
              title: `트렌드 키워드 분석 완료 (${source === 'youtube' ? '유튜브' : source === 'openai' ? 'OpenAI' : '통합'})`,
              description: `발견된 트렌드: ${trendKeywords.slice(0, 3).join(", ")} 등`,
            })
            
            prompt = `다음 키워드와 현재 트렌드를 반영하여 숏폼 영상에 적합한 매력적인 제목 5개를 생성해주세요. 
            각 제목은 클릭을 유도하고 호기심을 자극하며 현재 트렌드를 반영해야 합니다.
            키워드: ${combinedKeywords}
            
            제목은 한국어로 작성하고, 각 제목은 30자 이내로 간결하게 작성해주세요.
            응답은 제목만 나열해주세요. 번호나 설명 없이 제목만 작성해주세요.`
          } else {
            // 트렌드 키워드가 없는 경우 기본 프롬프트 사용
            console.log("트렌드 키워드를 찾지 못했습니다. 기본 프롬프트 사용.")
            prompt = `다음 키워드를 사용하여 숏폼 영상에 적합한 매력적인 제목 5개를 생성해주세요. 각 제목은 클릭을 유도하고 호기심을 자극해야 합니다.
            키워드: ${keywords || "최신 트렌드, 인기 콘텐츠"}
            
            제목은 한국어로 작성하고, 각 제목은 30자 이내로 간결하게 작성해주세요.
            응답은 제목만 나열해주세요. 번호나 설명 없이 제목만 작성해주세요.`
          }
        } catch (error) {
          console.error("트렌드 검색 오류:", error)
          toast({
            title: "트렌드 검색 실패",
            description: "트렌드 정보를 가져오는데 실패했습니다. 일반 모드로 계속합니다.",
            variant: "destructive",
          })
          
          // 트렌드 검색 실패 시 일반 프롬프트로 진행
          prompt = `다음 키워드를 사용하여 숏폼 영상에 적합한 매력적인 제목 5개를 생성해주세요. 각 제목은 클릭을 유도하고 호기심을 자극해야 합니다.
          키워드: ${keywords || "최신 콘텐츠"}
          
          제목은 한국어로 작성하고, 각 제목은 30자 이내로 간결하게 작성해주세요.
          응답은 제목만 나열해주세요. 번호나 설명 없이 제목만 작성해주세요.`
        }
      } else if (mode === "generate") {
        prompt = `다음 키워드를 사용하여 숏폼 영상에 적합한 매력적인 제목 5개를 생성해주세요. 각 제목은 클릭을 유도하고 호기심을 자극해야 합니다.
        키워드: ${keywords}
        
        제목은 한국어로 작성하고, 각 제목은 30자 이내로 간결하게 작성해주세요.
        응답은 제목만 나열해주세요. 번호나 설명 없이 제목만 작성해주세요.`
      } else {
        prompt = `다음 유튜브 영상 URL을 분석하여 비슷한 주제로 더 매력적인 숏폼 제목 5개를 생성해주세요.
        영상 URL: ${videoUrl}
        
        제목은 한국어로 작성하고, 각 제목은 30자 이내로 간결하게 작성해주세요.
        응답은 제목만 나열해주세요. 번호나 설명 없이 제목만 작성해주세요.`
      }

      // 제목 생성 API 호출 (백엔드)
      const response = await fetch("/api/direct/content-analyzer/generate-titles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: prompt, // 기존 프롬프트를 title로 전달
          category: "general",
          count: 5
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `제목 생성 API 오류 (${response.status}): ${errorData.error?.message || "알 수 없는 오류가 발생했습니다."}`,
        )
      }

      const data = await response.json()

      // 응답에서 제목 추출
      const titles = data.titles || []
      if (titles.length > 0) {
        setGeneratedTitles(titles)
        toast({
          title: "제목 생성 완료",
          description: `${titles.length}개의 제목이 생성되었습니다.`,
        })
      } else {
        throw new Error("제목 생성 실패: API 응답에 내용이 없습니다.")
      }
    } catch (error: any) {
      console.error("제목 생성 오류:", error)
      toast({
        title: "제목 생성 실패",
        description: error?.message || "제목 생성 API 호출 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingTitle(false)
    }
  }

  // 자동 생성 제목 선택
  const selectTitle = (selectedTitle: string) => {
    onTitleChange(selectedTitle)
    setGeneratedTitles([])
  }

  // 테스트용 더미 제목 생성 (API 키가 없을 때 사용)
  const generateDummyTitles = () => {
    return [
      "일상을 바꾸는 3가지 생산성 향상 방법",
      "전문가들만 알고 있는 시간 관리 비밀",
      "당신이 몰랐던 건강한 생활 습관의 효과",
      "누구나 따라할 수 있는 홈 인테리어 팁",
      "요즘 트렌드, 이것만 알면 당신도 전문가"
    ]
  }

  // 콘텐츠 방향 선택
  const selectContentDirection = (suggestion: any) => {
    // 선택한 콘텐츠 방향에서 제목 생성
    const suggestionTitle = suggestion.title;
    
    // 시스템 알림
    toast({
      title: "콘텐츠 방향 선택됨",
      description: `'${suggestionTitle}' 방식의 콘텐츠를 기반으로 제목을 생성합니다.`,
    })
    
    // 분석 결과에서 키워드 추출
    const analysis = suggestion.analysis;
    const match = analysis.match(/콘텐츠 핵심 주제.*?:(.*?)(?:\n|$)/i);
    const topic = match ? match[1].trim() : suggestionTitle;
    
    // 추출한 주제를 기반으로 제목 생성 시작
    setKeywords(topic);
    handleGenerateTitle();
    
    // 콘텐츠 방향 패널 닫기
    setShowContentSuggestions(false);
  }

  return (
    <div className={`${isMobile ? "" : "max-w-2xl mx-auto"}`}>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">서비스 유형</label>
        <Select defaultValue="숏폼">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="숏폼">숏폼</SelectItem>
            <SelectItem value="블로그">블로그</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === "generate" ? (
        // 생성 모드 - 키워드 입력
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">핵심 키워드</label>
          <div className="flex gap-2">
            <Input
              placeholder="예: 생산성 향상, 시간 관리, 커리어 개발"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={handleGenerateTitle}
              variant="outline"
              className={`whitespace-nowrap flex gap-1 ${isMobile ? "px-2" : ""}`}
              disabled={isGeneratingTitle}
            >
              {isGeneratingTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {!isMobile && "제목 생성"}
            </Button>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="trend-search"
              checked={useTrendSearch}
              onCheckedChange={(checked) => setUseTrendSearch(checked === true)}
            />
            <label
              htmlFor="trend-search"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
            >
              <TrendingUp className="h-4 w-4 text-blue-500" />
              트렌드 키워드 분석 사용
            </label>
          </div>
          
          {useTrendSearch && (
            <div className="mt-3 border rounded-md p-3 bg-gray-50">
              <div className="text-sm font-medium mb-2">트렌드 검색 소스</div>
              <RadioGroup defaultValue="youtube" value={trendSource} onValueChange={(value) => setTrendSource(value as any)} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="youtube" id="r1" />
                  <Label htmlFor="r1" className="flex items-center gap-1 cursor-pointer">
                    <Youtube className="h-4 w-4 text-red-500" />
                    유튜브 인기 쇼츠 분석
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="openai" id="r2" />
                  <Label htmlFor="r2" className="flex items-center gap-1 cursor-pointer">
                    <Globe className="h-4 w-4 text-green-500" />
                    OpenAI 웹 검색
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="r3" />
                  <Label htmlFor="r3" className="cursor-pointer">통합 검색 (유튜브 우선)</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            {useTrendSearch
              ? "최신 트렌드를 기반으로 제목을 생성합니다. 키워드를 추가로 입력하면 해당 키워드와 연관된 트렌드를 분석합니다."
              : "영상의 핵심 키워드를 입력하고 제목 생성 버튼을 클릭하세요."}
          </p>
        </div>
      ) : (
        // 리버싱 모드 - 영상 URL 입력
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">분석할 영상 URL</label>
          <div className="flex gap-2">
            <Input
              placeholder="예: https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={handleGenerateTitle}
              variant="outline"
              className={`whitespace-nowrap flex gap-1 ${isMobile ? "px-2" : ""}`}
              disabled={isGeneratingTitle}
            >
              {isGeneratingTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {!isMobile && "분석하기"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">분석하고 싶은 영상의 URL을 입력하고 분석하기 버튼을 클릭하세요.</p>
        </div>
      )}

      {/* 콘텐츠 방향 제안 */}
      {showContentSuggestions && contentSuggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">추천 콘텐츠 방향</h3>
          <div className={`space-y-4 border rounded-md p-3 bg-gray-50 ${isMobile ? "max-h-80 overflow-y-auto" : ""}`}>
            {contentSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 border rounded bg-white hover:bg-blue-50 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-medium">{suggestion.title}</span>
                    <p className="text-xs text-gray-500">조회수: {Number(suggestion.viewCount).toLocaleString()}회</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 p-0"
                    onClick={() => selectContentDirection(suggestion)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {suggestion.analysis}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            상위 인기 콘텐츠의 분석 결과입니다. 방향을 선택하면 그에 맞는 제목을 생성합니다.
          </p>
        </div>
      )}

      {/* 자동 생성된 제목 목록 */}
      {generatedTitles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">추천 제목</h3>
          <div className={`space-y-2 border rounded-md p-3 bg-gray-50 ${isMobile ? "max-h-40 overflow-y-auto" : ""}`}>
            {generatedTitles.map((generatedTitle, index) => (
              <div
                key={index}
                className="p-2 border rounded bg-white hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                onClick={() => selectTitle(generatedTitle)}
              >
                <span className={isMobile ? "text-sm" : ""}>{generatedTitle}</span>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">제목</label>
        <Input
          placeholder="직접 입력하거나 위에서 추천 제목을 선택하세요"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full ${isMobile ? "" : "text-lg py-6"}`}
        />
      </div>
    </div>
  )
}
