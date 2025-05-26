"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Download, Loader2, Play, Pause, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VideoPreviewProps {
  mediaFile: File | null
  mediaPreview: string | null
  title: string
  script: string
  audioUrl: string
  titlePosition: "top" | "middle" | "bottom"
  ctaPosition: "top" | "middle" | "bottom"
  titleStyle: "default" | "highlight" | "shadow" | "outline"
  ctaStyle: "default" | "highlight" | "shadow" | "outline"
  ctaText: string
  onTitlePositionChange: (position: "top" | "middle" | "bottom") => void
  onCtaPositionChange: (position: "top" | "middle" | "bottom") => void
  onTitleStyleChange: (style: "default" | "highlight" | "shadow" | "outline") => void
  onCtaStyleChange: (style: "default" | "highlight" | "shadow" | "outline") => void
  onCtaTextChange: (text: string) => void
  isMobile?: boolean
}

export function VideoPreview({
  mediaFile,
  mediaPreview,
  title,
  script,
  audioUrl,
  titlePosition,
  ctaPosition,
  titleStyle,
  ctaStyle,
  ctaText,
  onTitlePositionChange,
  onCtaPositionChange,
  onTitleStyleChange,
  onCtaStyleChange,
  onCtaTextChange,
  isMobile = false,
}: VideoPreviewProps) {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // 오디오 재생/일시정지 토글
  const toggleAudioPlayback = () => {
    if (!audioRef.current) return

    if (isPlayingAudio) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlayingAudio(!isPlayingAudio)
  }

  // 오디오 재생 종료 이벤트 핸들러
  const handleAudioEnded = () => {
    setIsPlayingAudio(false)
  }

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // 텍스트 스타일에 따른 클래스 반환
  const getTextStyleClass = (style: "default" | "highlight" | "shadow" | "outline") => {
    switch (style) {
      case "default":
        return "bg-black bg-opacity-50 text-white"
      case "highlight":
        return "bg-yellow-500 text-black font-bold"
      case "shadow":
        return "bg-transparent text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      case "outline":
        return "bg-transparent text-white border-2 border-white"
      default:
        return "bg-black bg-opacity-50 text-white"
    }
  }

  // 텍스트 위치에 따른 클래스 반환
  const getPositionClass = (position: "top" | "middle" | "bottom") => {
    switch (position) {
      case "top":
        return "top-4"
      case "middle":
        return "top-1/2 -translate-y-1/2"
      case "bottom":
        return "bottom-4"
      default:
        return "top-4"
    }
  }

  // 최종 생성 및 다운로드
  const handleFinalGenerate = async () => {
    if (!mediaFile || !title) {
      toast({
        title: "필수 항목 누락",
        description: "미디어 파일과 제목이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingVideo(true)

    try {
      // 실제 구현에서는 서버에 요청을 보내 영상을 합성하는 로직이 필요합니다.
      // 여기서는 시뮬레이션만 진행합니다.

      // 로딩 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // 성공 메시지
      toast({
        title: "영상 생성 완료",
        description: "영상이 성공적으로 생성되었습니다.",
      })

      // 다운로드 시뮬레이션 (실제로는 서버에서 생성된 영상 URL을 받아 다운로드)
      if (mediaFile.type.startsWith("video/")) {
        // 비디오 파일인 경우 원본 미디어 다운로드
        const downloadLink = document.createElement("a")
        downloadLink.href = mediaPreview || ""
        downloadLink.download = `shotform_${new Date().getTime()}.mp4`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      } else {
        // 이미지 파일인 경우 이미지 다운로드
        const downloadLink = document.createElement("a")
        downloadLink.href = mediaPreview || ""
        downloadLink.download = `shotform_${new Date().getTime()}.jpg`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }

      toast({
        title: "다운로드 완료",
        description: "영상이 다운로드되었습니다.",
      })
    } catch (error: any) {
      console.error("영상 생성 오류:", error)
      toast({
        title: "영상 생성 실패",
        description: error?.message || "영상을 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  return (
    <div className={`${isMobile ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}`}>
      {/* 미리보기 영상/이미지 */}
      <div className="aspect-[9/16] bg-black rounded-lg flex items-center justify-center overflow-hidden relative mx-auto">
        {mediaPreview &&
          (mediaFile?.type.startsWith("video/") ? (
            <video src={mediaPreview} controls className="w-full h-full" />
          ) : (
            <img src={mediaPreview || "/placeholder.svg"} alt="미리보기" className="w-full h-full object-contain" />
          ))}

        {/* 오버레이 텍스트 위치 - 제목 */}
        <div
          className={`absolute ${getPositionClass(titlePosition)} left-0 right-0 text-center z-10 pointer-events-none`}
        >
          <div className={`inline-block px-3 py-1 rounded text-sm ${getTextStyleClass(titleStyle)}`}>{title}</div>
        </div>

        {/* 오버레이 텍스트 위치 - CTA */}
        <div
          className={`absolute ${getPositionClass(ctaPosition)} left-0 right-0 text-center z-10 pointer-events-none`}
        >
          <div className={`inline-block px-3 py-1 rounded text-sm ${getTextStyleClass(ctaStyle)}`}>{ctaText}</div>
        </div>

        {/* 텍스트 이동 표시 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <p className="text-white text-sm bg-black bg-opacity-70 px-3 py-1 rounded">
            텍스트 위치는 옆의 컨트롤에서 조정할 수 있습니다
          </p>
        </div>
      </div>

      {/* 미리보기 옵션 */}
      <div className="space-y-6">
        {/* 오디오 미리보기 */}
        {audioUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">음성 미리듣기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Button
                  onClick={toggleAudioPlayback}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 rounded-full p-0 flex items-center justify-center"
                >
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: isPlayingAudio ? "60%" : "0%" }}
                    ></div>
                  </div>
                </div>
                <Volume2 className="h-5 w-5 text-gray-400" />
              </div>
              <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} className="hidden" />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">텍스트 위치 조정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">제목 위치</label>
                <Select
                  defaultValue="top"
                  value={titlePosition}
                  onValueChange={(value) => onTitlePositionChange(value as any)}
                >
                  <SelectTrigger className="h-8 text-xs py-0">
                    <span className="text-xs">
                      제목: {titlePosition === "top" ? "상단" : titlePosition === "middle" ? "중앙" : "하단"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">상단</SelectItem>
                    <SelectItem value="middle">중앙</SelectItem>
                    <SelectItem value="bottom">하단</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CTA 텍스트</label>
                <Input
                  placeholder="댓글에 '기술창업' 남겨주세요!"
                  value={ctaText}
                  onChange={(e) => onCtaTextChange(e.target.value)}
                  className="w-full mb-2"
                />
                <label className="block text-sm font-medium mb-2">CTA 위치</label>
                <Select
                  defaultValue="bottom"
                  value={ctaPosition}
                  onValueChange={(value) => onCtaPositionChange(value as any)}
                >
                  <SelectTrigger className="h-8 text-xs py-0">
                    <span className="text-xs">
                      CTA: {ctaPosition === "top" ? "상단" : ctaPosition === "middle" ? "중앙" : "하단"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">상단</SelectItem>
                    <SelectItem value="middle">중앙</SelectItem>
                    <SelectItem value="bottom">하단</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">텍스트 스타일</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">제목 스타일</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={titleStyle === "default" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => onTitleStyleChange("default")}
                  >
                    <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">기본</span>
                  </Button>
                  <Button
                    variant={titleStyle === "highlight" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => onTitleStyleChange("highlight")}
                  >
                    <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded font-bold">강조</span>
                  </Button>
                  <Button
                    variant={titleStyle === "shadow" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => onTitleStyleChange("shadow")}
                  >
                    <span className="px-2 py-1 text-white text-xs rounded drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      그림자
                    </span>
                  </Button>
                  <Button
                    variant={titleStyle === "outline" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => onTitleStyleChange("outline")}
                  >
                    <span className="px-2 py-1 text-white text-xs rounded border border-white">외곽선</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CTA 스타일</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={ctaStyle === "default" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => onCtaStyleChange("default")}
                  >
                    <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">기본</span>
                  </Button>
                  <Button
                    variant={ctaStyle === "highlight" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => onCtaStyleChange("highlight")}
                  >
                    <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded font-bold">강조</span>
                  </Button>
                  <Button
                    variant={ctaStyle === "shadow" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => onCtaStyleChange("shadow")}
                  >
                    <span className="px-2 py-1 text-white text-xs rounded drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      그림자
                    </span>
                  </Button>
                  <Button
                    variant={ctaStyle === "outline" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => onCtaStyleChange("outline")}
                  >
                    <span className="px-2 py-1 text-white text-xs rounded border border-white">외곽선</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg rounded-lg flex items-center justify-center"
          onClick={handleFinalGenerate}
          disabled={isGeneratingVideo}
        >
          {isGeneratingVideo ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>영상 생성 중...</span>
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              <span>영상 생성 및 다운로드</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
