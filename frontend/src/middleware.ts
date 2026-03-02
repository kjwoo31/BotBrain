import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Bypass auth when Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    if (path === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Supabase auth flow
  const { createSupabaseServerClient } = await import('@/utils/supabase-server');
  const { supabase, response } = createSupabaseServerClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthRoute = path === '/';
  const isProtectedRoute = path !== '/';

  if (isAuthRoute && session) {
    const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
    redirectResponse.headers.set('x-auth-redirect', 'true');
    return redirectResponse;
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// Configure which routes should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next (Next.js internals)
     * - static files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon.ico).*)',
  ],
};

