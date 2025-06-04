import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'
import { Step, StepStatus } from './types'

interface StepNavigationProps {
  steps: Step[]
  currentStep: number
  completedSteps: number[]
  onStepClick: (stepId: number) => void
}

export default function StepNavigation({ 
  steps, 
  currentStep, 
  completedSteps, 
  onStepClick 
}: StepNavigationProps) {
  const getStepStatus = (stepId: number): StepStatus => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id)
        const Icon = step.icon
        
        return (
          <div key={step.id} className="flex items-center">
            <Button
              variant={status === 'current' ? 'default' : status === 'completed' ? 'secondary' : 'outline'}
              size="sm"
              className="flex items-center gap-2 min-w-0"
              onClick={() => onStepClick(step.id)}
            >
              {status === 'completed' ? (
                <CheckCircle className="h-4 w-4" />
              ) : status === 'current' ? (
                <Icon className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{step.title}</span>
            </Button>
            {index < steps.length - 1 && (
              <div className="h-px bg-border w-4 mx-2" />
            )}
          </div>
        )
      })}
    </div>
  )
} 