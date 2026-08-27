import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { getPublicSupabaseEnv, getSupabaseSecretKey } from '@/lib/env'

export function createSupabaseAdminClient() {
  const env = getPublicSupabaseEnv()
  const secretKey = getSupabaseSecretKey()
  if (!env || !secretKey) {
    throw new Error('Supabase admin env is not configured')
  }

  return createClient(env.url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function hasSupabaseAdminEnv(): boolean {
  return getPublicSupabaseEnv() !== null && getSupabaseSecretKey() !== null
}
