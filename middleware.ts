import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from './lib/rate-limit';

const limiter = rateLimit({
  interval: Number(process.env.RATE_LIMIT_WINDOW) || 60000,
  uniqueTokenPerInterval: 500,
  maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
});

export async function middleware(request: NextRequest) {
  // CORS headers
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Rate limiting
  try {
    await limiter.check(request);
  } catch {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};