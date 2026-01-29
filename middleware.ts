import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Automatically detect the user's locale based on:
  // 1. Cookie (NEXT_LOCALE)
  // 2. Accept-Language header
  // 3. Default locale
  localeDetection: true,

  // Prefix the default locale in the URL (e.g., /en/about)
  // Set to 'as-needed' to omit the prefix for the default locale
  localePrefix: 'as-needed',
});

export default function middleware(request: NextRequest) {
  // 应用国际化中间件
  const response = intlMiddleware(request);

  // 添加安全响应头
  const headers = new Headers(response.headers);

  // 防止点击劫持
  headers.set('X-Frame-Options', 'DENY');

  // 防止 MIME 类型嗅探
  headers.set('X-Content-Type-Options', 'nosniff');

  // XSS 保护
  headers.set('X-XSS-Protection', '1; mode=block');

  // 引用策略
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 权限策略
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // 内容安全策略（CSP）
  // 注意：这是一个基本的 CSP，可能需要根据实际需求调整
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https://api.stripe.com;
    frame-src https://js.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  headers.set('Content-Security-Policy', cspHeader);

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - Static files (images, etc.)
  matcher: [
    // Match all pathnames except for static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    // Also match root
    '/',
  ],
};
