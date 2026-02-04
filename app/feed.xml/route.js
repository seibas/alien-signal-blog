/**
 * RSS Feed Generation
 * Provides RSS 2.0 feed for blog subscribers
 * Accessible at /feed.xml
 */

import { getAllPosts } from '@/content/posts';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://alien-signal-blog.vercel.app';
  const posts = await getAllPosts();

  // Get the 20 most recent posts
  const recentPosts = posts.slice(0, 20);

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Alien Signal Blog</title>
    <link>${baseUrl}</link>
    <description>A futuristic coding journal exploring JavaScript, React, Next.js, and web development. Broadcasting signals from the frontier of programming.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/og-image.jpg</url>
      <title>Alien Signal Blog</title>
      <link>${baseUrl}</link>
    </image>
${recentPosts
  .map((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const pubDate = new Date(post.date).toUTCString();
    const excerpt = post.excerpt || 'Read more...';

    // Extract first text block for description
    let description = excerpt;
    if (Array.isArray(post.blocks)) {
      const firstTextBlock = post.blocks.find(b => b.type === 'text');
      if (firstTextBlock) {
        description = firstTextBlock.value.substring(0, 300) + '...';
      }
    }

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@alien-signal-blog.vercel.app (Alien Signal)</author>
${post.tags ? `      <category>${Array.isArray(post.tags) ? post.tags.join('</category>\n      <category>') : post.tags}</category>` : ''}
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
