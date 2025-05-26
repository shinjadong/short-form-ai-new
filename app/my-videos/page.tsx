'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import AuthGuard from '@/components/auth-guard'
import NavigationHeader from '@/components/navigation-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Video, 
  Download, 
  Share, 
  Trash2, 
  Play,
  Calendar,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface VideoProject {
  id: string
  title: string
  subject: string
  status: 'draft' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  video_url?: string
  thumbnail_url?: string
}

export default function MyVideosPage() {
  const { user } = useAuth()
  const [videos, setVideos] = useState<VideoProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Supabase에서 사용자의 비디오 목록 가져오기
    // 현재는 더미 데이터로 대체
    const fetchVideos = async () => {
      setLoading(false)
      // 실제 구현 시:
      // const { data } = await supabase
      //   .from('video_projects')
      //   .select('*')
      //   .eq('user_id', user?.id)
      //   .order('created_at', { ascending: false })
      // setVideos(data || [])
    }

    if (user) {
      fetchVideos()
    }
  }, [user])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">완료</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">처리중</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">실패</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">초안</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <NavigationHeader />
          <main className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">내 비디오</h1>
                <p className="text-gray-600 mt-2">
                  생성한 비디오들을 관리하고 다운로드하세요
                </p>
              </div>
              <Button asChild>
                <Link href="/create">
                  <Plus className="mr-2 h-4 w-4" />
                  새 비디오 생성
                </Link>
              </Button>
            </div>

            {/* Empty State */}
            {videos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    아직 생성된 비디오가 없습니다
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    첫 번째 AI 비디오를 만들어보세요. 주제만 입력하면 30초 만에 완성됩니다!
                  </p>
                  <div className="space-y-4">
                    <Button size="lg" asChild>
                      <Link href="/create">
                        <Plus className="mr-2 h-5 w-5" />
                        첫 비디오 생성하기
                      </Link>
                    </Button>
                    <div className="text-sm text-gray-500">
                      💡 팁: 구체적인 주제일수록 더 좋은 결과를 얻을 수 있습니다
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Video Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 relative">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(video.status)}
                      </div>
                      {video.status === 'completed' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {video.subject}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(video.created_at)}
                      </div>
                      
                      <div className="flex space-x-2">
                        {video.status === 'completed' && video.video_url && (
                          <>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-1" />
                              다운로드
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Share className="h-4 w-4 mr-1" />
                              공유
                            </Button>
                          </>
                        )}
                        {video.status === 'processing' && (
                          <Button size="sm" variant="outline" className="flex-1" disabled>
                            <Clock className="h-4 w-4 mr-1" />
                            처리중...
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination - 실제 구현 시 추가 */}
            {videos.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="text-sm text-gray-500">
                  총 {videos.length}개의 비디오
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
} 