-- Complete database setup for ClipTidy video conversion application

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY NOT NULL,
    avatar_url text,
    user_id text UNIQUE,
    token_identifier text NOT NULL,
    image text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone,
    email text,
    name text,
    full_name text,
    subscription_tier text DEFAULT 'free',
    credits_remaining integer DEFAULT 10,
    total_conversions integer DEFAULT 0
);

-- =============================================
-- VIDEOS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.videos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    original_filename text NOT NULL,
    original_url text,
    converted_url text,
    original_format text,
    converted_format text DEFAULT 'mp4',
    original_width integer,
    original_height integer,
    converted_width integer DEFAULT 1080,
    converted_height integer DEFAULT 1920,
    duration_seconds numeric,
    file_size_mb numeric,
    status text DEFAULT 'pending',
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone,
    processing_started_at timestamp with time zone,
    processing_completed_at timestamp with time zone,
    error_message text,
    settings jsonb DEFAULT '{}'::jsonb
);

-- =============================================
-- CONVERSION_JOBS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.conversion_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    job_type text NOT NULL,
    status text DEFAULT 'queued',
    priority integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    error_message text,
    progress_percentage integer DEFAULT 0
);

-- =============================================
-- USER_SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    default_output_format text DEFAULT 'mp4',
    default_quality text DEFAULT 'high',
    auto_crop boolean DEFAULT true,
    watermark_enabled boolean DEFAULT false,
    watermark_url text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone
);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_subscription_id text,
    stripe_customer_id text,
    status text DEFAULT 'active',
    plan_type text DEFAULT 'free',
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- DROP EXISTING POLICIES (if they exist)
-- =============================================
-- Users table policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Videos table policies
DROP POLICY IF EXISTS "Users can view own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can insert own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON public.videos;

-- Conversion jobs table policies
DROP POLICY IF EXISTS "Users can view own conversion jobs" ON public.conversion_jobs;
DROP POLICY IF EXISTS "Users can insert own conversion jobs" ON public.conversion_jobs;
DROP POLICY IF EXISTS "Users can update own conversion jobs" ON public.conversion_jobs;

-- User settings table policies
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;

-- Subscriptions table policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================
-- Users can view their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid()::text = user_id);

-- Users can insert their own data (for signup)
CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid()::text = user_id);

-- =============================================
-- VIDEOS TABLE POLICIES
-- =============================================
-- Users can view their own videos
CREATE POLICY "Users can view own videos" ON public.videos
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own videos
CREATE POLICY "Users can insert own videos" ON public.videos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own videos
CREATE POLICY "Users can update own videos" ON public.videos
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own videos
CREATE POLICY "Users can delete own videos" ON public.videos
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- CONVERSION_JOBS TABLE POLICIES
-- =============================================
-- Users can view their own conversion jobs
CREATE POLICY "Users can view own conversion jobs" ON public.conversion_jobs
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own conversion jobs
CREATE POLICY "Users can insert own conversion jobs" ON public.conversion_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversion jobs
CREATE POLICY "Users can update own conversion jobs" ON public.conversion_jobs
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- USER_SETTINGS TABLE POLICIES
-- =============================================
-- Users can view their own settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- SUBSCRIPTIONS TABLE POLICIES
-- =============================================
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    user_id,
    email,
    name,
    full_name,
    avatar_url,
    token_identifier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.created_at,
    NEW.updated_at
  );
  
  -- Create default user settings
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NEW.updated_at
  WHERE user_id = NEW.id::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Triggers to automatically update updated_at columns
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON public.videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at);
CREATE INDEX IF NOT EXISTS idx_conversion_jobs_user_id ON public.conversion_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_jobs_status ON public.conversion_jobs(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
