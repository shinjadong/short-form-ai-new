export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name?: string
          avatar_url?: string
          subscription_tier: 'free' | 'pro' | 'premium'
          usage_limit: number
          usage_count: number
          last_login?: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string
          avatar_url?: string
          subscription_tier?: 'free' | 'pro' | 'premium'
          usage_limit?: number
          usage_count?: number
          last_login?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          avatar_url?: string
          subscription_tier?: 'free' | 'pro' | 'premium'
          usage_limit?: number
          usage_count?: number
          last_login?: string
        }
      }
      video_projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          subject: string
          script?: string
          status: 'draft' | 'processing' | 'completed' | 'failed'
          settings?: any
          generated_video_url?: string
          thumbnail_url?: string
          duration?: number
          views_count: number
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          subject: string
          script?: string
          status?: 'draft' | 'processing' | 'completed' | 'failed'
          settings?: any
          generated_video_url?: string
          thumbnail_url?: string
          duration?: number
          views_count?: number
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          subject?: string
          script?: string
          status?: 'draft' | 'processing' | 'completed' | 'failed'
          settings?: any
          generated_video_url?: string
          thumbnail_url?: string
          duration?: number
          views_count?: number
          is_public?: boolean
        }
      }
      video_templates: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          category: string
          template_data: any
          preview_url?: string
          thumbnail_url?: string
          is_featured: boolean
          usage_count: number
          is_premium: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          category: string
          template_data: any
          preview_url?: string
          thumbnail_url?: string
          is_featured?: boolean
          usage_count?: number
          is_premium?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          category?: string
          template_data?: any
          preview_url?: string
          thumbnail_url?: string
          is_featured?: boolean
          usage_count?: number
          is_premium?: boolean
        }
      }
      video_tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          project_id: string
          user_id?: string
          task_type: 'script_generation' | 'video_generation' | 'voice_synthesis' | 'image_generation'
          status: 'pending' | 'processing' | 'completed' | 'failed'
          progress: number
          result_data?: any
          error_message?: string
          estimated_time?: number
          actual_time?: number
          current_step?: string
          steps_completed?: string[]
          started_at?: string
          completed_at?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id: string
          user_id?: string
          task_type: 'script_generation' | 'video_generation' | 'voice_synthesis' | 'image_generation'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          progress?: number
          result_data?: any
          error_message?: string
          estimated_time?: number
          actual_time?: number
          current_step?: string
          steps_completed?: string[]
          started_at?: string
          completed_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id?: string
          user_id?: string
          task_type?: 'script_generation' | 'video_generation' | 'voice_synthesis' | 'image_generation'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          progress?: number
          result_data?: any
          error_message?: string
          estimated_time?: number
          actual_time?: number
          current_step?: string
          steps_completed?: string[]
          started_at?: string
          completed_at?: string
        }
      }
      generated_videos: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          project_id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number
          duration?: number
          resolution?: string
          format: string
          is_public: boolean
          download_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number
          duration?: number
          resolution?: string
          format?: string
          is_public?: boolean
          download_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id?: string
          user_id?: string
          file_name?: string
          file_url?: string
          file_size?: number
          duration?: number
          resolution?: string
          format?: string
          is_public?: boolean
          download_count?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_usage_limit: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      increment_user_usage: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
