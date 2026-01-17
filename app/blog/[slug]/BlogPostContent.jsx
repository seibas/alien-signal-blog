'use client';

import dynamic from 'next/dynamic';

/**
 * Client component wrapper for blog post content
 * Dynamically imports EditableBlogPost to reduce initial bundle
 *
 * Rule 2.4: Dynamic Imports for Heavy Components
 */
const EditableBlogPost = dynamic(
  () => import('@/components/EditableBlogPost'),
  {
    ssr: true,
    loading: () => (
      <article className="article">
        <div className="card cardPad">
          <div style={{ textAlign: 'center', padding: '2em', color: 'rgba(234,255,247,.7)' }}>
            🛸 Loading post...
          </div>
        </div>
      </article>
    ),
  }
);

export default function BlogPostContent({ post }) {
  return <EditableBlogPost post={post} />;
}
