import { Redis } from '@upstash/redis';

// Initialize Redis client
let redis = null;
function getRedis() {
  if (redis) return redis;
  
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    console.warn('Redis not configured, using in-memory rate limiting (not recommended for production)');
    return null;
  }
  
  redis = new Redis({ url, token });
  return redis;
}

// Fallback in-memory rate limiter
const requestCounts = new Map();

const LIMITS = {
  anonymous: { requests: 3, window: 3600000 }, // 3 per hour
  registered: { requests: 10, window: 3600000 }, // 10 per hour
  pro: { requests: 50, window: 3600000 } // 50 per hour
};

export async function checkRateLimit(identifier, tier = 'anonymous') {
  const redis = getRedis();
  const limit = LIMITS[tier];
  const now = Date.now();
  
  // Use Redis if available
  if (redis) {
    try {
      const key = `ratelimit:${tier}:${identifier}`;
      const requests = await redis.get(key) || [];
      
      // Filter valid requests within time window
      const validRequests = Array.isArray(requests) 
        ? requests.filter(timestamp => now - timestamp < limit.window)
        : [];
      
      if (validRequests.length >= limit.requests) {
        const oldestRequest = Math.min(...validRequests);
        const timeUntilReset = limit.window - (now - oldestRequest);
        
        return {
          allowed: false,
          remaining: 0,
          resetIn: Math.ceil(timeUntilReset / 1000 / 60) // minutes
        };
      }
      
      // Add current request
      validRequests.push(now);
      
      // Store in Redis with expiration (in seconds)
      await redis.set(key, validRequests, { ex: Math.ceil(limit.window / 1000) });
      
      return {
        allowed: true,
        remaining: limit.requests - validRequests.length,
        resetIn: Math.ceil(limit.window / 1000 / 60)
      };
    } catch (error) {
      console.error('Redis rate limiting failed, falling back to in-memory:', error);
      // Fall through to in-memory implementation
    }
  }
  
  // Fallback: In-memory rate limiting (for development or if Redis fails)
  if (!requestCounts.has(identifier)) {
    requestCounts.set(identifier, []);
  }
  
  const userRequests = requestCounts.get(identifier);
  
  // Remove old requests outside the time window
  const validRequests = userRequests.filter(
    timestamp => now - timestamp < limit.window
  );
  
  if (validRequests.length >= limit.requests) {
    const oldestRequest = Math.min(...validRequests);
    const timeUntilReset = limit.window - (now - oldestRequest);
    
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil(timeUntilReset / 1000 / 60) // minutes
    };
  }
  
  // Add current request
  validRequests.push(now);
  requestCounts.set(identifier, validRequests);
  
  return {
    allowed: true,
    remaining: limit.requests - validRequests.length,
    resetIn: Math.ceil(limit.window / 1000 / 60)
  };
}

// Add this to your API route:
/*
import { checkRateLimit } from '@/lib/rateLimiter';

// In handler function:
const identifier = req.headers['x-forwarded-for'] || 'anonymous';
const rateLimit = checkRateLimit(identifier);

if (!rateLimit.allowed) {
  return res.status(429).json({
    error: `🛸 Cosmic bandwidth exceeded! Try again in ${rateLimit.resetIn} minutes.`,
    resetIn: rateLimit.resetIn
  });
}
*/
