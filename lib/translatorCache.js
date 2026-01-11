import { createHash } from 'crypto';

const cache = new Map(); // Use Redis in production

export function getCacheKey(question, language) {
  return createHash('md5')
    .update(`${question.toLowerCase().trim()}-${language}`)
    .digest('hex');
}

export function getCachedResponse(question, language) {
  const cacheKey = getCacheKey(question, language);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour
    return { ...cached.data, fromCache: true };
  }
  return null;
}

export function setCachedResponse(question, language, responseData) {
  const cacheKey = getCacheKey(question, language);
  cache.set(cacheKey, {
    data: responseData,
    timestamp: Date.now()
  });
}
