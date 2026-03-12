import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseClient() {
  // Provide fallbacks so that Next.js prerendering doesn't crash if env vars are missing
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hxdtsciwtkxwhysxxodw.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZHRzY2l3dGt4d2h5c3h4b2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Njk5MjcsImV4cCI6MjA4ODU0NTkyN30.EQx8lgQlMVnqj4OjdORTif2NEGdDHxpG9rzuHuWOoXE'
  )
}
