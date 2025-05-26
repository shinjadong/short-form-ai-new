import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Step, StepData, TypecastActor } from './types'
import ScriptGenerationStep from './script-generation-step'
import VideoSettingsStep from './video-settings-step'
import AudioSettingsStep from './audio-settings-step'
import SubtitleSettingsStep from './subtitle-settings-step'
import VideoGenerationStep from './video-generation-step'

interface StepContentProps {
  currentStep: number
  steps: Step[]
  stepData: StepData
  onStepDataChange: (data: Partial<StepData>) => void
  isGenerating: boolean
  onGenerateScript: () => Promise<void>
  
  // Audio settings props
  useTypecast: boolean
  onUseTypecastChange: (useTypecast: boolean) => void
  typecastActors: TypecastActor[]
  selectedTypecastActor: string
  onTypecastActorChange: (actorId: string) => void
  generatedVoiceUrl: string | null
  isGeneratingVoice: boolean
  onGenerateTypecastVoice: () => Promise<void>
  
  // Video generation props
  generatedVideos: string[]
  generatingStep: string
  taskId: string | null
  videoProgress: number
  onGenerateVideo: () => Promise<void>
}

export default function StepContent({
  currentStep,
  steps,
  stepData,
  onStepDataChange,
  isGenerating,
  onGenerateScript,
  useTypecast,
  onUseTypecastChange,
  typecastActors,
  selectedTypecastActor,
  onTypecastActorChange,
  generatedVoiceUrl,
  isGeneratingVoice,
  onGenerateTypecastVoice,
  generatedVideos,
  generatingStep,
  taskId,
  videoProgress,
  onGenerateVideo
}: StepContentProps) {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScriptGenerationStep
            stepData={stepData}
            onStepDataChange={onStepDataChange}
            isGenerating={isGenerating}
            onGenerateScript={onGenerateScript}
          />
        )
      case 2:
        return (
          <VideoSettingsStep
            stepData={stepData}
            onStepDataChange={onStepDataChange}
          />
        )
      case 3:
        return (
          <AudioSettingsStep
            stepData={stepData}
            onStepDataChange={onStepDataChange}
            useTypecast={useTypecast}
            onUseTypecastChange={onUseTypecastChange}
            typecastActors={typecastActors}
            selectedTypecastActor={selectedTypecastActor}
            onTypecastActorChange={onTypecastActorChange}
            generatedVoiceUrl={generatedVoiceUrl}
            isGeneratingVoice={isGeneratingVoice}
            onGenerateTypecastVoice={onGenerateTypecastVoice}
          />
        )
      case 4:
        return (
          <SubtitleSettingsStep
            stepData={stepData}
            onStepDataChange={onStepDataChange}
          />
        )
      case 5:
        return (
          <VideoGenerationStep
            stepData={stepData}
            generatedVideos={generatedVideos}
            isGenerating={isGenerating}
            generatingStep={generatingStep}
            taskId={taskId}
            videoProgress={videoProgress}
            onGenerateVideo={onGenerateVideo}
          />
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="outline">단계 {currentStep}</Badge>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
        </div>
        <CardDescription>
          {steps[currentStep - 1]?.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStepContent()}
      </CardContent>
    </Card>
  )
} 