import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { checkGlobalRateLimit } from '@/lib/rate-limit';

/**
 * middleware.ts — Global Edge Middleware
 *
 * Applies Upstash Redis distributed rate limiting (60 req/min per IP) to sensitive API routes.
 * Refreshes the Supabase auth session and handles redirects ONLY for protected routes.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Distributed rate limiting for sensitive API routes ────────────────
  if (
    pathname.startsWith('/api/generate-record') ||
    pathname.startsWith('/api/auth')
  ) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1';

    const { allowed, remaining } = await checkGlobalRateLimit(ip);

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      );
    }
  }

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname === '/signup';

  let supabaseResponse = NextResponse.next({ request });

  // ── 2. Supabase session refresh (ONLY for protected routes) ───────────────
  if (isProtectedRoute) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.warn('[middleware] Supabase env vars missing — passing request through');
        return supabaseResponse;
      }

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Redirect unauthenticated users away from /dashboard
      if (pathname.startsWith('/dashboard') && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }

      // Redirect authenticated users away from /login and /signup
      if ((pathname === '/login' || pathname === '/signup') && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('[middleware] Error:', error);
      // Always return a valid response — never let Edge function crash to 404
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/api/:path*'
  ],
};
