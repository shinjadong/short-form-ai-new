export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          billing_address: Json | null
          payment_method: Json | null
          email: string | null
          subscription_tier: string | null
          usage_limit: number | null
          usage_count: number | null
          last_usage_reset: string | null
          preferences: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          payment_method?: Json | null
          email?: string | null
          subscription_tier?: string | null
          usage_limit?: number | null
          usage_count?: number | null
          last_usage_reset?: string | null
          preferences?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          payment_method?: Json | null
          email?: string | null
          subscription_tier?: string | null
          usage_limit?: number | null
          usage_count?: number | null
          last_usage_reset?: string | null
          preferences?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      video_projects: {
        Row: {
          id: string
          user_id: string
          title: string
          subject: string
          script: string | null
          keywords: string[] | null
          status: string | null
          settings: Json
          thumbnail_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          subject: string
          script?: string | null
          keywords?: string[] | null
          status?: string | null
          settings?: Json
          thumbnail_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          subject?: string
          script?: string | null
          keywords?: string[] | null
          status?: string | null
          settings?: Json
          thumbnail_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      video_tasks: {
        Row: {
          id: string
          project_id: string
          user_id: string
          task_type: string
          status: string | null
          progress: number | null
          current_step: string | null
          steps_completed: string[] | null
          error_message: string | null
          result_data: Json | null
          started_at: string | null
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          task_type: string
          status?: string | null
          progress?: number | null
          current_step?: string | null
          steps_completed?: string[] | null
          error_message?: string | null
          result_data?: Json | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          task_type?: string
          status?: string | null
          progress?: number | null
          current_step?: string | null
          steps_completed?: string[] | null
          error_message?: string | null
          result_data?: Json | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "video_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      generated_videos: {
        Row: {
          id: string
          project_id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number | null
          duration: number | null
          resolution: string | null
          format: string | null
          is_public: boolean | null
          download_count: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          file_name: string
          file_url: string
          file_size?: number | null
          duration?: number | null
          resolution?: string | null
          format?: string | null
          is_public?: boolean | null
          download_count?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          duration?: number | null
          resolution?: string | null
          format?: string | null
          is_public?: boolean | null
          download_count?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_videos_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "video_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_videos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      video_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          settings: Json
          thumbnail_url: string | null
          is_featured: boolean | null
          usage_count: number | null
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          settings: Json
          thumbnail_url?: string | null
          is_featured?: boolean | null
          usage_count?: number | null
          created_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          settings?: Json
          thumbnail_url?: string | null
          is_featured?: boolean | null
          usage_count?: number | null
          created_by?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_templates_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
