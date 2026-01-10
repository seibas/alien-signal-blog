'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';

/**
 * Related Posts component
 * Shows posts with matching tags, excluding the current post
 */
export default function RelatedPosts({ currentPost, allPosts }) {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (!currentPost || !allPosts) return;

    // Get current post tags
    const currentTags = Array.isArray(currentPost.tags)
      ? currentPost.tags
      : typeof currentPost.tags === 'string'
      ? currentPost.tags.split(',').map(t => t.trim().toLowerCase())
      : [];

    if (currentTags.length === 0) {
      setRelatedPosts([]);
      return;
    }

    // Find posts with matching tags
    const related = allPosts
      .filter(post => post.slug !== currentPost.slug) // Exclude current post
      .map(post => {
        // Get post tags
        const postTags = Array.isArray(post.tags)
          ? post.tags.map(t => t.toLowerCase())
          : typeof post.tags === 'string'
          ? post.tags.split(',').map(t => t.trim().toLowerCase())
          : [];

        // Count matching tags
        const matchCount = postTags.filter(tag =>
          currentTags.includes(tag)
        ).length;

        return { post, matchCount };
      })
      .filter(item => item.matchCount > 0) // Only posts with at least 1 matching tag
      .sort((a, b) => b.matchCount - a.matchCount) // Sort by most matches first
      .slice(0, 3) // Take top 3
      .map(item => item.post);

    setRelatedPosts(related);
  }, [currentPost, allPosts]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="related-posts">
      <div className="related-posts-header">
        <h2 className="h2">Related Transmissions</h2>
        <p className="p" style={{ fontSize: '14px', opacity: 0.7 }}>
          More posts from the same topic clusters
        </p>
      </div>

      <div className="postGrid">
        {relatedPosts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <style jsx>{`
        .related-posts {
          margin-top: 60px;
          padding-top: 60px;
          border-top: 1px solid var(--border-primary);
        }

        .related-posts-header {
          margin-bottom: 32px;
        }

        .related-posts-header .h2 {
          margin-bottom: 8px;
          background: linear-gradient(90deg, var(--color-green-primary), var(--color-orange-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        @media (max-width: 768px) {
          .related-posts {
            margin-top: 40px;
            padding-top: 40px;
          }

          .related-posts-header {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </section>
  );
}
