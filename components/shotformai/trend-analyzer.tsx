"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Loader2, Info, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type StatusResponse = {
  success: boolean
  task: {
    id: string
    status: string
    message: string
    progress: number
    result: any
    created_at: number
    updated_at: number
  }
}

export function TrendAnalyzer() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<string>("idle")
  const [taskProgress, setTaskProgress] = useState(0)
  const [taskMessage, setTaskMessage] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [selectedTitleIndex, setSelectedTitleIndex] = useState(-1)
  const [scriptData, setScriptData] = useState<any>(null)
  const { toast } = useToast()

  // 작업 상태 폴링
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const checkTaskStatus = async () => {
      if (!taskId || taskStatus === "completed" || taskStatus === "failed") {
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        return
      }

      try {
        // 백엔드 직접 호출로 변경
        const response = await fetch(`/api/direct/content-analyzer/task-status/${taskId}`)
        if (!response.ok) {
          throw new Error("작업 상태 조회 실패")
        }

        const data: StatusResponse = await response.json()
        
        if (data.success && data.task) {
          setTaskStatus(data.task.status)
          setTaskProgress(data.task.progress)
          setTaskMessage(data.task.message)

          if (data.task.status === "completed" && data.task.result) {
            setAnalysisResult(data.task.result)
            toast({
              title: "분석 완료",
              description: "트렌드 분석이 완료되었습니다.",
              variant: "default",
            })
          } else if (data.task.status === "failed") {
            toast({
              title: "분석 실패",
              description: data.task.message || "트렌드 분석 중 오류가 발생했습니다.",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error("작업 상태 조회 오류:", error)
      }
    }

    if (taskId && taskStatus === "processing") {
      checkTaskStatus() // 즉시 한 번 실행
      intervalId = setInterval(checkTaskStatus, 3000) // 3초마다 상태 확인
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [taskId, taskStatus, toast])

  // 트렌드 분석 시작
  const startAnalysis = async () => {
    if (!query.trim()) {
      toast({
        title: "입력 오류",
        description: "검색어를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTaskId(null)
    setTaskStatus("idle")
    setTaskProgress(0)
    setTaskMessage("")
    setAnalysisResult(null)
    setSelectedTitleIndex(-1)
    setScriptData(null)

    try {
      // 백엔드 직접 호출로 변경
      const response = await fetch("/api/direct/content-analyzer/suggest-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim()
        }),
      })

      if (!response.ok) {
        throw new Error("트렌드 분석 요청 실패")
      }

      const data = await response.json()
      
      if (data.success && data.task_id) {
        setTaskId(data.task_id)
        setTaskStatus("processing")
        toast({
          title: "분석 시작",
          description: "트렌드 분석이 시작되었습니다. 잠시 기다려주세요.",
        })
      } else {
        throw new Error(data.message || "알 수 없는 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("트렌드 분석 오류:", error)
      toast({
        title: "분석 오류",
        description: error instanceof Error ? error.message : "트렌드 분석 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 제목 선택 처리
  const handleTitleSelect = (index: number) => {
    setSelectedTitleIndex(index)
    
    // 스크립트 데이터 설정
    if (analysisResult?.suggested_script) {
      setScriptData(analysisResult.suggested_script)
    }
  }

  // 제목 복사 처리
  const handleCopyTitle = (title: string) => {
    navigator.clipboard.writeText(title)
      .then(() => {
        toast({
          title: "복사 완료",
          description: "제목이 클립보드에 복사되었습니다.",
        })
      })
      .catch(err => {
        console.error("제목 복사 실패:", err)
        toast({
          title: "복사 실패",
          description: "제목을 클립보드에 복사하지 못했습니다.",
          variant: "destructive",
        })
      })
  }

  // 스크립트 복사 처리
  const handleCopyScript = () => {
    if (!scriptData) return
    
    const fullScript = scriptData.script_segments
      .map((segment: any) => segment.text)
      .join("\n\n")
    
    navigator.clipboard.writeText(fullScript)
      .then(() => {
        toast({
          title: "복사 완료",
          description: "스크립트가 클립보드에 복사되었습니다.",
        })
      })
      .catch(err => {
        console.error("스크립트 복사 실패:", err)
        toast({
          title: "복사 실패",
          description: "스크립트를 클립보드에 복사하지 못했습니다.",
          variant: "destructive",
        })
      })
  }

  // 자세히 보기
  const handleViewDetails = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>트렌드 분석 및 콘텐츠 제안</CardTitle>
          <CardDescription>
            검색어를 입력하여 최신 트렌드를 분석하고 콘텐츠 제작 방향을 제안받으세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="검색어를 입력하세요 (예: 테슬라, 머스크, 투자)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading || taskStatus === "processing"}
            />
            <Button
              onClick={startAnalysis}
              disabled={isLoading || taskStatus === "processing" || !query.trim()}
            >
              {(isLoading || taskStatus === "processing") ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  분석 중...
                </>
              ) : (
                "분석 시작"
              )}
            </Button>
          </div>

          {/* 진행 상태 표시 */}
          {taskStatus === "processing" && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{taskMessage}</span>
                <span className="text-sm font-medium">{taskProgress}%</span>
              </div>
              <Progress value={taskProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 분석 결과 표시 */}
      {analysisResult && (
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="titles">제목 제안</TabsTrigger>
            <TabsTrigger value="script">스크립트</TabsTrigger>
          </TabsList>
          
          {/* 개요 탭 */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>트렌드 분석 결과</CardTitle>
                <CardDescription>
                  "{query}" 키워드에 대한 트렌드 분석 결과입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {/* 카테고리 정보 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">카테고리</h3>
                    <Badge variant="outline" className="text-md py-1.5">
                      {analysisResult.category || "미분류"}
                    </Badge>
                  </div>
                  
                  {/* 타겟 오디언스 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">타겟 시청자층</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.target_audience || "일반 시청자"}
                    </p>
                  </div>
                  
                  {/* 트렌드 키워드 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">트렌드</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.trends && analysisResult.trends.length > 0 ? (
                        analysisResult.trends.map((trend: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-sm">
                            {trend}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">트렌드 정보가 없습니다.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 관련 키워드 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">관련 키워드</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords && analysisResult.keywords.length > 0 ? (
                        analysisResult.keywords.map((keyword: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-sm">
                            {keyword}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">키워드 정보가 없습니다.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 참고한 상위 동영상 */}
                  {analysisResult.top_videos && analysisResult.top_videos.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">참고 동영상</h3>
                      <Accordion type="single" collapsible>
                        {analysisResult.top_videos.map((video: any, i: number) => (
                          <AccordionItem key={i} value={`video-${i}`}>
                            <AccordionTrigger>
                              <div className="text-left flex items-center">
                                <span className="mr-2 font-medium">{i+1}.</span>
                                <span className="truncate">{video.title}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">채널:</span>
                                  <span className="text-sm">{video.channel}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">조회수:</span>
                                  <span className="text-sm">{video.view_count.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">길이:</span>
                                  <span className="text-sm">{video.duration}</span>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-2"
                                  onClick={() => handleViewDetails(video.video_id)}
                                >
                                  자세히 보기
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 제목 제안 탭 */}
          <TabsContent value="titles">
            <Card>
              <CardHeader>
                <CardTitle>제목 제안</CardTitle>
                <CardDescription>
                  분석 결과를 바탕으로 생성된 제안 제목입니다. 클릭하여 선택하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult.suggested_titles && analysisResult.suggested_titles.length > 0 ? (
                  <div className="grid gap-3">
                    {analysisResult.suggested_titles.map((title: string, i: number) => (
                      <div 
                        key={i}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedTitleIndex === i ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                        }`}
                        onClick={() => handleTitleSelect(i)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-2 text-muted-foreground">{i+1}.</span>
                            <span>{title}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyTitle(title)
                            }}
                          >
                            복사
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">제안 제목 없음</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      제안 제목을 생성하지 못했습니다. 다른 검색어로 다시 시도해 보세요.
                    </p>
                  </div>
                )}
              </CardContent>
              {selectedTitleIndex !== -1 && (
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    선택된 제목: {selectedTitleIndex + 1}
                  </div>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleCopyTitle(analysisResult.suggested_titles[selectedTitleIndex])}
                  >
                    선택한 제목 복사
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* 스크립트 탭 */}
          <TabsContent value="script">
            <Card>
              <CardHeader>
                <CardTitle>스크립트 제안</CardTitle>
                <CardDescription>
                  선택한 제목에 맞는 스크립트 제안입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTitleIndex === -1 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>제목을 선택하세요</AlertTitle>
                    <AlertDescription>
                      제목 제안 탭에서 제목을 선택하면 해당 제목에 맞는 스크립트가 표시됩니다.
                    </AlertDescription>
                  </Alert>
                ) : scriptData ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">선택한 제목</h3>
                      <p className="p-3 bg-muted rounded-md">
                        {analysisResult.suggested_titles[selectedTitleIndex]}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">스크립트</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCopyScript}
                        >
                          스크립트 복사
                        </Button>
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        {scriptData.script_segments.map((segment: any, i: number) => (
                          <div key={i} className="border rounded-md p-4">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-medium mb-1">텍스트:</p>
                                <p>{segment.text}</p>
                              </div>
                              <div className="w-1/3">
                                <p className="text-sm font-medium mb-1">이미지 설명:</p>
                                <p className="text-sm text-muted-foreground">{segment.image_cue}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  길이: {segment.duration}초
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <p className="text-sm font-medium">콜투액션:</p>
                        <p className="mt-1">{scriptData.cta}</p>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">해시태그:</p>
                        <div className="flex flex-wrap gap-2">
                          {scriptData.hashtags.map((tag: string, i: number) => (
                            <Badge key={i} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm text-muted-foreground">
                        총 길이: {scriptData.total_duration}초
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">스크립트 없음</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      스크립트를 생성하지 못했습니다. 다시 시도해 보세요.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 