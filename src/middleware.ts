import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { getCurrentUser } from '@/lib/supabase/user.actions'

const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/auth/forgot-password',
  '/auth/verification-email-sent'
];

export async function middleware(request: NextRequest) {
  const { data: { user } } = await getCurrentUser();

  const sessionResponse = await updateSession(request);
  
  if (user && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!user && !authRoutes.includes(request.nextUrl.pathname)) {
    return sessionResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - Static files (_next/static)
     * - Images (_next/image)
     * - Favicon
     * - Common asset files (e.g., SVG, PNG, etc.)
     */
    '/dashboard',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
