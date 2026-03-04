import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Refresh session — this keeps the cookie alive
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Protected routes: require login
  const isProtected = pathname.startsWith('/account') || pathname.startsWith('/checkout') || pathname.startsWith('/dashboard');

  if (isProtected && !session) {
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/dashboard/:path*'],
};
