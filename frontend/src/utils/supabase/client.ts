import { createBrowserClient } from '@supabase/ssr'
import { isMockMode, createMockSupabaseClient } from '@/utils/mock/mock-supabase-client'

export function createClient() {
  if (isMockMode()) return createMockSupabaseClient() as any;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}