"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, Upload, Download, Loader2 } from "lucide-react"
import { useState } from "react"

interface ActionButtonProps {
  type: "next" | "back"
  step?: "mode" | "title" | "script" | "media" | "preview"
  onClick: () => void
  isMobile?: boolean
}

export function ActionButton({ type, step, onClick, isMobile = false }: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (type === "back") {
    return (
      <Button variant="outline" onClick={onClick} className={`gap-2 ${isMobile ? "w-12 p-0" : ""}`}>
        <ChevronLeft className="h-4 w-4" />
        {!isMobile && "이전 단계"}
      </Button>
    )
  }

  // Next button based on current step
  switch (step) {
    case "mode":
      return (
        <Button
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white ${isMobile ? "py-3" : "py-6 text-lg"} rounded-lg flex items-center justify-center`}
          onClick={onClick}
        >
          <span>다음 단계</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )
    case "title":
      return (
        <Button
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white ${isMobile ? "py-3" : "py-6 text-lg"} rounded-lg flex items-center justify-center`}
          onClick={onClick}
        >
          <span>대본 생성하기</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )
    case "script":
      return (
        <Button
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white ${isMobile ? "py-3" : "py-6 text-lg"} rounded-lg flex items-center justify-center`}
          onClick={() => {
            setIsLoading(true)
            // Simulate loading for demo purposes
            setTimeout(() => {
              setIsLoading(false)
              onClick()
            }, 1000)
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>음성 변환 중...</span>
            </>
          ) : (
            <>
              <span>미디어 업로드하기</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      )
    case "media":
      return (
        <label className="w-full">
          <div
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white ${isMobile ? "py-3" : "py-6 text-lg"} rounded-lg flex items-center justify-center cursor-pointer`}
          >
            <Upload className="mr-2 h-5 w-5" />
            <span>파일 선택하기</span>
          </div>
          <input type="file" accept="image/*,video/*" className="hidden" onChange={() => onClick()} />
        </label>
      )
    case "preview":
      return (
        <Button
          className={`w-full bg-green-500 hover:bg-green-600 text-white ${isMobile ? "py-3" : "py-6 text-lg"} rounded-lg flex items-center justify-center`}
          onClick={() => {
            setIsLoading(true)
            // Simulate loading for demo purposes
            setTimeout(() => {
              setIsLoading(false)
              alert("영상이 생성되었습니다!")
            }, 2000)
          }}
          disabled={isLoading}
        >
          {isLoading ? (
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
      )
    default:
      return (
        <Button
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white ${isMobile ? "py-3" : "py-6 text-lg"} rounded-lg flex items-center justify-center`}
          onClick={onClick}
        >
          <span>다음 단계</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )
  }
}
