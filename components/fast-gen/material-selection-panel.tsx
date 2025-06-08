'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ISegmentKeyword, IVideoClip, IImageAsset, ISelectedMaterials } from '@/types/video-generation'
import { 
  Film, 
  Image, 
  Check, 
  X, 
  Clock, 
  Sparkles,
  Eye,
  EyeOff,
  Shuffle,
  Wand2
} from 'lucide-react'

interface MaterialSelectionPanelProps {
  segments: ISegmentKeyword[]
  videoClips: IVideoClip[]
  imageAssets: IImageAsset[]
  selectedMaterials: ISelectedMaterials
  onMaterialSelect: (segmentId: number, material: { type: 'video' | 'image', data: IVideoClip | IImageAsset }) => void
  onAutoSelect: () => void
  disabled?: boolean
}

const MaterialSelectionPanel: React.FC<MaterialSelectionPanelProps> = ({
  segments,
  videoClips,
  imageAssets,
  selectedMaterials,
  onMaterialSelect,
  onAutoSelect,
  disabled = false
}) => {
  const [activeSegment, setActiveSegment] = useState(0)
  const [showPreview, setShowPreview] = useState(true)
  const [materialType, setMaterialType] = useState<'video' | 'image'>('video')

  // 현재 세그먼트의 선택된 소재
  const currentSelection = selectedMaterials[activeSegment]

  // 세그먼트별 자동 추천 소재 가져오기
  const getRecommendedMaterials = (segment: ISegmentKeyword) => {
    const keywords = segment.keywords
    
    // 키워드와 매칭되는 비디오/이미지 찾기
    const matchedVideos = videoClips.filter(video => 
      keywords.some(keyword => 
        video.title?.toLowerCase().includes(keyword.toLowerCase())
      )
    ).slice(0, 3)

    const matchedImages = imageAssets.filter(image => 
      keywords.some(keyword => 
        image.title?.toLowerCase().includes(keyword.toLowerCase())
      )
    ).slice(0, 3)

    return { videos: matchedVideos, images: matchedImages }
  }

  // 시간 포맷 변환
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 자동 선택 로직
  const handleAutoSelect = () => {
    segments.forEach((segment, index) => {
      const recommended = getRecommendedMaterials(segment)
      
      // 비디오 우선, 없으면 이미지 선택
      if (recommended.videos.length > 0) {
        onMaterialSelect(index, { type: 'video', data: recommended.videos[0] })
      } else if (recommended.images.length > 0) {
        onMaterialSelect(index, { type: 'image', data: recommended.images[0] })
      } else if (videoClips.length > 0) {
        // 추천이 없으면 랜덤 선택
        const randomVideo = videoClips[Math.floor(Math.random() * videoClips.length)]
        onMaterialSelect(index, { type: 'video', data: randomVideo })
      }
    })
  }

  const currentSegment = segments[activeSegment]
  if (!currentSegment) return null

  const recommended = getRecommendedMaterials(currentSegment)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Film className="w-5 h-5 text-orange-600" />
              구간별 소재 선택
            </CardTitle>
            <CardDescription>
              각 구간에 맞는 비디오나 이미지를 선택하세요
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              disabled={disabled}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              미리보기
            </Button>
            <Button
              onClick={handleAutoSelect}
              size="sm"
              disabled={disabled}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              자동 선택
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 구간 선택 탭 */}
        <ScrollArea className="w-full pb-2">
          <div className="flex gap-2">
            {segments.map((segment, index) => (
              <Button
                key={index}
                variant={activeSegment === index ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSegment(index)}
                disabled={disabled}
                className="min-w-[120px]"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium">구간 {index + 1}</span>
                  <span className="text-xs opacity-70">
                    {formatTime(segment.start_time)} - {formatTime(segment.end_time)}
                  </span>
                  {selectedMaterials[index] && (
                    <Badge variant="secondary" className="h-4 px-1">
                      {selectedMaterials[index].type === 'video' ? '비디오' : '이미지'}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* 현재 구간 정보 */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-sm">구간 {activeSegment + 1} 스크립트</h4>
              <p className="text-sm text-gray-600 mt-1">{currentSegment.text}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {(currentSegment.end_time - currentSegment.start_time).toFixed(1)}초
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {currentSegment.keywords.map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* 소재 타입 선택 */}
        <Tabs value={materialType} onValueChange={(v) => setMaterialType(v as 'video' | 'image')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              비디오 ({videoClips.length})
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              이미지 ({imageAssets.length})
            </TabsTrigger>
          </TabsList>

          {/* 비디오 선택 */}
          <TabsContent value="video" className="mt-4">
            {recommended.videos.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  추천 비디오
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {recommended.videos.map((video) => (
                    <MaterialCard
                      key={video.id}
                      material={video}
                      type="video"
                      isSelected={currentSelection?.data.id === video.id}
                      onSelect={() => onMaterialSelect(activeSegment, { type: 'video', data: video })}
                      showPreview={showPreview}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-2 block">전체 비디오</Label>
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-4">
                  {videoClips.map((video) => (
                    <MaterialCard
                      key={video.id}
                      material={video}
                      type="video"
                      isSelected={currentSelection?.data.id === video.id}
                      onSelect={() => onMaterialSelect(activeSegment, { type: 'video', data: video })}
                      showPreview={showPreview}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* 이미지 선택 */}
          <TabsContent value="image" className="mt-4">
            {recommended.images.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  추천 이미지
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {recommended.images.map((image) => (
                    <MaterialCard
                      key={image.id}
                      material={image}
                      type="image"
                      isSelected={currentSelection?.data.id === image.id}
                      onSelect={() => onMaterialSelect(activeSegment, { type: 'image', data: image })}
                      showPreview={showPreview}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-2 block">전체 이미지</Label>
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-4">
                  {imageAssets.map((image) => (
                    <MaterialCard
                      key={image.id}
                      material={image}
                      type="image"
                      isSelected={currentSelection?.data.id === image.id}
                      onSelect={() => onMaterialSelect(activeSegment, { type: 'image', data: image })}
                      showPreview={showPreview}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        {/* 선택 상태 요약 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">선택 진행 상황</span>
            <span className="text-sm text-blue-700">
              {Object.keys(selectedMaterials).length} / {segments.length} 구간
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
              style={{ width: `${(Object.keys(selectedMaterials).length / segments.length) * 100}%` }}
            />
          </div>
          {Object.keys(selectedMaterials).length === segments.length && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-700">
              <Check className="w-4 h-4" />
              모든 구간에 소재가 선택되었습니다
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// 개별 소재 카드 컴포넌트
interface MaterialCardProps {
  material: IVideoClip | IImageAsset
  type: 'video' | 'image'
  isSelected: boolean
  onSelect: () => void
  showPreview: boolean
  disabled?: boolean
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  type,
  isSelected,
  onSelect,
  showPreview,
  disabled
}) => {
  const isVideo = type === 'video'
  const videoMaterial = material as IVideoClip

  return (
    <div
      className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect()}
    >
      {/* 썸네일 */}
      {showPreview && (
        <div className="aspect-video bg-gray-100 relative">
          <img
            src={material.thumbnail || '/placeholder.jpg'}
            alt={material.title || 'Material'}
            className="w-full h-full object-cover"
          />
          {isVideo && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Film className="w-8 h-8 text-white opacity-70" />
            </div>
          )}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      )}

      {/* 정보 */}
      <div className="p-3">
        <p className="text-sm font-medium line-clamp-2">
          {material.title || `${type === 'video' ? '비디오' : '이미지'} ${material.id}`}
        </p>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline" className="text-xs">
            {material.source}
          </Badge>
          {isVideo && videoMaterial.duration && (
            <span className="text-xs text-gray-500">
              {Math.round(videoMaterial.duration)}초
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MaterialSelectionPanel
