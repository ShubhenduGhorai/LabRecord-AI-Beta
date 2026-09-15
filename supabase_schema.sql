-- Supabase Database Schema for LabRecord AI
-- Run this entire file in the Supabase SQL Editor

-- ============================================================
-- USERS TABLE (extends Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- WAITLIST TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.waitlist DROP CONSTRAINT IF EXISTS unique_waitlist_email;
ALTER TABLE public.waitlist ADD CONSTRAINT unique_waitlist_email UNIQUE (email);

-- ============================================================
-- EXPERIMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  aim TEXT,
  apparatus TEXT,
  theory TEXT,
  procedure TEXT,
  result TEXT,
  precautions TEXT,
  conclusion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'inactive',
  credits INTEGER DEFAULT 0,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- USAGE LIMITS TABLE
-- Tracks daily AI request counts per user.
-- Reset by the server when last_reset is older than 24 hours.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage_limits (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  requests_today INTEGER DEFAULT 0 NOT NULL,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY – Enable on ALL tables
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Waitlist: anyone can insert (public signup), nobody can read
DROP POLICY IF EXISTS "Allow public insert on waitlist" ON public.waitlist;
CREATE POLICY "Allow public insert on waitlist"
  ON public.waitlist FOR INSERT TO anon WITH CHECK (true);

-- Users: can only read/update their own row
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.users;
CREATE POLICY "Users can manage their own profile"
  ON public.users FOR ALL USING (auth.uid() = id);

-- Experiments: users can only access their own experiments
DROP POLICY IF EXISTS "Users can manage their own experiments" ON public.experiments;
CREATE POLICY "Users can manage their own experiments"
  ON public.experiments FOR ALL USING (auth.uid() = user_id);

-- Reports: users can only access reports belonging to their experiments
DROP POLICY IF EXISTS "Users can manage their own reports" ON public.reports;
CREATE POLICY "Users can manage their own reports"
  ON public.reports FOR ALL USING (
    experiment_id IN (
      SELECT id FROM public.experiments WHERE user_id = auth.uid()
    )
  );

-- Subscriptions: users can only read their own subscription
DROP POLICY IF EXISTS "Users can read their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can read their own subscriptions"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Service role can write to subscriptions (webhooks)
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL TO service_role USING (true);

-- Usage limits: users can read their own record; service role handles writes
DROP POLICY IF EXISTS "Users can read their own usage limits" ON public.usage_limits;
CREATE POLICY "Users can read their own usage limits"
  ON public.usage_limits FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage usage limits" ON public.usage_limits;
CREATE POLICY "Service role can manage usage limits"
  ON public.usage_limits FOR ALL TO service_role USING (true);

-- ============================================================
-- TRIGGER: Sync new auth users into public.users & subscriptions
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, subscription_status)
  VALUES (new.id, new.email, 'free', 'inactive')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.subscriptions (
    user_id, plan, status, current_period_start, current_period_end
  )
  VALUES (
    new.id, 'free', 'active', now(), now() + interval '30 days'
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.usage_limits (user_id, requests_today, last_reset)
  VALUES (new.id, 0, now())
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- USER_USAGE TABLE
-- Tracks monthly AI token consumption per user.
-- "month" stores the period as YYYY-MM (e.g. "2026-03").
-- The app server resets tokens_used when month rolls over.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_usage (
  user_id    UUID    REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  plan       TEXT    NOT NULL DEFAULT 'free',
  tokens_used INTEGER NOT NULL DEFAULT 0,
  month      TEXT    NOT NULL,           -- e.g. "2026-03"
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Users can read their own usage
DROP POLICY IF EXISTS "Users can read their own usage" ON public.user_usage;
CREATE POLICY "Users can read their own usage"
  ON public.user_usage FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own usage
DROP POLICY IF EXISTS "Users can update their own usage" ON public.user_usage;
CREATE POLICY "Users can update their own usage"
  ON public.user_usage FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own usage
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.user_usage;
CREATE POLICY "Users can insert their own usage"
  ON public.user_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- UPDATE TRIGGER: automatically stamp updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_usage_updated_at ON public.user_usage;
CREATE TRIGGER user_usage_updated_at
  BEFORE UPDATE ON public.user_usage
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ============================================================
-- SEED user_usage on new signups (extend existing trigger fn)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month TEXT := to_char(now(), 'YYYY-MM');
BEGIN
  INSERT INTO public.users (id, email, plan, subscription_status)
  VALUES (new.id, new.email, 'free', 'inactive')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.subscriptions (
    user_id, plan, status, current_period_start, current_period_end
  )
  VALUES (
    new.id, 'free', 'active', now(), now() + interval '30 days'
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.usage_limits (user_id, requests_today, last_reset)
  VALUES (new.id, 0, now())
  ON CONFLICT (user_id) DO NOTHING;

  -- Seed monthly token usage record
  INSERT INTO public.user_usage (user_id, plan, tokens_used, month)
  VALUES (new.id, 'free', 0, current_month)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- ============================================================
-- RPC: increment_token_usage
-- Atomically increments tokens_used by 1 and returns new count.
-- Called by /lib/usage.ts after a successful AI generation.
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_token_usage(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.user_usage
  SET tokens_used = tokens_used + 1,
      updated_at  = now()
  WHERE user_id = p_user_id
  RETURNING tokens_used INTO new_count;

  RETURN new_count;
END;
$$;


-- ============================================================
-- TOOL_USAGE TABLE
-- Tracks cumulative AI usage per tool per user.
-- Used for the new "1 use (Hobby) / 200 uses (Pro)" logic.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tool_usage (
  user_id    UUID    REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  tool_id    TEXT    NOT NULL,           -- e.g. "data-analysis", "graph-generator", etc.
  count      INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, tool_id)
);

-- RLS
ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own tool usage"
  ON public.tool_usage FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tool usage"
  ON public.tool_usage FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tool usage"
  ON public.tool_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RPC: increment_tool_usage
CREATE OR REPLACE FUNCTION public.increment_tool_usage(p_user_id UUID, p_tool_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.tool_usage (user_id, tool_id, count, updated_at)
  VALUES (p_user_id, p_tool_id, 1, now())
  ON CONFLICT (user_id, tool_id)
  DO UPDATE SET count = tool_usage.count + 1, updated_at = now()
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;
