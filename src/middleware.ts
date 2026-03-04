import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/account', '/checkout'];
const adminRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const hasSupabase = supabaseUrl.startsWith('https://') && !supabaseUrl.includes('your-project-id');

  if (isDev && !hasSupabase) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  const response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/dashboard/:path*'],
};
