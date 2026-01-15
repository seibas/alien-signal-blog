import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis instance for rate limiting
let redis;
try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_KV_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_KV_TOKEN,
  });
} catch (error) {
  console.error('Failed to initialize Redis for rate limiting:', error);
}

// Create rate limiter - 10 requests per 10 seconds per IP
export const ratelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
}) : null;

/**
 * Apply rate limiting to an API route
 * @param {Request} request - Next.js request object
 * @returns {Promise<{success: boolean, limit?: number, remaining?: number, reset?: number}>}
 */
export async function applyRateLimit(request) {
  if (!ratelimit) {
    // If rate limiting not configured, allow all requests
    return { success: true };
  }

  // Get identifier from IP address or fallback
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') || 
    'anonymous';

  try {
    const result = await ratelimit.limit(identifier);
    return result;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On error, allow the request through
    return { success: true };
  }
}

/**
 * Create a rate limit response
 * @param {number} reset - Reset timestamp
 * @returns {Response} - Next.js Response with rate limit error
 */
export function rateLimitResponse(reset) {
  return new Response(
    JSON.stringify({ 
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: reset ? new Date(reset).toISOString() : null
    }),
    { 
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': reset ? Math.ceil((reset - Date.now()) / 1000).toString() : '60'
      }
    }
  );
}
