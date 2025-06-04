"use client"

interface StepIndicatorProps {
  currentStep: "mode" | "title" | "script" | "media" | "preview"
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const getStepNumber = (step: "mode" | "title" | "script" | "media" | "preview") => {
    switch (step) {
      case "mode":
        return 1
      case "title":
        return 2
      case "script":
        return 3
      case "media":
        return 4
      case "preview":
        return 5
    }
  }

  const currentStepNumber = getStepNumber(currentStep)

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{currentStepNumber}/5</span>
        <span className="text-sm font-medium">숏폼AI</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{
            width: `${(currentStepNumber / 5) * 100}%`,
          }}
        ></div>
      </div>

      <ul className="space-y-3 mt-4">
        <li
          className={`flex items-center p-2 rounded-md ${currentStep === "mode" ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${currentStep === "mode" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            1
          </div>
          모드 선택
        </li>
        <li
          className={`flex items-center p-2 rounded-md ${currentStep === "title" ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${currentStep === "title" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            2
          </div>
          제목 입력
        </li>
        <li
          className={`flex items-center p-2 rounded-md ${currentStep === "script" ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${currentStep === "script" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            3
          </div>
          대본 생성
        </li>
        <li
          className={`flex items-center p-2 rounded-md ${currentStep === "media" ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${currentStep === "media" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            4
          </div>
          미디어 업로드
        </li>
        <li
          className={`flex items-center p-2 rounded-md ${currentStep === "preview" ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${currentStep === "preview" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            5
          </div>
          최종 미리보기
        </li>
      </ul>
    </div>
  )
}
