import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes: string[] = ['/home'];

function isProtected(pathname: string) {
  return protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('jwt')?.value;

  if (token && (pathname === '/' || pathname === '/login')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!token && isProtected(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callback', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
