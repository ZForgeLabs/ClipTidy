export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          avatar_url: string | null;
          user_id: string;
          token_identifier: string;
          image: string | null;
          created_at: string;
          updated_at: string | null;
          email: string | null;
          name: string | null;
          full_name: string | null;
          subscription_tier: string;
          credits_remaining: number;
          total_conversions: number;
        };
        Insert: {
          id: string;
          avatar_url?: string | null;
          user_id: string;
          token_identifier: string;
          image?: string | null;
          created_at?: string;
          updated_at?: string | null;
          email?: string | null;
          name?: string | null;
          full_name?: string | null;
          subscription_tier?: string;
          credits_remaining?: number;
          total_conversions?: number;
        };
        Update: {
          id?: string;
          avatar_url?: string | null;
          user_id?: string;
          token_identifier?: string;
          image?: string | null;
          created_at?: string;
          updated_at?: string | null;
          email?: string | null;
          name?: string | null;
          full_name?: string | null;
          subscription_tier?: string;
          credits_remaining?: number;
          total_conversions?: number;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          original_filename: string;
          original_url: string | null;
          converted_url: string | null;
          original_format: string | null;
          converted_format: string;
          original_width: number | null;
          original_height: number | null;
          converted_width: number;
          converted_height: number;
          duration_seconds: number | null;
          file_size_mb: number | null;
          status: string;
          created_at: string;
          updated_at: string | null;
          processing_started_at: string | null;
          processing_completed_at: string | null;
          error_message: string | null;
          settings: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_filename: string;
          original_url?: string | null;
          converted_url?: string | null;
          original_format?: string | null;
          converted_format?: string;
          original_width?: number | null;
          original_height?: number | null;
          converted_width?: number;
          converted_height?: number;
          duration_seconds?: number | null;
          file_size_mb?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
          processing_started_at?: string | null;
          processing_completed_at?: string | null;
          error_message?: string | null;
          settings?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_filename?: string;
          original_url?: string | null;
          converted_url?: string | null;
          original_format?: string | null;
          converted_format?: string;
          original_width?: number | null;
          original_height?: number | null;
          converted_width?: number;
          converted_height?: number;
          duration_seconds?: number | null;
          file_size_mb?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
          processing_started_at?: string | null;
          processing_completed_at?: string | null;
          error_message?: string | null;
          settings?: any;
        };
      };
      conversion_jobs: {
        Row: {
          id: string;
          video_id: string;
          user_id: string;
          job_type: string;
          status: string;
          priority: number;
          created_at: string;
          started_at: string | null;
          completed_at: string | null;
          error_message: string | null;
          progress_percentage: number;
        };
        Insert: {
          id?: string;
          video_id: string;
          user_id: string;
          job_type: string;
          status?: string;
          priority?: number;
          created_at?: string;
          started_at?: string | null;
          completed_at?: string | null;
          error_message?: string | null;
          progress_percentage?: number;
        };
        Update: {
          id?: string;
          video_id?: string;
          user_id?: string;
          job_type?: string;
          status?: string;
          priority?: number;
          created_at?: string;
          started_at?: string | null;
          completed_at?: string | null;
          error_message?: string | null;
          progress_percentage?: number;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          default_output_format: string;
          default_quality: string;
          auto_crop: boolean;
          watermark_enabled: boolean;
          watermark_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          default_output_format?: string;
          default_quality?: string;
          auto_crop?: boolean;
          watermark_enabled?: boolean;
          watermark_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          default_output_format?: string;
          default_quality?: string;
          auto_crop?: boolean;
          watermark_enabled?: boolean;
          watermark_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          status: string;
          plan_type: string;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string;
          plan_type?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string;
          plan_type?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types for common operations
export type User = Database['public']['Tables']['users']['Row'];
export type Video = Database['public']['Tables']['videos']['Row'];
export type ConversionJob = Database['public']['Tables']['conversion_jobs']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type VideoInsert = Database['public']['Tables']['videos']['Insert'];
export type ConversionJobInsert = Database['public']['Tables']['conversion_jobs']['Insert'];
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert'];
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type VideoUpdate = Database['public']['Tables']['videos']['Update'];
export type ConversionJobUpdate = Database['public']['Tables']['conversion_jobs']['Update'];
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update'];
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];

// Video status enum
export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// Job status enum
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

// Subscription status enum
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due';

// Plan types
export type PlanType = 'free' | 'pro' | 'enterprise';

// Video conversion settings
export interface VideoSettings {
  crop_mode?: 'auto' | 'manual' | 'center';
  crop_x?: number;
  crop_y?: number;
  crop_width?: number;
  crop_height?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  format?: 'mp4' | 'mov' | 'avi';
  fps?: number;
  bitrate?: number;
  watermark?: {
    enabled: boolean;
    url?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
  };
}
