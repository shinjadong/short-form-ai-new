import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { StepData } from './types'

interface SubtitleSettingsStepProps {
  stepData: StepData
  onStepDataChange: (data: Partial<StepData>) => void
}

export default function SubtitleSettingsStep({
  stepData,
  onStepDataChange
}: SubtitleSettingsStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="subtitle-enabled"
          checked={stepData.subtitleEnabled}
          onCheckedChange={(checked: boolean | string) => 
            onStepDataChange({ subtitleEnabled: checked === true })
          }
        />
        <Label htmlFor="subtitle-enabled">자막 활성화</Label>
      </div>

      {stepData.subtitleEnabled && (
        <div className="space-y-4 pl-6 border-l-2 border-muted">
          <div className="space-y-2">
            <Label>자막 위치</Label>
            <Select 
              value={stepData.subtitlePosition} 
              onValueChange={(value: string) => onStepDataChange({ subtitlePosition: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">상단</SelectItem>
                <SelectItem value="center">중앙</SelectItem>
                <SelectItem value="bottom">하단 (권장)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>글자 크기: {stepData.fontSize}px</Label>
              <Slider
                value={[stepData.fontSize]}
                onValueChange={(value) => onStepDataChange({ fontSize: value[0] })}
                max={100}
                min={20}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>외곽선 굵기: {stepData.strokeWidth}px</Label>
              <Slider
                value={[stepData.strokeWidth]}
                onValueChange={(value) => onStepDataChange({ strokeWidth: value[0] })}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>글자 색상</Label>
              <Input
                type="color"
                value={stepData.textColor}
                onChange={(e) => onStepDataChange({ textColor: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label>외곽선 색상</Label>
              <Input
                type="color"
                value={stepData.strokeColor}
                onChange={(e) => onStepDataChange({ strokeColor: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="text-background"
              checked={stepData.textBackgroundColor}
              onCheckedChange={(checked: boolean | string) => 
                onStepDataChange({ textBackgroundColor: checked === true })
              }
            />
            <Label htmlFor="text-background">배경 박스 표시</Label>
          </div>
        </div>
      )}
    </div>
  )
} 