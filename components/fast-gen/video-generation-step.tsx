import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Rocket, 
  Loader2, 
  Download, 
  Eye, 
  Video 
} from 'lucide-react'
import { StepData } from './types'

interface VideoGenerationStepProps {
  stepData: StepData
  generatedVideos: string[]
  isGenerating: boolean
  generatingStep: string
  taskId: string | null
  videoProgress: number
  onGenerateVideo: () => Promise<void>
}

export default function VideoGenerationStep({
  stepData,
  generatedVideos,
  isGenerating,
  generatingStep,
  taskId,
  videoProgress,
  onGenerateVideo
}: VideoGenerationStepProps) {
  if (generatedVideos.length > 0) {
    return (
      <>
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            비디오 생성이 완료되었습니다!
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {generatedVideos.map((videoUrl, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span className="font-medium">생성된 비디오 {index + 1}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-2 h-4 w-4" />
                      미리보기
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={videoUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      다운로드
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <Alert>
        <Rocket className="h-4 w-4" />
        <AlertDescription>
          모든 설정이 완료되었습니다. OpenAI로 생성된 스크립트를 사용하여 비디오를 생성합니다!
        </AlertDescription>
      </Alert>

      <div className="p-4 bg-muted rounded-lg space-y-2">
        <h4 className="font-medium">생성 설정 요약</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>화면 비율: {stepData.aspectRatio}</div>
          <div>비디오 소스: {stepData.videoSource}</div>
          <div>자막: {stepData.subtitleEnabled ? '활성화' : '비활성화'}</div>
          <div>클립 길이: {stepData.clipDuration}초</div>
        </div>
      </div>

      {isGenerating && (
        <div className="space-y-4">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">{generatingStep}</p>
            {taskId && (
              <p className="text-xs text-muted-foreground mt-1">
                태스크 ID: {taskId}
              </p>
            )}
          </div>
          {videoProgress > 0 && (
            <div className="space-y-2">
              <Progress value={videoProgress} className="w-full" />
              <div className="text-center text-sm text-muted-foreground">
                진행률: {videoProgress}%
              </div>
            </div>
          )}
        </div>
      )}

      <Button 
        onClick={onGenerateVideo} 
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            비디오 생성 중...
          </>
        ) : (
          <>
            <Rocket className="mr-2 h-4 w-4" />
            비디오 생성 시작
          </>
        )}
      </Button>
    </>
  )
} 