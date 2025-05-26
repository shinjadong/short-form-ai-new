"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Wand2, Repeat } from "lucide-react"

interface ModeSelectorProps {
  selectedMode: "generate" | "reverse"
  onSelectMode: (mode: "generate" | "reverse") => void
}

export function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card
        className={`cursor-pointer border-2 transition-all ${
          selectedMode === "generate" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"
        }`}
        onClick={() => onSelectMode("generate")}
      >
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Wand2 className="h-16 w-16 mb-4 text-blue-500" />
          <h3 className="text-xl font-bold mb-2">생성 모드</h3>
          <p className="text-gray-600 mb-4">
            AI가 제목과 스크립트를 생성하고, 업로드한 미디어에 텍스트와 음성을 입혀 숏폼 영상을 만듭니다.
          </p>
          <Button variant={selectedMode === "generate" ? "default" : "outline"} className="mt-2">
            선택하기 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer border-2 transition-all ${
          selectedMode === "reverse" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"
        }`}
        onClick={() => onSelectMode("reverse")}
      >
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Repeat className="h-16 w-16 mb-4 text-purple-500" />
          <h3 className="text-xl font-bold mb-2">리버싱 모드</h3>
          <p className="text-gray-600 mb-4">
            기존 영상의 URL을 입력하면 AI가 분석하여 더 개선된 스크립트와 이미지를 생성합니다.
          </p>
          <Button variant={selectedMode === "reverse" ? "default" : "outline"} className="mt-2">
            선택하기 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
