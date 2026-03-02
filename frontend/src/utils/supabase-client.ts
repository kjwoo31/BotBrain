import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'
import { isMockMode, createMockSupabaseClient } from '@/utils/mock/mock-supabase-client'

export function createSupabaseClient() {
  if (isMockMode()) return createMockSupabaseClient() as any;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  // The createBrowserClient from @supabase/ssr handles cookies automatically
  // in browser environments with the correct settings for production
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
} 