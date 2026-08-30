export function getSiteUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (production) {
    return production.startsWith('http') ? production.replace(/\/$/, '') : `https://${production}`
  }

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    return vercel.startsWith('http') ? vercel.replace(/\/$/, '') : `https://${vercel}`
  }

  return null
}

export function getPublicSupabaseEnv(): { url: string; publishableKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) return null
  return { url, publishableKey }
}

export function getSupabaseSecretKey(): string | null {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? null
}

export function getTelegramEnv(): { botToken: string; chatId: string } | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) return null
  return { botToken, chatId }
}

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0)
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}
