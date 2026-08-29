import { createMiddleware } from '@frontman-ai/nextjs'
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const frontman = createMiddleware({
  host: 'api.frontman.sh',
})

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/frontman' || path.startsWith('/frontman/')) {
    const response = await frontman(request)
    if (response) return response
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    '/frontman',
    '/frontman/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}