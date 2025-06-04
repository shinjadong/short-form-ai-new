"use client"

import { useState } from "react"
import OpenAI from "openai"
import { useToast } from "@/hooks/use-toast"

export function useOpenAI() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    dangerouslyAllowBrowser: true // 브라우저에서 직접 API 요청을 허용
  })

  const generateTitles = async (keywords: string): Promise<string[] | null> => {
    if (!openai.apiKey || openai.apiKey === "your-api-key-here") {
      toast({
        title: "API 키 필요",
        description: "OpenAI API 키를 설정해주세요.",
        variant: "destructive",
      })
      return null
    }

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
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "당신은 쇼츠 영상 제목을 생성하는 전문가입니다. 사용자가 제공하는 키워드를 기반으로 참신하고 매력적인 쇼츠 영상 제목 5개를 생성해주세요. 각 제목은 쉼표로 구분하여 제공하세요."
          },
          {
            role: "user",
            content: `다음 키워드를 기반으로 쇼츠 영상 제목 5개를 제안해주세요: ${keywords}`
          }
        ],
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content || ""
      // 쉼표나 줄바꿈으로 분리된 제목 목록을 배열로 변환
      const titles = content
        .split(/,|\n/)
        .map(title => title.trim())
        .filter(title => title && !title.match(/^\d+\./) && !title.match(/^제목\s*\d+:/i))
        .map(title => title.replace(/^["-\s]+|["-\s]+$/g, ""))
        .slice(0, 5) // 최대 5개만 사용

      if (titles.length === 0) {
        // 파싱이 제대로 되지 않은 경우 전체 텍스트를 한 제목으로 취급
        return [content.trim()]
      }

      return titles
    } catch (error) {
      console.error("제목 생성 오류:", error)
      toast({
        title: "제목 생성 실패",
        description: "OpenAI API 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const generateScript = async (title: string, mode: "default" | "shorter" | "longer"): Promise<string | null> => {
    if (!openai.apiKey || openai.apiKey === "your-api-key-here") {
      toast({
        title: "API 키 필요",
        description: "OpenAI API 키를 설정해주세요.",
        variant: "destructive",
      })
      return null
    }

    if (!title.trim()) {
      toast({
        title: "제목 필요",
        description: "제목을 입력해주세요.",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)

    let systemPrompt = "당신은 쇼츠 영상 스크립트 작성 전문가입니다. 사용자가 제공한 제목에 맞는 짧고 매력적인 스크립트를 작성해주세요."
    
    if (mode === "shorter") {
      systemPrompt += " 스크립트는 30초 이내로 읽을 수 있는 매우 짧은 형태로 작성하세요. 핵심 메시지 3가지만 간결하게 전달해주세요."
    } else if (mode === "longer") {
      systemPrompt += " 스크립트는 1분 내외로 읽을 수 있는 형태로 작성하세요. 도입부, 본론, 결론을 명확히 구성하고 실용적인 팁을 포함해주세요."
    } else {
      systemPrompt += " 스크립트는 약 45초 내외로 읽을 수 있는 형태로 작성하세요. 핵심 메시지를 명확하게 전달해주세요."
    }

    systemPrompt += " 스크립트 마지막에는 '댓글에 기술창업을 남겨주세요' 라는 CTA를 포함시켜주세요. 스크립트만 반환하고 추가 설명은 하지 마세요."

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `다음 제목에 맞는 쇼츠 영상 스크립트를 작성해주세요: "${title}"` }
        ],
        temperature: 0.7,
      })

      const script = response.choices[0]?.message?.content || ""
      return script.trim()
    } catch (error) {
      console.error("스크립트 생성 오류:", error)
      toast({
        title: "스크립트 생성 실패",
        description: "OpenAI API 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const generateAudioUrl = (script: string, voiceType: string = "male1"): { audioUrl: string; duration: number } => {
    // 실제 구현에서는 TTS API 연동 필요
    // 현재는 더미 데이터만 제공
    const duration = Math.max(Math.floor(script.length / 10), 5)
    const audioUrl = `https://example.com/audio/${Date.now()}.mp3`

    return {
      audioUrl,
      duration
    }
  }

  return {
    isLoading,
    generateTitles,
    generateScript,
    generateAudioUrl
  }
} 