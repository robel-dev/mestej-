import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the path is exactly '/' (root), redirect to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // Extract locale from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const locale = pathParts[0] === 'en' || pathParts[0] === 'sv' ? pathParts[0] : 'en';

  // Create a response object that we'll modify
  let response = NextResponse.next({
    request,
  });

  // Create Supabase client with proper cookie handling
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get user session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Allow admin login page
    if (pathname === '/admin/login') {
      return response;
    }

    // Check if user is authenticated
    if (userError || !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // Check if user is admin
    try {
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
      return response;
    } catch (error) {
      console.error('Admin middleware error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Ordering and Webshop route protection - require authentication
  if (pathname.includes('/ordering') || pathname.includes('/webshop')) {
    // Allow login and signup pages
    if (pathname.includes('/login') || pathname.includes('/signup')) {
      return response;
    }

    // Check if user is authenticated
    if (userError || !user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    // User is authenticated, allow access
    // Note: Additional status checks (approved/pending) are handled by the page components
    return response;
  }

  return response;
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

