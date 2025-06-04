"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Play, Pause, Volume2, ArrowRight, Sparkles, TrendingUp, Youtube, Globe, Hash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ScriptGeneratorProps {
  title: string
  script: string
  onScriptChange: (script: string) => void
  onVoiceGenerated: (url: string) => void
  onKeywordsGenerated?: (keywords: string[]) => void  // 새로 추가된 prop
  voiceType: string
  onVoiceTypeChange: (type: string) => void
  isMobile?: boolean
}

export function ScriptGenerator({
  title,
  script,
  onScriptChange,
  onVoiceGenerated,
  onKeywordsGenerated,
  voiceType,
  onVoiceTypeChange,
  isMobile = false,
}: ScriptGeneratorProps) {
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false)  // 새로 추가
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()
  const [generatedScripts, setGeneratedScripts] = useState<string[]>([])
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])  // 새로 추가
  const [toneOfVoice, setToneOfVoice] = useState("유머러스")
  const [useTrendSearch, setUseTrendSearch] = useState(false)
  const [trendSource, setTrendSource] = useState<"youtube" | "openai" | "both">("youtube")
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])

  // 스크립트 생성 (백엔드 API 사용)
  const handleGenerateScript = async () => {
    if (!title.trim()) {
      toast({
        title: "제목 필요",
        description: "스크립트 생성을 위해 제목을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingScript(true)

    try {
      let trendKeywords: string[] = []

      // 트렌드 검색이 활성화된 경우 키워드 추출 및 트렌드 분석
      if (useTrendSearch) {
        try {
          // 제목에서 핵심 키워드 추출
          const keywordResponse = await fetch("/api/extract-keywords", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: title,
            }),
          })
          
          if (keywordResponse.ok) {
            const keywordData = await keywordResponse.json()
            const extractedKeywords = Array.isArray(keywordData.keywords) ? keywordData.keywords : []
            const keywords = extractedKeywords.length > 0 ? extractedKeywords.join(", ") : title
            
            // 추출된 키워드로 트렌드 검색
            const trendResponse = await fetch("/api/trend-search", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: keywords,
                source: trendSource
              }),
            })
            
            if (trendResponse.ok) {
              const trendData = await trendResponse.json()
              trendKeywords = Array.isArray(trendData.trendKeywords) ? trendData.trendKeywords : []
              
              if (trendKeywords.length > 0) {
                toast({
                  title: `트렌드 키워드 분석 완료`,
                  description: `발견된 트렌드: ${trendKeywords.slice(0, 3).join(", ")} 등`,
                })
              }
            }
          }
        } catch (error) {
          console.error("트렌드 검색 오류:", error)
          toast({
            title: "트렌드 검색 실패",
            description: "트렌드 정보를 가져오는데 실패했습니다. 일반 모드로 계속합니다.",
            variant: "destructive",
          })
        }
      }

      // 백엔드 API를 사용하여 스크립트 생성
      const { generateScript } = await import("@/lib/backend-api")
      
      const scriptText = await generateScript({
        video_subject: title,
        video_language: "ko",
        paragraph_number: 3,
      })

      // 스크립트를 여러 개로 분할 (기본적으로 하나의 긴 스크립트가 반환됨)
      const scripts = [scriptText]
      
      setGeneratedScripts(scripts)
      toast({
        title: "스크립트 생성 완료",
        description: `백엔드 AI를 통해 스크립트가 생성되었습니다.`,
      })

    } catch (error: any) {
      console.error("스크립트 생성 오류:", error)
      toast({
        title: "스크립트 생성 실패",
        description: error?.message || "백엔드 API 호출 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingScript(false)
    }
  }

  // 키워드 생성 함수 (새로 추가)
  const handleGenerateKeywords = async () => {
    if (!script.trim()) {
      toast({
        title: "스크립트 필요",
        description: "키워드 생성을 위해 스크립트가 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingKeywords(true)

    try {
      // 백엔드 API를 사용하여 키워드 생성
      const { generateTerms } = await import("@/lib/backend-api")
      
      const keywords = await generateTerms({
        video_subject: title,
        video_script: script,
        amount: 5,
      })

      setGeneratedKeywords(keywords)
      onKeywordsGenerated?.(keywords)
      
      toast({
        title: "키워드 생성 완료",
        description: `${keywords.length}개의 키워드가 생성되었습니다.`,
      })

    } catch (error: any) {
      console.error("키워드 생성 오류:", error)
      toast({
        title: "키워드 생성 실패",
        description: error?.message || "백엔드 API 호출 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingKeywords(false)
    }
  }

  // 자동 생성 스크립트 선택
  const selectScript = (selectedScript: string) => {
    onScriptChange(selectedScript)
    setGeneratedScripts([])
  }

  // 음성 생성 (백엔드 API 사용)
  const handleGenerateVoice = async () => {
    if (!script.trim()) {
      toast({
        title: "스크립트 필요",
        description: "음성을 생성하려면 스크립트가 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingVoice(true)

    try {
      // 한국어 음성 매핑 (Edge TTS 기반)
      const voiceNameMap: Record<string, string> = {
        richard: "ko-KR-HyunsuNeural-Male", // 남성 1
        brian: "ko-KR-InJoonNeural-Male", // 남성 2
        female1: "ko-KR-SunHiNeural-Female", // 여성 1
        female2: "ko-KR-BongJinNeural-Female", // 여성 2
      }

      const selectedVoice = voiceNameMap[voiceType] || voiceNameMap.richard

      // 백엔드 API를 사용하여 오디오 생성
      const { createAudio, monitorTask } = await import("@/lib/backend-api")
      
      const taskId = await createAudio({
        video_script: script,
        video_language: "ko",
        voice_name: selectedVoice,
        voice_volume: 1.0,
        voice_rate: 1.0,
        bgm_type: "none", // 음성만 생성
        bgm_volume: 0.0,
      })

      toast({
        title: "음성 생성 시작",
        description: "백엔드에서 음성을 생성하고 있습니다...",
      })

      // 태스크 진행 상황 모니터링
      const cleanup = monitorTask(
        taskId,
        (progress) => {
          // 진행률 업데이트 (필요시 UI에 표시)
          console.log(`음성 생성 진행률: ${progress}%`)
        },
        (result) => {
          // 생성 완료
          if (result.audio_file) {
            // 백엔드의 로컬 파일 경로를 웹 접근 가능한 URL로 변환
            const audioUrl = `http://localhost:8080/tasks/${taskId}/audio.mp3`
            setAudioPreview(audioUrl)
            onVoiceGenerated(audioUrl)
            
            toast({
              title: "음성 생성 완료",
              description: "한국어 AI 음성이 생성되었습니다.",
            })
            setIsGeneratingVoice(false)
          } else if (result.videos && result.videos.length > 0) {
            // 비디오 결과가 있는 경우 (백업)
            const audioUrl = result.videos[0]
            setAudioPreview(audioUrl)
            onVoiceGenerated(audioUrl)
            
            toast({
              title: "음성 생성 완료",
              description: "한국어 AI 음성이 생성되었습니다.",
            })
            setIsGeneratingVoice(false)
          } else {
            toast({
              title: "음성 생성 실패",
              description: "음성 파일이 생성되지 않았습니다.",
              variant: "destructive",
            })
            setIsGeneratingVoice(false)
          }
        },
        (error) => {
          // 생성 실패
          console.error("음성 생성 실패:", error)
          toast({
            title: "음성 생성 실패",
            description: error || "백엔드에서 음성 생성 중 오류가 발생했습니다.",
            variant: "destructive",
          })
          setIsGeneratingVoice(false)
        }
      )

      // 컴포넌트 언마운트 시 cleanup
      return cleanup

    } catch (error: any) {
      console.error("음성 생성 오류:", error)
      toast({
        title: "음성 생성 실패",
        description: error?.message || "백엔드 API 호출 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsGeneratingVoice(false)
    }
  }

  // 오디오 재생/일시정지 토글
  const toggleAudioPlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // 오디오 재생 종료 이벤트 핸들러
  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  // 추천 제목 클릭 시 복사 처리
  const handleTitleClick = (title: string) => {
    // 클립보드에 복사
    navigator.clipboard.writeText(title)
      .then(() => {
        toast({
          title: "제목 복사됨",
          description: "클립보드에 제목이 복사되었습니다.",
        })
      })
      .catch(err => {
        console.error('제목 복사 실패:', err)
        toast({
          title: "복사 실패",
          description: "제목을 클립보드에 복사하지 못했습니다.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className={`${isMobile ? "" : "max-w-2xl mx-auto"}`}>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          제목: <span className="font-normal">{title}</span>
        </label>
        
        {/* 추천 제목 표시 영역 */}
        {generatedTitles.length > 0 && (
          <div className="mt-4 mb-2">
            <h3 className="text-sm font-medium mb-2">AI 추천 제목</h3>
            <div className={`space-y-2 border rounded-md p-3 bg-gray-50 ${isMobile ? "max-h-40 overflow-y-auto" : ""}`}>
              {generatedTitles.map((genTitle, index) => (
                <div 
                  key={index} 
                  className="p-2 border rounded bg-white hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                  onClick={() => handleTitleClick(genTitle)}
                >
                  <p className="text-gray-800">{genTitle}</p>
                  <Button variant="ghost" size="sm" className="h-6 p-0">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              추천 제목은 인기 콘텐츠 벤치마킹을 기반으로 생성되었습니다. 클릭하여 복사하세요.
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">스크립트 톤</label>
        <div className="flex gap-2">
          <Select defaultValue={toneOfVoice} onValueChange={setToneOfVoice}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="유머러스">유머러스</SelectItem>
              <SelectItem value="전문적">전문적</SelectItem>
              <SelectItem value="진지함">진지함</SelectItem>
              <SelectItem value="열정적">열정적</SelectItem>
              <SelectItem value="동기부여">동기부여</SelectItem>
              <SelectItem value="교육적">교육적</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerateScript}
            variant="outline"
            className={`whitespace-nowrap flex gap-1 ${isMobile ? "px-2" : ""}`}
            disabled={isGeneratingScript}
          >
            {isGeneratingScript ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {!isMobile && "스크립트 생성"}
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="trend-search-script"
            checked={useTrendSearch}
            onCheckedChange={(checked: boolean | "indeterminate") => setUseTrendSearch(checked === true)}
          />
          <label
            htmlFor="trend-search-script"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
          >
            <TrendingUp className="h-4 w-4 text-blue-500" />
            트렌드 키워드 반영하기
          </label>
        </div>
        
        {useTrendSearch && (
          <div className="mt-3 border rounded-md p-3 bg-gray-50">
            <div className="text-sm font-medium mb-2">트렌드 검색 소스</div>
            <RadioGroup defaultValue="youtube" value={trendSource} onValueChange={(value: string) => setTrendSource(value as "youtube" | "openai" | "both")} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="youtube" id="sr1" />
                <Label htmlFor="sr1" className="flex items-center gap-1 cursor-pointer">
                  <Youtube className="h-4 w-4 text-red-500" />
                  유튜브 인기 쇼츠 분석
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="openai" id="sr2" />
                <Label htmlFor="sr2" className="flex items-center gap-1 cursor-pointer">
                  <Globe className="h-4 w-4 text-green-500" />
                  OpenAI 웹 검색
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="sr3" />
                <Label htmlFor="sr3" className="cursor-pointer">통합 검색 (유튜브 우선)</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          {useTrendSearch 
            ? "제목에서 키워드를 추출하여 관련 트렌드를 분석하고 스크립트에 반영합니다."
            : "스크립트의 어조를 선택하고 생성 버튼을 클릭하세요."}
        </p>
      </div>

      {/* 자동 생성된 스크립트 목록 */}
      {generatedScripts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">추천 스크립트</h3>
          <div className={`space-y-4 border rounded-md p-3 bg-gray-50 ${isMobile ? "max-h-60 overflow-y-auto" : ""}`}>
            {generatedScripts.map((generatedScript, index) => (
              <div
                key={index}
                className="p-3 border rounded bg-white hover:bg-blue-50 cursor-pointer"
                onClick={() => selectScript(generatedScript)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">스크립트 {index + 1}</span>
                  <Button variant="ghost" size="sm" className="h-7 p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className={`text-gray-700 whitespace-pre-line ${isMobile ? "text-sm" : ""}`}>{generatedScript}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">스크립트</label>
        <Textarea
          placeholder="직접 입력하거나 위에서 추천 스크립트를 선택하세요"
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          className="w-full min-h-[200px]"
        />
      </div>

      {/* 키워드 생성 섹션 (새로 추가) */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">비디오 검색 키워드</label>
          <Button
            onClick={handleGenerateKeywords}
            variant="outline"
            size="sm"
            disabled={isGeneratingKeywords || !script.trim()}
            className="flex gap-1"
          >
            {isGeneratingKeywords ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />}
            키워드 생성
          </Button>
        </div>
        
        {generatedKeywords.length > 0 && (
          <div className="mb-4">
            <div className="border rounded-md p-3 bg-gray-50">
              <h4 className="text-sm font-medium mb-2">생성된 키워드</h4>
              <div className="flex flex-wrap gap-2">
                {generatedKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                이 키워드들은 다음 단계에서 관련 배경 영상을 자동으로 찾는데 사용됩니다.
              </p>
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          스크립트를 기반으로 관련 배경 영상을 찾기 위한 영어 키워드를 자동 생성합니다.
        </p>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">음성 선택</label>
        <div className="flex gap-2">
          <Select value={voiceType} onValueChange={onVoiceTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="음성 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="richard">현수 (남성 1)</SelectItem>
              <SelectItem value="brian">인준 (남성 2)</SelectItem>
              <SelectItem value="female1">선희 (여성 1)</SelectItem>
              <SelectItem value="female2">봉진 (여성 2)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleGenerateVoice}
            disabled={isGeneratingVoice || !script.trim()}
            className="whitespace-nowrap"
          >
            {isGeneratingVoice ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>생성 중...</span>
              </>
            ) : (
              "음성 생성"
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          원하는 음성을 선택하고 생성 버튼을 클릭하세요. 음성 생성은 다음 단계로 넘어가기 전에 필요합니다.
        </p>

        {/* 오디오 미리보기 */}
        {audioPreview && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleAudioPlayback}
                variant="outline"
                size="sm"
                className="w-10 h-10 rounded-full p-0 flex items-center justify-center"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <p className="text-sm font-medium">음성 미리듣기</p>
                <p className="text-xs text-gray-500">
                  {voiceType === "richard"
                    ? "현수 (남성 1)"
                    : voiceType === "brian"
                      ? "인준 (남성 2)"
                      : voiceType === "female1"
                        ? "선희 (여성 1)"
                        : "봉진 (여성 2)"}
                </p>
              </div>
              <Volume2 className="h-5 w-5 text-gray-400" />
            </div>
            <audio ref={audioRef} src={audioPreview} onEnded={handleAudioEnded} className="hidden" />
          </div>
        )}
      </div>
    </div>
  )
}
