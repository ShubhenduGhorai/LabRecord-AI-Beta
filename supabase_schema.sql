-- Supabase Database Schema for LabRecord AI

-- Users Table (extends Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Waitlist Table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure required columns exist if the table was previously created without them
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add constraint to prevent duplicate emails
ALTER TABLE public.waitlist DROP CONSTRAINT IF EXISTS unique_waitlist_email;
ALTER TABLE public.waitlist ADD CONSTRAINT unique_waitlist_email UNIQUE (email);

-- Experiments Table
CREATE TABLE public.experiments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reports Table
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow public inserts into waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on waitlist" ON public.waitlist FOR INSERT TO anon WITH CHECK (true);

-- Users can only read/update their own profile
CREATE POLICY "Users can manage their own profile" ON public.users FOR ALL USING (auth.uid() = id);

-- Users can manage their own experiments and reports
CREATE POLICY "Users can manage their own experiments" ON public.experiments FOR ALL USING (auth.uid() = user_id);

-- Wait! A report belongs to an experiment, which belongs to a user.
-- Users can manage their own reports
CREATE POLICY "Users can manage their own reports" ON public.reports FOR ALL USING (
  experiment_id IN (
    SELECT id FROM public.experiments WHERE user_id = auth.uid()
  )
);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive',
  credits INTEGER DEFAULT 0,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Trigger for syncing new users from Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users (id, email, plan)
  values (new.id, new.email, 'free');

  insert into public.subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end
  )
  values (
    new.id,
    'free',
    'active',
    now(),
    now() + interval '30 days'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
