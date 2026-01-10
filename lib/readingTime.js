/**
 * Calculate estimated reading time for blog post content
 * Based on average reading speed of 200-250 words per minute
 */

const WORDS_PER_MINUTE = 225; // Average reading speed

/**
 * Calculates reading time from post content
 * @param {Object} post - Post object with blocks or content
 * @returns {string} - Reading time string (e.g., "3 min", "1 min")
 */
export function calculateReadingTime(post) {
  let text = '';

  // Extract text from blocks (new format)
  if (Array.isArray(post.blocks)) {
    text = post.blocks
      .map(block => {
        if (block.type === 'text') {
          // Remove markdown image syntax
          return block.value.replace(/!\[.*?\]\(.*?\)/g, '');
        } else if (block.type === 'code') {
          // Include code in word count (code takes longer to read)
          return block.value;
        }
        return '';
      })
      .join(' ');
  }
  // Extract text from content (old format)
  else if (post.content) {
    if (Array.isArray(post.content)) {
      text = post.content.join(' ');
    } else {
      text = post.content;
    }
    // Remove markdown image syntax
    text = text.replace(/!\[.*?\]\(.*?\)/g, '');
  }

  // Count words
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  // Calculate reading time in minutes
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  // Return formatted string
  return minutes === 1 ? '1 min' : `${minutes} min`;
}

/**
 * Updates post object with calculated reading time
 * @param {Object} post - Post object to update
 * @returns {Object} - Post object with readTime property
 */
export function addReadingTime(post) {
  return {
    ...post,
    readTime: calculateReadingTime(post)
  };
}

/**
 * Updates array of posts with calculated reading times
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Array of posts with readTime properties
 */
export function addReadingTimeToPosts(posts) {
  return posts.map(post => addReadingTime(post));
}
