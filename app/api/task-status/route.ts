import { NextRequest, NextResponse } from 'next/server'
import { createApiSupabase } from '@/lib/supabase-server'
import { Database } from '@/types/database'

type VideoTask = Database['public']['Tables']['video_tasks']['Row']

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const projectId = searchParams.get('projectId')

    if (!taskId && !projectId) {
      return NextResponse.json(
        { success: false, error: '태스크 ID 또는 프로젝트 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // Supabase 클라이언트 생성
    const supabase = createApiSupabase(request)

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // Supabase에서 작업 상태 조회
    if (projectId) {
      // 프로젝트 ID로 모든 작업 조회
      const { data: tasks, error: tasksError } = await supabase
        .from('video_tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (tasksError) {
        console.error('작업 조회 오류:', tasksError)
        return NextResponse.json(
          { success: false, error: '작업 상태를 조회할 수 없습니다.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          tasks: tasks || [],
          projectId: projectId
        }
      })
    }

    if (taskId) {
      // 개별 작업 조회 (Supabase에서 먼저 확인)
      const { data: taskResult, error: taskError } = await supabase
        .from('video_tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', user.id)

      if (taskError && taskError.code !== 'PGRST116') { // PGRST116은 "no rows" 에러
        console.error('작업 조회 오류:', taskError)
        return NextResponse.json(
          { success: false, error: '작업 상태를 조회할 수 없습니다.' },
          { status: 500 }
        )
      }

      // Supabase에 작업이 있으면 해당 상태 반환
      const task = taskResult && taskResult.length > 0 ? taskResult[0] as VideoTask : null
      
      if (task) {
        return NextResponse.json({
          success: true,
          data: {
            taskId: task.id,
            projectId: task.project_id,
            taskType: task.task_type,
            status: task.status,
            progress: task.progress || 0,
            currentStep: task.current_step,
            stepsCompleted: task.steps_completed || [],
            errorMessage: task.error_message,
            resultData: task.result_data,
            startedAt: task.started_at,
            completedAt: task.completed_at,
            createdAt: task.created_at
          }
        })
      }

      // Supabase에 없으면 백엔드 API 호출 (기존 작업과의 호환성)
      console.log('백엔드에서 태스크 상태 조회:', taskId)

      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // 타임아웃 설정
          signal: AbortSignal.timeout(10000) // 10초
        })

        const responseText = await response.text()
        console.log('백엔드 태스크 상태 응답:', responseText)

        if (!response.ok) {
          console.error('Backend task status error:', responseText)
          
          // 백엔드가 실패해도 Supabase에서 찾은 정보가 있으면 반환
          // (이 시점에서는 task가 null이므로 생략)

          return NextResponse.json(
            { 
              success: false, 
              error: `태스크 상태 조회 실패: ${response.status}` 
            },
            { status: response.status }
          )
        }

        let result
        try {
          result = JSON.parse(responseText)
        } catch (parseError) {
          console.error('JSON 파싱 오류:', parseError)
          return NextResponse.json(
            { 
              success: false, 
              error: '백엔드 응답 파싱 오류' 
            },
            { status: 500 }
          )
        }

        // 백엔드 응답을 프론트엔드 형식으로 변환
        if (result.status === 200 && result.data) {
          const taskData = result.data
          
          // 백엔드 결과를 Supabase에도 저장/업데이트
          if (taskData.state !== undefined) {
            const taskStatus = taskData.state === 2 ? 'completed' : 
                              taskData.state === -1 ? 'failed' : 'processing'
            
            const { error: updateError } = await supabase
              .from('video_tasks')
              .upsert({
                id: taskId,
                project_id: projectId || '',
                user_id: user.id,
                task_type: 'video',
                status: taskStatus,
                progress: taskData.progress || 0,
                current_step: taskData.message || '',
                result_data: {
                  videos: taskData.videos || [],
                  combined_videos: taskData.combined_videos || [],
                  script: taskData.script || '',
                  terms: taskData.terms || [],
                  audio_file: taskData.audio_file || '',
                  audio_duration: taskData.audio_duration || 0,
                  subtitle_path: taskData.subtitle_path || '',
                  materials: taskData.materials || []
                },
                started_at: new Date().toISOString(),
                completed_at: taskStatus === 'completed' ? new Date().toISOString() : null
              })

            if (updateError) {
              console.error('작업 상태 업데이트 오류:', updateError)
            }
          }
          
          return NextResponse.json({
            success: true,
            data: {
              taskId: taskId,
              state: taskData.state || 0,
              progress: taskData.progress || 0,
              message: taskData.message || '',
              videos: taskData.videos || [],
              combined_videos: taskData.combined_videos || [],
              script: taskData.script || '',
              terms: taskData.terms || [],
              audio_file: taskData.audio_file || '',
              audio_duration: taskData.audio_duration || 0,
              subtitle_path: taskData.subtitle_path || '',
              materials: taskData.materials || [],
              source: 'backend'
            }
          })
        } else {
          console.error('예상치 못한 백엔드 태스크 응답:', result)
          return NextResponse.json(
            { 
              success: false, 
              error: '태스크 상태 조회가 실패했습니다.' 
            },
            { status: 500 }
          )
        }

      } catch (fetchError) {
        console.error('백엔드 API 호출 오류:', fetchError)
        
        // 백엔드 연결 실패 시 기본 오류 반환
        // (task는 이미 null이므로 fallback 불가)

        return NextResponse.json(
          { 
            success: false, 
            error: '백엔드 서버에 연결할 수 없습니다.' 
          },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: '잘못된 요청입니다.' },
      { status: 400 }
    )

  } catch (error) {
    console.error('태스크 상태 조회 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '태스크 상태 조회 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
}
