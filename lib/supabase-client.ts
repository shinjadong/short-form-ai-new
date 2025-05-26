import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 클라이언트 사이드용 Supabase 클라이언트
export const createClientSupabase = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// 기본 Supabase 클라이언트 (클라이언트 사이드)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 편의 함수들
export const getUser = async () => {
  const supabase = createClientSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const supabase = createClientSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// 사용량 제한 체크 함수
export const checkUsageLimit = async (userId: string) => {
  const supabase = createClientSupabase()
  const { data, error } = await supabase.rpc('check_user_usage_limit', {
    user_uuid: userId
  })
  
  if (error) {
    console.error('사용량 체크 오류:', error)
    return false
  }
  
  return data
}

// 사용량 증가 함수
export const incrementUsage = async (userId: string) => {
  const supabase = createClientSupabase()
  const { error } = await supabase.rpc('increment_user_usage', {
    user_uuid: userId
  })
  
  if (error) {
    console.error('사용량 증가 오류:', error)
    return false
  }
  
  return true
}

// 프로젝트 CRUD 함수들
export const createVideoProject = async (project: Database['public']['Tables']['video_projects']['Insert']) => {
  const supabase = createClientSupabase()
  const { data, error } = await supabase
    .from('video_projects')
    .insert(project)
    .select()
    .single()
  
  if (error) {
    console.error('프로젝트 생성 오류:', error)
    return null
  }
  
  return data
}

export const getVideoProjects = async (userId: string) => {
  const supabase = createClientSupabase()
  const { data, error } = await supabase
    .from('video_projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('프로젝트 조회 오류:', error)
    return []
  }
  
  return data || []
}

export const updateVideoProject = async (id: string, updates: Database['public']['Tables']['video_projects']['Update']) => {
  const supabase = createClientSupabase()
  const { data, error } = await supabase
    .from('video_projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('프로젝트 업데이트 오류:', error)
    return null
  }
  
  return data
}

// 템플릿 함수들
export const getVideoTemplates = async () => {
  const supabase = createClientSupabase()
  const { data, error } = await supabase
    .from('video_templates')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('usage_count', { ascending: false })
  
  if (error) {
    console.error('템플릿 조회 오류:', error)
    return []
  }
  
  return data || []
}

// 작업 추적 함수들
export const createVideoTask = async (task: Database['public']['Tables']['video_tasks']['Insert']) => {
  const supabase = createClientSupabase()
  const { data, error } = await supabase
    .from('video_tasks')
    .insert(task)
    .select()
    .single()
  
  if (error) {
    console.error('작업 생성 오류:', error)
    return null
  }
  
  return data
}

export const updateVideoTask = async (id: string, updates: Database['public']['Tables']['video_tasks']['Update']) => {
  const supabase = createClientSupabase()
  const { data, error } = await supabase
    .from('video_tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('작업 업데이트 오류:', error)
    return null
  }
  
  return data
}

export const getVideoTasks = async (projectId: string) => {
  const supabase = createClientSupabase()
  const { data, error } = await supabase
    .from('video_tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('작업 조회 오류:', error)
    return []
  }
  
  return data || []
}

// === Supabase Storage 관련 함수들 ===

// 파일 업로드 함수
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File | Blob,
  options?: {
    cacheControl?: string
    contentType?: string
    upsert?: boolean
  }
) => {
  const supabase = createClientSupabase()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType,
      upsert: options?.upsert || false
    })

  if (error) {
    console.error('파일 업로드 오류:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

// 파일 다운로드 URL 생성
export const getFileUrl = (bucket: string, filePath: string) => {
  const supabase = createClientSupabase()
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

// 서명된 다운로드 URL 생성 (사용자 인증 필요한 파일용)
export const getSignedFileUrl = async (
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
) => {
  const supabase = createClientSupabase()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error('서명된 URL 생성 오류:', error)
    return null
  }

  return data.signedUrl
}

// 파일 삭제
export const deleteFile = async (bucket: string, filePaths: string[]) => {
  const supabase = createClientSupabase()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove(filePaths)

  if (error) {
    console.error('파일 삭제 오류:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

// 폴더 내 파일 목록 조회
export const listFiles = async (
  bucket: string,
  folderPath: string = '',
  options?: {
    limit?: number
    offset?: number
    sortBy?: { column: string; order: 'asc' | 'desc' }
  }
) => {
  const supabase = createClientSupabase()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folderPath, {
      limit: options?.limit,
      offset: options?.offset,
      sortBy: options?.sortBy
    })

  if (error) {
    console.error('파일 목록 조회 오류:', error)
    return []
  }

  return data || []
}

// 영상 파일 저장 (완료된 영상을 Supabase Storage에 저장)
export const saveGeneratedVideo = async (
  userId: string,
  projectId: string,
  videoFile: File | Blob,
  metadata: {
    fileName: string
    duration?: number
    resolution?: string
    format?: string
  }
) => {
  const supabase = createClientSupabase()
  
  try {
    // 파일 경로 생성: videos/{userId}/{projectId}/{fileName}
    const filePath = `videos/${userId}/${projectId}/${metadata.fileName}`
    
    // Supabase Storage에 업로드
    const uploadResult = await uploadFile('generated-videos', filePath, videoFile, {
      contentType: 'video/mp4',
      upsert: true
    })

    if (uploadResult.error) {
      throw uploadResult.error
    }

    // 공개 URL 생성
    const publicUrl = getFileUrl('generated-videos', filePath)
    
    // 데이터베이스에 영상 정보 저장
    const { data: videoRecord, error: dbError } = await supabase
      .from('generated_videos')
      .insert({
        project_id: projectId,
        user_id: userId,
        file_name: metadata.fileName,
        file_url: publicUrl,
        file_size: videoFile.size,
        duration: metadata.duration,
        resolution: metadata.resolution,
        format: metadata.format || 'mp4',
        is_public: false,
        download_count: 0
      })
      .select()
      .single()

    if (dbError) {
      console.error('데이터베이스 저장 오류:', dbError)
      // 업로드된 파일 삭제 (롤백)
      await deleteFile('generated-videos', [filePath])
      throw dbError
    }

    return {
      success: true,
      data: {
        videoRecord,
        fileUrl: publicUrl,
        filePath
      }
    }

  } catch (error) {
    console.error('영상 저장 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '영상 저장 중 오류가 발생했습니다.'
    }
  }
}

// 사용자의 생성된 영상 목록 조회
export const getUserGeneratedVideos = async (userId: string, limit: number = 20) => {
  const supabase = createClientSupabase()
  
  const { data, error } = await supabase
    .from('generated_videos')
    .select(`
      *,
      video_projects (
        title,
        subject
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('영상 목록 조회 오류:', error)
    return []
  }

  return data || []
}

// 영상 다운로드 카운트 증가
export const incrementDownloadCount = async (videoId: string) => {
  const supabase = createClientSupabase()
  
  // 현재 카운트 조회
  const { data: currentVideo, error: fetchError } = await supabase
    .from('generated_videos')
    .select('download_count')
    .eq('id', videoId)
    .single()

  if (fetchError) {
    console.error('다운로드 카운트 조회 오류:', fetchError)
    return
  }

  // 카운트 증가
  const { error } = await supabase
    .from('generated_videos')
    .update({ 
      download_count: (currentVideo.download_count || 0) + 1
    })
    .eq('id', videoId)

  if (error) {
    console.error('다운로드 카운트 업데이트 오류:', error)
  }
}
