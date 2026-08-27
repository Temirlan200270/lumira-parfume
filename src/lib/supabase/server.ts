import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getPublicSupabaseEnv } from '@/lib/env'

export async function createSupabaseServerClient() {
  const env = getPublicSupabaseEnv()
  if (!env) {
    throw new Error('Supabase public env is not configured')
  }

  const cookieStore = await cookies()

  return createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot always persist cookies; Proxy refreshes the session.
        }
      },
    },
  })
}
