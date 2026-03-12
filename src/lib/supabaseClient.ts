import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
     // Use fallbacks for build-time / static export safety, but log it
     if (typeof window !== 'undefined') {
       console.warn("Supabase env vars missing, using static fallback.");
     }
  }

  return createBrowserClient(
    supabaseUrl || 'https://hxdtsciwtkxwhysxxodw.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZHRzY2l3dGt4d2h5c3h4b2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Njk5MjcsImV4cCI6MjA4ODU0NTkyN30.EQx8lgQlMVnqj4OjdORTif2NEGdDHxpG9rzuHuWOoXE'
  )
}
