import { Suspense } from 'react';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import BlogPostContent from './BlogPostContent';
import PostSkeleton from './PostSkeleton';

// Generate JSON-LD structured data for SEO
function generateJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Alien Signal',
      url: 'https://alien-signal.blog'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alien Signal Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://alien-signal.blog/icon.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://alien-signal.blog/blog/${post.slug}`
    },
    keywords: post.tags?.join(', ') || '',
    articleBody: post.blocks?.map(b => b.value).join(' ').substring(0, 500)
  };
}

/**
 * Optimized blog post page following React Best Practices:
 * - Server Component by default (no 'use client')
 * - Direct data fetching with cached function
 * - Suspense boundary for streaming
 * - Minimal serialization at RSC boundary
 *
 * Rules applied:
 * - 1.5: Strategic Suspense Boundaries
 * - 3.2: Minimize Serialization at RSC Boundaries
 * - 3.4: Per-Request Deduplication with React.cache()
 */

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found | Alien Signal Blog' };
  }

  return {
    title: `${post.title} | Alien Signal Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <section className="container">
        <div className="card cardPad">
          <h1 className="h2">Signal lost</h1>
          <p className="p">That log entry was not found.</p>
          <div style={{ height: 14 }} />
          <Link className="btn btnPrimary" href="/blog">Back to Logbook</Link>
        </div>
      </section>
    );
  }

  // Generate structured data for SEO
  const jsonLd = generateJsonLd(post);

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<PostSkeleton />}>
        <BlogPostContent post={post} />
      </Suspense>
    </>
  );
}
