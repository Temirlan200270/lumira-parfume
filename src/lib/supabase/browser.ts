import { createBrowserClient } from '@supabase/ssr'
import { getPublicSupabaseEnv } from '@/lib/env'

export function createSupabaseBrowserClient() {
  const env = getPublicSupabaseEnv()
  if (!env) {
    throw new Error('Supabase public env is not configured')
  }

  return createBrowserClient(env.url, env.publishableKey)
}
