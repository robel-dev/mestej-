import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the path is exactly '/' (root), redirect to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Allow admin login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check if user is authenticated and is admin
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      
      // Get session token from cookies
      const authCookie = request.cookies.get('sb-oyadmezhfodmozpacsgq-auth-token');
      
      if (!authCookie) {
        // No session, redirect to admin login
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }

      // Parse the auth cookie (it's usually a JSON object)
      let token = authCookie.value;
      try {
        const parsedCookie = JSON.parse(authCookie.value);
        token = parsedCookie.access_token || parsedCookie;
      } catch {
        // If not JSON, use as-is
      }

      // Create Supabase client
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Verify user with token
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        // Invalid session, redirect to admin login
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        // Not an admin, redirect to admin login
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }

      // User is admin, allow access
      return NextResponse.next();
    } catch (error) {
      console.error('Admin middleware error:', error);
      // On error, redirect to admin login
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

