import { TrendAnalyzer } from "@/components/shotformai/trend-analyzer"

export default function ContentAnalyzerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">트렌드 분석 및 콘텐츠 제안</h1>
        <p className="text-muted-foreground">
          YouTube 트렌드 분석을 통해 인기 있는 숏폼 콘텐츠의 방향성을 파악하고, 콘텐츠 제작에 도움이 되는 정보를 제공합니다.
        </p>
      </div>
      
      <TrendAnalyzer />
    </div>
  )
} 