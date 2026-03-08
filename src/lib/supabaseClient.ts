import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseClient() {
  // Provide fallbacks so that Next.js prerendering doesn't crash if env vars are missing
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )
}
