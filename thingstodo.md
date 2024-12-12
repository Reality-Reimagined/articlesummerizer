Create a full-stack news aggregation and summarization platform with the following key features and integrations:

User Authentication & Database (Supabase):
Implement user registration and login functionality
Create database tables for user profiles, saved summaries, and RSS feed preferences
Store user subscription status and usage counts
RSS Feed Integration:
Allow users to select from premium news sources including:
Financial: Bloomberg, Financial Times, Forbes
General News: BBC, CBC, New York Times
Culture: New Yorker, Atlantic
Enable users to customize their feed preferences
Implement real-time feed updates and notifications
Stripe Payment Integration: Implement three-tier subscription model:
Free Tier:
5 summaries per month
Basic sources only
Standard export formats
Summarizer Plan ($X/month):
25 summaries per month
Additional premium sources
All export formats
Summarizer Pro ($Y/month):
50 summaries per month
All premium sources
Priority processing
Advanced analytics
Technical Requirements:
Set up Supabase tables and authentication
Implement Stripe webhook handling
Create usage tracking system
Ensure secure API endpoints
Add error handling and rate limiting
Implement caching for improved performance
all basic functionality in the app works right now. i will add all the required api keys need for supabase and stripe. create a sql page too for sql needed so i can put into supabase sql editor

I'll help you create a comprehensive full-stack news aggregation platform by breaking it down into smaller, focused modules. Let's start with the core functionality:

News Aggregator Core Setup

lib/supabase/schema.sql
lib/supabase/types.ts
lib/supabase/client.ts
lib/stripe/config.ts
lib/stripe/webhooks.ts
This setup provides the core infrastructure for the news aggregation platform. Here's what each file handles:

schema.sql:

Complete database schema for Supabase
Tables for user profiles, feed sources, preferences, and summaries
Row-level security policies
Default subscription plans and feed sources
Automated summary count tracking
types.ts:

TypeScript interfaces for all database entities
Type safety for API calls and components
client.ts:

Supabase client configuration
Environment variable validation
stripe/config.ts:

Subscription plan configurations
Status definitions for subscriptions
stripe/webhooks.ts:

Webhook handlers for Stripe events
Subscription status management
User profile updates
Next steps would be to create:

Authentication components
Feed management interface
Subscription management components
RSS feed integration
API routes for summaries
Would you like me to continue with any of these components?