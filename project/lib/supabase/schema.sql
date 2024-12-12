-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Profile (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  summaries_used INTEGER DEFAULT 0,
  summaries_limit INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Feed Sources
CREATE TABLE feed_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  tier TEXT DEFAULT 'free',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User Feed Preferences
CREATE TABLE user_feed_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  source_id UUID REFERENCES feed_sources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, source_id)
);

-- Saved Summaries
CREATE TABLE saved_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  article_url TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_id UUID REFERENCES feed_sources(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Subscription Plans
CREATE TABLE subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  summaries_limit INTEGER NOT NULL,
  features JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, price, summaries_limit, features) VALUES
  ('free', 'Free Tier', 0, 5, '{"basic_sources": true, "premium_sources": false, "priority_processing": false}'),
  ('pro', 'Summarizer Plan', 999, 25, '{"basic_sources": true, "premium_sources": true, "priority_processing": false}'),
  ('enterprise', 'Summarizer Pro', 1999, 50, '{"basic_sources": true, "premium_sources": true, "priority_processing": true}');

-- Insert default feed sources
INSERT INTO feed_sources (name, url, category, tier) VALUES
  ('BBC News', 'https://feeds.bbci.co.uk/news/rss.xml', 'general', 'free'),
  ('CBC News', 'https://www.cbc.ca/cmlink/rss-topstories', 'general', 'free'),
  ('Bloomberg', 'https://www.bloomberg.com/feed', 'financial', 'premium'),
  ('Financial Times', 'https://www.ft.com/rss/home', 'financial', 'premium'),
  ('Forbes', 'https://www.forbes.com/real-time/feed2/', 'financial', 'premium'),
  ('New York Times', 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', 'general', 'premium'),
  ('The New Yorker', 'https://www.newyorker.com/feed/everything', 'culture', 'premium'),
  ('The Atlantic', 'https://www.theatlantic.com/feed/all/', 'culture', 'premium');

-- Create function to update user summary count
CREATE OR REPLACE FUNCTION increment_user_summary_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET summaries_used = summaries_used + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for summary count
CREATE TRIGGER increment_summary_count
AFTER INSERT ON saved_summaries
FOR EACH ROW
EXECUTE FUNCTION increment_user_summary_count();

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feed_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_summaries ENABLE ROW LEVEL SECURITY;

-- User Profiles Policy
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Feed Preferences Policy
CREATE POLICY "Users can manage own feed preferences"
  ON user_feed_preferences
  USING (auth.uid() = user_id);

-- Saved Summaries Policy
CREATE POLICY "Users can manage own summaries"
  ON saved_summaries
  USING (auth.uid() = user_id);