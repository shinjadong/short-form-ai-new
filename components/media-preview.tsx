"use client"

interface MediaPreviewProps {
  mediaPreview: string | null
  mediaFile: File | null
  title: string
  ctaText: string
  titlePosition: "top" | "middle" | "bottom" | "custom"
  ctaPosition: "top" | "middle" | "bottom" | "custom"
  titleStyle: "default" | "highlight" | "shadow" | "outline"
  ctaStyle: "default" | "highlight" | "shadow" | "outline"
}

export function MediaPreview({
  mediaPreview,
  mediaFile,
  title,
  ctaText,
  titlePosition,
  ctaPosition,
  titleStyle,
  ctaStyle,
}: MediaPreviewProps) {
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
  const getPositionClass = (position: "top" | "middle" | "bottom" | "custom") => {
    switch (position) {
      case "top":
        return "top-4"
      case "middle":
        return "top-1/2 -translate-y-1/2"
      case "bottom":
        return "bottom-4"
      case "custom":
        return "" // 커스텀 위치는 별도 처리
      default:
        return "top-4"
    }
  }

  return (
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
      <div className={`absolute ${getPositionClass(ctaPosition)} left-0 right-0 text-center z-10 pointer-events-none`}>
        <div className={`inline-block px-3 py-1 rounded text-sm ${getTextStyleClass(ctaStyle)}`}>{ctaText}</div>
      </div>

      {/* 텍스트 이동 표시 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
        <p className="text-white text-sm bg-black bg-opacity-70 px-3 py-1 rounded">
          텍스트 위치는 옆의 컨트롤에서 조정할 수 있습니다
        </p>
      </div>
    </div>
  )
}
