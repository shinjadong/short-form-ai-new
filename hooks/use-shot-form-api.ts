"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface TitleResponse {
  status: string
  data: {
    titles: string[]
  }
  message?: string
}

interface ScriptResponse {
  status: string
  data: {
    script: string
  }
  message?: string
}

interface VoiceResponse {
  status: string
  data: {
    audioUrl: string
    duration?: number
  }
  message?: string
}

export function useShotFormApi() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const generateTitle = async (keywords: string): Promise<string[] | null> => {
    if (!keywords.trim()) {
      toast({
        title: "키워드 필요",
        description: "키워드를 입력해주세요.",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/shotformai/title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords }),
      })

      if (!response.ok) {
        throw new Error("제목 생성 실패")
      }

      const data = (await response.json()) as TitleResponse

      if (data.status === "success") {
        return data.data.titles
      } else {
        toast({
          title: "제목 생성 실패",
          description: data.message || "제목을 생성하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
        return null
      }
    } catch (error) {
      console.error("제목 생성 오류:", error)
      toast({
        title: "제목 생성 실패",
        description: "제목을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const generateScript = async (title: string, mode: "default" | "shorter" | "longer"): Promise<string | null> => {
    if (!title.trim()) {
      toast({
        title: "제목 필요",
        description: "제목을 입력해주세요.",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/shotformai/script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, mode }),
      })

      if (!response.ok) {
        throw new Error("스크립트 생성 실패")
      }

      const data = (await response.json()) as ScriptResponse

      if (data.status === "success") {
        return data.data.script
      } else {
        toast({
          title: "스크립트 생성 실패",
          description: data.message || "스크립트를 생성하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
        return null
      }
    } catch (error) {
      console.error("스크립트 생성 오류:", error)
      toast({
        title: "스크립트 생성 실패",
        description: "스크립트를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const generateVoice = async (
    script: string,
    voiceType = "male1",
  ): Promise<{ audioUrl: string; duration: number } | null> => {
    if (!script.trim()) {
      toast({
        title: "스크립트 필요",
        description: "스크립트를 입력해주세요.",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/shotformai/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script, voiceType }),
      })

      if (!response.ok) {
        throw new Error("음성 합성 실패")
      }

      const data = (await response.json()) as VoiceResponse

      if (data.status === "success") {
        return {
          audioUrl: data.data.audioUrl,
          duration: data.data.duration || Math.max(script.length / 4, 5),
        }
      } else {
        toast({
          title: "음성 합성 실패",
          description: data.message || "음성을 합성하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
        return null
      }
    } catch (error) {
      console.error("음성 합성 오류:", error)
      toast({
        title: "음성 합성 실패",
        description: "음성을 합성하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    generateTitle,
    generateScript,
    generateVoice,
  }
}
