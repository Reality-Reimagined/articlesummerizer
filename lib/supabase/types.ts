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
      feeds: {
        Row: {
          id: string
          created_at: string
          url: string
          title: string
          description: string | null
          user_id: string
          is_active: boolean
          last_fetched: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          url: string
          title: string
          description?: string | null
          user_id: string
          is_active?: boolean
          last_fetched?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          url?: string
          title?: string
          description?: string | null
          user_id?: string
          is_active?: boolean
          last_fetched?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          subscription_tier: 'basic' | 'pro'
          stripe_customer_id: string | null
          subscription_status: 'active' | 'inactive' | 'past_due' | 'canceled'
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          subscription_tier?: 'basic' | 'pro'
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'past_due' | 'canceled'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          subscription_tier?: 'basic' | 'pro'
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'past_due' | 'canceled'
        }
      }
      summaries: {
        Row: {
          id: string
          created_at: string
          feed_id: string
          content: string
          tldr: string
          url: string
          title: string
        }
        Insert: {
          id?: string
          created_at?: string
          feed_id: string
          content: string
          tldr: string
          url: string
          title: string
        }
        Update: {
          id?: string
          created_at?: string
          feed_id?: string
          content?: string
          tldr?: string
          url?: string
          title?: string
        }
      }
    }
  }
}

// Derived types
export type Feed = Database['public']['Tables']['feeds']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Summary = Database['public']['Tables']['summaries']['Row']

// API Response types for our Python backend
export interface ScrapeResponse {
  tldr: string
  summary: string
}

export interface TldrResponse {
  TLDR: string
}

export interface SummaryResponse {
  'Executive Summery': string  // Note: keeping the typo to match backend
}