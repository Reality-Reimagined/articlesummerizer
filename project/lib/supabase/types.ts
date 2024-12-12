export interface UserProfile {
  id: string;
  full_name: string | null;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  summaries_used: number;
  summaries_limit: number;
  created_at: string;
  updated_at: string;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: 'general' | 'financial' | 'culture';
  tier: 'free' | 'premium';
  active: boolean;
  created_at: string;
}

export interface UserFeedPreference {
  id: string;
  user_id: string;
  source_id: string;
  created_at: string;
}

export interface SavedSummary {
  id: string;
  user_id: string;
  article_url: string;
  title: string;
  summary: string;
  source_id: string | null;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  summaries_limit: number;
  features: {
    basic_sources: boolean;
    premium_sources: boolean;
    priority_processing: boolean;
  };
  active: boolean;
  created_at: string;
}