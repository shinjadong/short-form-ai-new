import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkles } from 'lucide-react'

interface ProgressHeaderProps {
  completedSteps: number[]
  totalSteps: number
}

export default function ProgressHeader({ completedSteps, totalSteps }: ProgressHeaderProps) {
  const progressPercentage = (completedSteps.length / totalSteps) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          숏폼AI 비디오 생성
        </CardTitle>
        <CardDescription>
          단계별로 설정을 완료하여 고품질 숏폼 비디오를 생성하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progressPercentage} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>진행률</span>
            <span>{completedSteps.length}/{totalSteps} 단계 완료</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 