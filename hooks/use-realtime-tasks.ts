'use client'

import { useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import { useAuth } from '@/components/providers/auth-provider'
import { RealtimeChannel } from '@supabase/supabase-js'

type VideoTask = Database['public']['Tables']['video_tasks']['Row']

interface UseRealtimeTasksProps {
  projectId?: string
  taskId?: string
}

export function useRealtimeTasks({ projectId, taskId }: UseRealtimeTasksProps = {}) {
  const [tasks, setTasks] = useState<VideoTask[]>([])
  const [currentTask, setCurrentTask] = useState<VideoTask | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useAuth()
  const supabase = createClientSupabase()

  // 초기 데이터 로드
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadInitialData = async () => {
      try {
        setError(null)
        
        if (taskId) {
          // 특정 작업 조회
          const { data, error } = await supabase
            .from('video_tasks')
            .select('*')
            .eq('id', taskId)
            .eq('user_id', user.id)
            .single()

          if (error && error.code !== 'PGRST116') {
            throw error
          }

          setCurrentTask(data || null)
        } else if (projectId) {
          // 프로젝트의 모든 작업 조회
          const { data, error } = await supabase
            .from('video_tasks')
            .select('*')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            throw error
          }

          setTasks(data || [])
        } else {
          // 사용자의 모든 작업 조회
          const { data, error } = await supabase
            .from('video_tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20)

          if (error) {
            throw error
          }

          setTasks(data || [])
        }
      } catch (err) {
        console.error('작업 데이터 로드 오류:', err)
        setError(err instanceof Error ? err.message : '데이터 로드 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [user, projectId, taskId, supabase])

  // 실시간 구독 설정
  useEffect(() => {
    if (!user) return

    let channel: RealtimeChannel

    try {
      // 사용자별 작업 변경 사항 구독
      channel = supabase
        .channel(`user_tasks_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'video_tasks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('실시간 작업 업데이트:', payload)
            
            const updatedTask = payload.new as VideoTask
            const deletedTaskId = (payload.old as any)?.id

            switch (payload.eventType) {
              case 'INSERT':
                if (updatedTask) {
                  // 새 작업 추가
                  if (projectId && updatedTask.project_id === projectId) {
                    setTasks(prev => [updatedTask, ...prev])
                  }
                  if (taskId && updatedTask.id === taskId) {
                    setCurrentTask(updatedTask)
                  }
                  if (!projectId && !taskId) {
                    setTasks(prev => [updatedTask, ...prev.slice(0, 19)])
                  }
                }
                break

              case 'UPDATE':
                if (updatedTask) {
                  // 작업 업데이트
                  if (projectId && updatedTask.project_id === projectId) {
                    setTasks(prev => 
                      prev.map(task => 
                        task.id === updatedTask.id ? updatedTask : task
                      )
                    )
                  }
                  if (taskId && updatedTask.id === taskId) {
                    setCurrentTask(updatedTask)
                  }
                  if (!projectId && !taskId) {
                    setTasks(prev => 
                      prev.map(task => 
                        task.id === updatedTask.id ? updatedTask : task
                      )
                    )
                  }
                }
                break

              case 'DELETE':
                if (deletedTaskId) {
                  // 작업 삭제
                  setTasks(prev => prev.filter(task => task.id !== deletedTaskId))
                  if (taskId === deletedTaskId) {
                    setCurrentTask(null)
                  }
                }
                break
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime 구독 상태:', status)
          if (status === 'SUBSCRIBED') {
            console.log('실시간 작업 추적이 활성화되었습니다.')
          }
        })

    } catch (err) {
      console.error('Realtime 구독 설정 오류:', err)
      setError('실시간 업데이트 설정 중 오류가 발생했습니다.')
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user, projectId, taskId, supabase])

  // 작업 수동 새로고침
  const refreshTasks = async () => {
    if (!user) return

    try {
      setError(null)
      
      if (taskId) {
        const { data, error } = await supabase
          .from('video_tasks')
          .select('*')
          .eq('id', taskId)
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        setCurrentTask(data || null)
      } else if (projectId) {
        const { data, error } = await supabase
          .from('video_tasks')
          .select('*')
          .eq('project_id', projectId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setTasks(data || [])
      } else {
        const { data, error } = await supabase
          .from('video_tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          throw error
        }

        setTasks(data || [])
      }
    } catch (err) {
      console.error('작업 새로고침 오류:', err)
      setError(err instanceof Error ? err.message : '새로고침 중 오류가 발생했습니다.')
    }
  }

  return {
    tasks,
    currentTask,
    loading,
    error,
    refreshTasks,
    // 편의 함수들
    isTaskRunning: currentTask ? ['pending', 'processing'].includes(currentTask.status || '') : false,
    isTaskCompleted: currentTask ? currentTask.status === 'completed' : false,
    isTaskFailed: currentTask ? currentTask.status === 'failed' : false,
    progress: currentTask?.progress || 0,
    currentStep: currentTask?.current_step || '',
  }
}

// 특정 작업의 실시간 추적을 위한 간단한 hook
export function useRealtimeTask(taskId: string) {
  return useRealtimeTasks({ taskId })
}

// 프로젝트의 모든 작업 실시간 추적을 위한 hook
export function useRealtimeProjectTasks(projectId: string) {
  return useRealtimeTasks({ projectId })
}
