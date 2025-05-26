import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Music } from 'lucide-react'
import { StepData, TypecastActor } from './types'
import TypecastVoiceSettings from './typecast-voice-settings'

interface AudioSettingsStepProps {
  stepData: StepData
  onStepDataChange: (data: Partial<StepData>) => void
  useTypecast: boolean
  onUseTypecastChange: (useTypecast: boolean) => void
  typecastActors: TypecastActor[]
  selectedTypecastActor: string
  onTypecastActorChange: (actorId: string) => void
  generatedVoiceUrl: string | null
  isGeneratingVoice: boolean
  onGenerateTypecastVoice: () => Promise<void>
}

export default function AudioSettingsStep({
  stepData,
  onStepDataChange,
  useTypecast,
  onUseTypecastChange,
  typecastActors,
  selectedTypecastActor,
  onTypecastActorChange,
  generatedVoiceUrl,
  isGeneratingVoice,
  onGenerateTypecastVoice
}: AudioSettingsStepProps) {
  return (
    <div className="space-y-6">
      {/* 음성 엔진 선택 */}
      <div className="space-y-4">
        <Label className="text-base font-medium">음성 엔진 선택</Label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="azure-tts"
              name="voice-engine"
              checked={!useTypecast}
              onChange={() => onUseTypecastChange(false)}
              className="h-4 w-4"
            />
            <Label htmlFor="azure-tts">Azure TTS (기본)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="typecast-ai"
              name="voice-engine"
              checked={useTypecast}
              onChange={() => onUseTypecastChange(true)}
              className="h-4 w-4"
            />
            <Label htmlFor="typecast-ai">TypeCast AI (고품질)</Label>
          </div>
        </div>
      </div>

      {/* Azure TTS 설정 */}
      {!useTypecast && (
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label>Azure TTS 음성 선택</Label>
            <Select 
              value={stepData.voiceName} 
              onValueChange={(value: string) => onStepDataChange({ voiceName: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="음성을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko-KR-SunHiNeural">한국어 - 선희 (여성, 친근함)</SelectItem>
                <SelectItem value="ko-KR-InJoonNeural">한국어 - 인준 (남성, 안정감)</SelectItem>
                <SelectItem value="ko-KR-HyunsuNeural">한국어 - 현수 (남성, 젊음)</SelectItem>
                <SelectItem value="ko-KR-BongJinNeural">한국어 - 봉진 (여성, 전문성)</SelectItem>
                <SelectItem value="ko-KR-HyunsuMultilingualNeural-Male">한국어 - 현수 다국어 (남성)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* TypeCast AI 설정 */}
      {useTypecast && (
        <TypecastVoiceSettings
          typecastActors={typecastActors}
          selectedTypecastActor={selectedTypecastActor}
          onActorChange={onTypecastActorChange}
          generatedVoiceUrl={generatedVoiceUrl}
          isGeneratingVoice={isGeneratingVoice}
          onGenerateVoice={onGenerateTypecastVoice}
          hasScript={!!stepData.script}
          scriptText={stepData.script}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>음성 볼륨: {stepData.voiceVolume}</Label>
          <Slider
            value={[stepData.voiceVolume]}
            onValueChange={(value) => onStepDataChange({ voiceVolume: value[0] })}
            max={2.0}
            min={0.1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>음성 속도: {stepData.voiceRate}</Label>
          <Slider
            value={[stepData.voiceRate]}
            onValueChange={(value) => onStepDataChange({ voiceRate: value[0] })}
            max={2.0}
            min={0.5}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>배경음악</Label>
        <Select 
          value={stepData.bgmType} 
          onValueChange={(value: string) => onStepDataChange({ bgmType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">없음</SelectItem>
            <SelectItem value="random">랜덤 BGM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {stepData.bgmType !== 'none' && (
        <div className="space-y-2">
          <Label>BGM 볼륨: {stepData.bgmVolume}</Label>
          <Slider
            value={[stepData.bgmVolume]}
            onValueChange={(value) => onStepDataChange({ bgmVolume: value[0] })}
            max={1.0}
            min={0.0}
            step={0.1}
            className="w-full"
          />
        </div>
      )}

      <Alert>
        <Music className="h-4 w-4" />
        <AlertDescription>
          고품질 AI 음성으로 자연스러운 나레이션을 생성합니다.
        </AlertDescription>
      </Alert>
    </div>
  )
} 