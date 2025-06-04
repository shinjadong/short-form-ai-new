import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  canProceed: boolean
  onPrevious: () => void
  onNext: () => void
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  canProceed,
  onPrevious,
  onNext
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        이전
      </Button>
      
      <div className="flex gap-2">
        {currentStep < totalSteps && (
          <Button
            onClick={onNext}
            disabled={!canProceed}
          >
            다음
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
} 