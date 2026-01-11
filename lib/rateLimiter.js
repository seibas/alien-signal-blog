// Simple in-memory rate limiter (upgrade to Redis/Upstash for production)
const requestCounts = new Map();

const LIMITS = {
  anonymous: { requests: 3, window: 3600000 }, // 3 per hour
  registered: { requests: 10, window: 3600000 }, // 10 per hour
  pro: { requests: 50, window: 3600000 } // 50 per hour
};

export function checkRateLimit(identifier, tier = 'anonymous') {
  const now = Date.now();
  const limit = LIMITS[tier];
  
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
