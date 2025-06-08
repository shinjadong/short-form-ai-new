import { IVideoGenerationRequest, IVideoGenerationResponse, ITaskStatus } from '@/types/video-generation'
import { supabase } from './supabase-client'

// 백엔드 API 기본 URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

/**
 * 최종 비디오 생성 요청을 백엔드로 전송
 */
export async function generateVideoRequest(
  request: IVideoGenerationRequest
): Promise<IVideoGenerationResponse> {
  try {
    // 1. Supabase에 프로젝트 저장
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('사용자 인증이 필요합니다')

    // 프로젝트 데이터 준비
    const projectData = {
      user_id: user.id,
      title: `영상 프로젝트 ${new Date().toLocaleString()}`,
      mode: request.mode,
      workflow: request.workflow,
      input_data: request.input,
      settings: request.settings,
      generated_script: request.preparedMaterials.script,
      generated_keywords: request.preparedMaterials.keywords,
      audio_file_url: request.preparedMaterials.audioFile?.url,
      subtitle_content: request.preparedMaterials.subtitleContent,
      materials: {
        videoClips: request.preparedMaterials.videoClips,
        imageAssets: request.preparedMaterials.imageAssets,
        segmentKeywords: request.preparedMaterials.segmentKeywords,
        selectedMaterials: request.preparedMaterials.selectedMaterials
      },
      status: 'processing' as const,
      metadata: request.metadata
    }

    // Supabase에 프로젝트 삽입
    const { data: project, error: dbError } = await supabase
      .from('video_projects')
      .insert(projectData)
      .select()
      .single()

    if (dbError) throw dbError

    // 2. 백엔드에 비디오 생성 요청
    const backendRequest = {
      ...request,
      projectId: project.id,
      userId: user.id
    }

    const response = await fetch(`${BACKEND_API_URL}/api/v1/generate-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access_token}`
      },
      body: JSON.stringify(backendRequest)
    })

    if (!response.ok) {
      throw new Error(`백엔드 요청 실패: ${response.status} ${response.statusText}`)
    }

    const result: IVideoGenerationResponse = await response.json()

    // 3. task_id로 Supabase 업데이트
    if (result.taskId) {
      await supabase
        .from('video_projects')
        .update({ 
          task_id: result.taskId,
          processing_started_at: new Date().toISOString()
        })
        .eq('id', project.id)

      // task_status 테이블에도 기록
      await supabase
        .from('task_status')
        .insert({
          task_id: result.taskId,
          video_project_id: project.id,
          user_id: user.id,
          status: 'pending',
          backend_endpoint: `${BACKEND_API_URL}/api/v1/generate-video`
        })
    }

    return result

  } catch (error) {
    console.error('비디오 생성 요청 실패:', error)
    throw error
  }
}

/**
 * 태스크 상태 조회
 */
export async function getTaskStatus(taskId: string): Promise<ITaskStatus | null> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/task-status/${taskId}`)
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`태스크 상태 조회 실패: ${response.status}`)
    }

    const taskStatus: ITaskStatus = await response.json()

    // Supabase에도 상태 업데이트
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('task_status')
        .upsert({
          task_id: taskId,
          user_id: user.id,
          status: taskStatus.status,
          progress: taskStatus.progress,
          current_step: taskStatus.currentStep,
          estimated_time_remaining: taskStatus.estimatedTimeRemaining,
          error_details: taskStatus.error,
          result: taskStatus.result || {},
          updated_at: new Date().toISOString()
        })

      // 완료 시 video_projects 테이블도 업데이트
      if (taskStatus.status === 'completed' && taskStatus.result) {
        await supabase
          .from('video_projects')
          .update({
            status: 'completed',
            final_video_url: taskStatus.result.videoUrl,
            thumbnail_url: taskStatus.result.thumbnailUrl,
            video_duration: taskStatus.result.duration,
            file_size: taskStatus.result.fileSize,
            processing_completed_at: new Date().toISOString()
          })
          .eq('task_id', taskId)
      } else if (taskStatus.status === 'failed') {
        await supabase
          .from('video_projects')
          .update({
            status: 'failed',
            error_message: taskStatus.error,
            processing_completed_at: new Date().toISOString()
          })
          .eq('task_id', taskId)
      }
    }

    return taskStatus

  } catch (error) {
    console.error('태스크 상태 조회 실패:', error)
    return null
  }
}

/**
 * 사용자의 비디오 프로젝트 목록 조회
 */
export async function getUserVideoProjects(limit = 10, offset = 0) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('사용자 인증이 필요합니다')

    const { data, error } = await supabase
      .from('video_projects')
      .select(`
        *,
        task_status(*)
      `)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return data

  } catch (error) {
    console.error('프로젝트 목록 조회 실패:', error)
    throw error
  }
}

/**
 * 특정 비디오 프로젝트 상세 조회
 */
export async function getVideoProject(projectId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('사용자 인증이 필요합니다')

    const { data, error } = await supabase
      .from('video_projects')
      .select(`
        *,
        task_status(*),
        video_feedback(*)
      `)
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return data

  } catch (error) {
    console.error('프로젝트 조회 실패:', error)
    throw error
  }
}

/**
 * 사용자 사용량 확인
 */
export async function getUserUsage() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('사용자 인증이 필요합니다')

    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      // 사용량 데이터가 없으면 생성
      if (error.code === 'PGRST116') {
        const { data: newUsage, error: createError } = await supabase
          .from('user_usage')
          .insert({
            user_id: user.id,
            subscription_plan: 'free',
            daily_limit: 3,
            monthly_limit: 10
          })
          .select()
          .single()

        if (createError) throw createError
        return newUsage
      }
      throw error
    }

    return data

  } catch (error) {
    console.error('사용량 조회 실패:', error)
    throw error
  }
}

/**
 * 사용량 업데이트 (비디오 생성 시)
 */
export async function updateVideoUsage() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('사용자 인증이 필요합니다')

    const { error } = await supabase.rpc('increment_video_usage', {
      p_user_id: user.id
    })

    if (error) throw error

  } catch (error) {
    console.error('사용량 업데이트 실패:', error)
    throw error
  }
}

/**
 * 실시간 태스크 상태 구독 (WebSocket 대체)
 */
export function subscribeToTaskStatus(
  taskId: string, 
  onStatusUpdate: (status: ITaskStatus) => void
) {
  const interval = setInterval(async () => {
    const status = await getTaskStatus(taskId)
    if (status) {
      onStatusUpdate(status)
      
      // 완료되거나 실패하면 구독 중단
      if (status.status === 'completed' || status.status === 'failed') {
        clearInterval(interval)
      }
    }
  }, 2000) // 2초마다 상태 확인

  // 정리 함수 반환
  return () => clearInterval(interval)
}

/**
 * 요청 해시 생성 (중복 방지용)
 */
export function generateRequestHash(request: Partial<IVideoGenerationRequest>): string {
  const hashInput = JSON.stringify({
    script: request.preparedMaterials?.script,
    settings: request.settings,
    timestamp: Date.now()
  })
  
  // 간단한 해시 생성 (실제로는 crypto.subtle 사용 권장)
  let hash = 0
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32비트 정수로 변환
  }
  
  return Math.abs(hash).toString(36)
} 