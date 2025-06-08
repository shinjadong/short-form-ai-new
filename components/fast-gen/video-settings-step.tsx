'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Video, Upload, X } from 'lucide-react'
import { StepData } from './backup/types'
import { useState } from 'react'

interface VideoSettingsStepProps {
  stepData: StepData
  onStepDataChange: (data: Partial<StepData>) => void
}

export default function VideoSettingsStep({
  stepData,
  onStepDataChange
}: VideoSettingsStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const videoFiles = files.filter(file => 
      file.type.startsWith('video/') || file.type.startsWith('image/')
    )
    
    setUploadedFiles(prev => [...prev, ...videoFiles])
    
    // 파일 정보를 stepData에 저장
    const fileInfos = videoFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }))
    
    onStepDataChange({ 
      videoMaterials: [...(stepData.videoMaterials || []), ...fileInfos] 
    })
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    
    const newMaterials = (stepData.videoMaterials || []).filter((_, i) => i !== index)
    onStepDataChange({ videoMaterials: newMaterials })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>비디오 소스</Label>
          <Select 
            value={stepData.videoSource} 
            onValueChange={(value: string) => onStepDataChange({ videoSource: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pexels">Pexels (무료 고품질)</SelectItem>
              <SelectItem value="pixabay">Pixabay (다양한 선택)</SelectItem>
              <SelectItem value="local">로컬 파일</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>화면 비율</Label>
          <Select 
            value={stepData.aspectRatio} 
            onValueChange={(value: string) => onStepDataChange({ aspectRatio: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9:16">세로 (9:16) - 모바일 최적화</SelectItem>
              <SelectItem value="16:9">가로 (16:9) - 데스크톱 최적화</SelectItem>
              <SelectItem value="1:1">정사각형 (1:1) - SNS 최적화</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 로컬 파일 업로드 섹션 */}
      {stepData.videoSource === 'local' && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-2">
            <Label>비디오/이미지 파일 업로드</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                파일 선택
              </Button>
            </div>
          </div>

          {/* 업로드된 파일 목록 */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>업로드된 파일 ({uploadedFiles.length}개)</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-500" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>클립 길이: {stepData.clipDuration}초</Label>
          <Slider
            value={[stepData.clipDuration]}
            onValueChange={(value) => onStepDataChange({ clipDuration: value[0] })}
            max={10}
            min={2}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>연결 모드</Label>
          <Select 
            value={stepData.concatMode} 
            onValueChange={(value: string) => onStepDataChange({ concatMode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">랜덤 순서</SelectItem>
              <SelectItem value="sequential">순차 연결</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Alert>
        <Video className="h-4 w-4" />
        <AlertDescription>
          {stepData.videoSource === 'local' 
            ? '업로드한 파일들을 사용하여 영상을 제작합니다.'
            : '키워드를 기반으로 자동으로 관련 영상을 찾아서 매칭합니다.'
          }
        </AlertDescription>
      </Alert>
    </div>
  )
} 