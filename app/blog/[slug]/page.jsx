'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import EditableBlogPost from "@/components/EditableBlogPost";

export default function BlogPostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the post from the database with cache-busting
    fetch(`/api/posts/list?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        console.log('=== POST DEBUG ===');
        console.log('Total posts fetched:', data.posts?.length);
        console.log('Looking for slug:', params.slug);
        console.log('All slugs in database:', data.posts?.map(p => p.slug));
        if (data.posts) {
          const foundPost = data.posts.find(p => p.slug === params.slug);
          console.log('Found post:', foundPost ? foundPost.title : 'NOT FOUND');
          if (foundPost) {
            console.log('Post structure:', { 
              hasBlocks: !!foundPost.blocks, 
              hasContent: !!foundPost.content,
              blocksLength: foundPost.blocks?.length,
              contentLength: foundPost.content?.length 
            });
          }
          setPost(foundPost || null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching post:', err);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      <section className="container">
        <div className="card cardPad">
          <p className="p">Loading...</p>
        </div>
      </section>
    );
  }

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

  return (
    <EditableBlogPost post={post} />
  );
}
