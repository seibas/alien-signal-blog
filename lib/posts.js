import { cache } from 'react';
import { getPostBySlug as getPostFromContent, getAllPosts as getAllFromContent } from '@/content/posts';

/**
 * Cached post fetching with React.cache() for request deduplication
 * Multiple calls within the same request only execute once
 *
 * Rule 3.4: Per-Request Deduplication with React.cache()
 */
export const getPostBySlug = cache(async (slug) => {
  return await getPostFromContent(slug);
});

export const getAllPosts = cache(async () => {
  return await getAllFromContent();
});
