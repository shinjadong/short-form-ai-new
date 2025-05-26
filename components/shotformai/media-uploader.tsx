"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Video, X, Search, Settings, Download, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface MediaUploaderProps {
  onFileSelected: (file: File) => void
  keywords?: string[]  // 생성된 키워드
  isMobile?: boolean
}

interface VideoResult {
  id: string
  url: string
  thumbnail: string
  duration: number
  source: string
}

export function MediaUploader({ onFileSelected, keywords = [], isMobile = false }: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const [activeTab, setActiveTab] = useState<"upload" | "auto">("upload")
  
  // 자동 수집 관련 상태
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<VideoResult[]>([])
  const [selectedVideos, setSelectedVideos] = useState<VideoResult[]>([])
  const [videoSource, setVideoSource] = useState("pexels")
  const [aspectRatio, setAspectRatio] = useState("9:16")
  const [clipDuration, setClipDuration] = useState([3])
  const [totalVideoDuration, setTotalVideoDuration] = useState([10])
  
  const { toast } = useToast()

  // 파일 처리 함수
  const processFile = (file: File) => {
    // 파일 크기 및 타입 체크
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "파일은 100MB 이하만 업로드 가능합니다.",
        variant: "destructive",
      })
      return
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "지원되지 않는 파일 형식",
        description: "이미지 또는 비디오 파일만 업로드 가능합니다.",
        variant: "destructive",
      })
      return
    }

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setFileType(file.type.startsWith("image/") ? "image" : "video")

    // 부모 컴포넌트에 파일 전달
    onFileSelected(file)
  }

  // 파일 입력 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  // 드래그 이벤트 핸들러
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // 드롭 이벤트 핸들러
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  // 미리보기 제거
  const removePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setFileType(null)
  }

  // 자동 영상 검색
  const handleAutoSearch = async () => {
    if (keywords.length === 0) {
      toast({
        title: "키워드가 필요합니다",
        description: "먼저 이전 단계에서 키워드를 생성해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    try {
      // 백엔드 API 호출하여 비디오 검색
      const response = await fetch('/api/search-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywords.slice(0, 3), // 처음 3개 키워드 사용
          source: videoSource,
          orientation: aspectRatio === "9:16" ? "portrait" : aspectRatio === "16:9" ? "landscape" : "square",
          per_page: 20
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.videos || [])
        
        toast({
          title: "영상 검색 완료",
          description: `${data.videos?.length || 0}개의 관련 영상을 찾았습니다.`,
        })
      } else {
        throw new Error('영상 검색에 실패했습니다.')
      }
    } catch (error) {
      console.error('영상 검색 오류:', error)
      toast({
        title: "영상 검색 실패",
        description: "관련 영상을 찾는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // 영상 선택/선택 해제
  const toggleVideoSelection = (video: VideoResult) => {
    setSelectedVideos(prev => {
      const isSelected = prev.find(v => v.id === video.id)
      if (isSelected) {
        return prev.filter(v => v.id !== video.id)
      } else {
        return [...prev, video]
      }
    })
  }

  // 자동 비디오 생성
  const handleGenerateVideo = async () => {
    if (selectedVideos.length === 0) {
      toast({
        title: "영상을 선택해주세요",
        description: "최소 1개 이상의 영상을 선택해야 합니다.",
        variant: "destructive",
      })
      return
    }

    try {
      // 백엔드 API를 사용하여 비디오 생성
      const { createVideo, monitorTask } = await import("@/lib/backend-api")
      
      const taskId = await createVideo({
        video_subject: "자동 생성된 비디오",
        video_script: "", // 스크립트는 이미 생성됨
        video_terms: keywords,
        video_aspect: aspectRatio as '16:9' | '9:16' | '1:1',
        video_concat_mode: "random",
        video_clip_duration: clipDuration[0],
        video_count: 1,
        video_source: videoSource,
        video_language: "ko",
      })

      toast({
        title: "비디오 생성 시작",
        description: "선택한 영상들로 비디오를 생성하고 있습니다...",
      })

      // 태스크 진행 상황 모니터링
      monitorTask(
        taskId,
        (progress) => {
          console.log(`비디오 생성 진행률: ${progress}%`)
        },
        (result) => {
          if (result.combined_videos && result.combined_videos.length > 0) {
            // 생성된 비디오를 파일로 변환하여 전달
            const videoUrl = result.combined_videos[0]
            
            // Blob으로 변환 후 File 객체 생성 (실제 구현에서는 더 정교하게)
            fetch(videoUrl)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], 'generated-video.mp4', { type: 'video/mp4' })
                onFileSelected(file)
                setPreviewUrl(videoUrl)
                setFileType("video")
              })
            
            toast({
              title: "비디오 생성 완료",
              description: "자동으로 생성된 비디오가 준비되었습니다.",
            })
          }
        },
        (error) => {
          toast({
            title: "비디오 생성 실패",
            description: error || "비디오 생성 중 오류가 발생했습니다.",
            variant: "destructive",
          })
        }
      )

    } catch (error: any) {
      console.error("비디오 생성 오류:", error)
      toast({
        title: "비디오 생성 실패",
        description: error?.message || "백엔드 API 호출 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`${isMobile ? "" : "max-w-4xl mx-auto"}`}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upload" | "auto")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            직접 업로드
          </TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            자동 소재 수집
          </TabsTrigger>
        </TabsList>

        {/* 직접 업로드 탭 */}
        <TabsContent value="upload" className="mt-6">
          {!previewUrl ? (
            <div
              className={`border-2 ${dragActive ? "border-blue-500 bg-blue-50" : "border-dashed"} rounded-lg ${isMobile ? "p-8" : "p-12"} text-center`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <Upload className={`${isMobile ? "h-10 w-10" : "h-16 w-16"} text-gray-400`} />
                <p className={`${isMobile ? "text-sm" : "text-lg"} text-gray-700`}>
                  여기에 영상(10초 이하) 또는 이미지를 업로드해주세요
                </p>
                <p className="text-sm text-gray-500">최대 100MB, 지원 형식: MP4, JPG, PNG</p>
                <p className="text-sm text-gray-500">파일을 끌어다 놓거나 아래 버튼을 클릭하세요</p>
                <label className="mt-4">
                  <Button variant="outline" size={isMobile ? "default" : "lg"} className="gap-2">
                    <Upload className="h-5 w-5" />
                    파일 선택하기
                  </Button>
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-[9/16] bg-black rounded-lg flex items-center justify-center overflow-hidden">
                {fileType === "image" ? (
                  <img src={previewUrl || "/placeholder.svg"} alt="미리보기" className="w-full h-full object-contain" />
                ) : (
                  <video src={previewUrl} controls className="w-full h-full" />
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                onClick={removePreview}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="mt-4 flex justify-center">
                <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                  {fileType === "image" ? (
                    <>
                      <ImageIcon className="h-4 w-4" />
                      <span>이미지 업로드됨</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      <span>비디오 업로드됨</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 자동 소재 수집 탭 */}
        <TabsContent value="auto" className="mt-6 space-y-6">
          {/* 설정 패널 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                비디오 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="video-source">비디오 소스</Label>
                  <Select value={videoSource} onValueChange={setVideoSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pexels">Pexels (무료)</SelectItem>
                      <SelectItem value="pixabay">Pixabay (무료)</SelectItem>
                      <SelectItem value="unsplash">Unsplash (무료)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="aspect-ratio">화면 비율</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:16">세로 (9:16) - 숏폼</SelectItem>
                      <SelectItem value="16:9">가로 (16:9) - 유튜브</SelectItem>
                      <SelectItem value="1:1">정사각 (1:1) - 인스타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>클립 길이: {clipDuration[0]}초</Label>
                  <Slider
                    value={clipDuration}
                    onValueChange={setClipDuration}
                    max={10}
                    min={2}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>전체 비디오 길이: {totalVideoDuration[0]}초</Label>
                <Slider
                  value={totalVideoDuration}
                  onValueChange={setTotalVideoDuration}
                  max={60}
                  min={5}
                  step={5}
                  className="mt-2"
                />
              </div>

              {keywords.length > 0 && (
                <div>
                  <Label>검색 키워드</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.slice(0, 5).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleAutoSearch}
                disabled={isSearching || keywords.length === 0}
                className="w-full"
              >
                {isSearching ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    관련 영상 검색 중...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    관련 영상 검색하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>검색된 영상 ({searchResults.length}개)</span>
                  <span className="text-sm font-normal">선택: {selectedVideos.length}개</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
                  {searchResults.map((video) => (
                    <div
                      key={video.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                        selectedVideos.find(v => v.id === video.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleVideoSelection(video)}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={video.thumbnail}
                          alt="비디오 썸네일"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          {video.duration}s
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{video.source}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedVideos.length > 0 && (
                  <Button
                    onClick={handleGenerateVideo}
                    className="w-full mt-4"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    선택한 영상으로 비디오 생성 ({selectedVideos.length}개)
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
